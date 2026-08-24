import { ExtensionMessage, SelectedElementData } from '../types';

// Configure side panel behavior on installation (Chrome)
chrome.runtime.onInstalled.addListener(() => {
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {});
  }
});

// Helper to open side panel / sidebar in Chrome or Firefox
async function openSidebarPanel(tab?: chrome.tabs.Tab) {
  // 1. Chrome SidePanel API
  if (chrome.sidePanel && tab?.id) {
    try {
      await chrome.sidePanel.open({ tabId: tab.id });
      return;
    } catch {
      if (tab.windowId) {
        try {
          await chrome.sidePanel.open({ windowId: tab.windowId });
          return;
        } catch {}
      }
    }
  }

  // 2. Firefox SidebarAction API
  const firefoxBrowser = (globalThis as any).browser || (globalThis as any).chrome;
  if (firefoxBrowser?.sidebarAction?.open) {
    try {
      await firefoxBrowser.sidebarAction.open();
    } catch {}
  }
}

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-inspector') {
    let targetTab: chrome.tabs.Tab | undefined;

    const tabsCurrent = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabsCurrent && tabsCurrent.length > 0 && tabsCurrent[0].id) {
      targetTab = tabsCurrent[0];
    } else {
      const tabsFocused = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      if (tabsFocused && tabsFocused.length > 0 && tabsFocused[0].id) {
        targetTab = tabsFocused[0];
      } else {
        const allActive = await chrome.tabs.query({ active: true });
        if (allActive && allActive.length > 0 && allActive[0].id) {
          targetTab = allActive[0];
        }
      }
    }

    if (!targetTab?.id) return;

    try {
      await chrome.tabs.sendMessage(targetTab.id, { type: 'TOGGLE_INSPECTOR' });
    } catch {
      // Content script might not be injected yet into page
      try {
        await chrome.scripting.executeScript({
          target: { tabId: targetTab.id },
          files: ['content.js'],
        });
        await chrome.tabs.sendMessage(targetTab.id, { type: 'TOGGLE_INSPECTOR' });
      } catch (err) {
        console.error('Failed to inject or toggle inspector:', err);
      }
    }
  }
});

function forwardToMcpBridge(data: SelectedElementData) {
  fetch('http://127.0.0.1:42123/api/element', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).catch(() => {});
}

// Handle runtime messages
chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
  if (message.type === 'ELEMENT_SELECTED') {
    const tab = sender.tab;
    const data: SelectedElementData = message.payload;

    chrome.storage.local.get(['settings'], (res) => {
      const autoCapture = res.settings?.autoCaptureScreenshot !== false;

      if (autoCapture && tab?.windowId) {
        // 60ms delay ensures the visual overlay DOM is 100% hidden by compositor before capture
        setTimeout(() => {
          chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, (dataUrl) => {
            if (dataUrl && !chrome.runtime.lastError) {
              data.screenshotUrl = dataUrl;
            }

            // Store selected element
            chrome.storage.local.set({ lastSelectedElement: data });

            // Forward to MCP Bridge (Cursor, Claude, Antigravity, Windsurf)
            forwardToMcpBridge(data);

            // Forward to sidepanel or popup
            chrome.runtime.sendMessage({
              type: 'ELEMENT_SELECTED',
              payload: data,
            }).catch(() => {});

            // Open Side Panel / Sidebar automatically on selection
            openSidebarPanel(tab);
          });
        }, 60);
      } else {
        // Store selected element without screenshot
        chrome.storage.local.set({ lastSelectedElement: data });

        // Forward to MCP Bridge
        forwardToMcpBridge(data);

        chrome.runtime.sendMessage({
          type: 'ELEMENT_SELECTED',
          payload: data,
        }).catch(() => {});

        openSidebarPanel(tab);
      }
    });

    sendResponse({ received: true });
    return true;
  }

  if (message.type === 'CAPTURE_SLICE_REQUEST') {
    const windowId = sender.tab?.windowId;
    if (windowId) {
      chrome.tabs.captureVisibleTab(windowId, { format: 'png' }, (dataUrl) => {
        sendResponse({ dataUrl: dataUrl || '' });
      });
    } else {
      sendResponse({ dataUrl: '' });
    }
    return true;
  }

  if (message.type === 'CAPTURE_FULL_PAGE_REQUEST') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        chrome.tabs.sendMessage(activeTab.id, { type: 'DO_FULL_PAGE_CAPTURE' }, (res) => {
          if (res && res.screenshotUrl) {
            // Update lastSelectedElement fullPageScreenshotUrl
            chrome.storage.local.get(['lastSelectedElement'], (storageRes) => {
              if (storageRes.lastSelectedElement) {
                storageRes.lastSelectedElement.fullPageScreenshotUrl = res.screenshotUrl;
                chrome.storage.local.set({ lastSelectedElement: storageRes.lastSelectedElement });
              }
            });
            sendResponse({ screenshotUrl: res.screenshotUrl });
          } else {
            sendResponse({ screenshotUrl: '' });
          }
        });
      } else {
        sendResponse({ screenshotUrl: '' });
      }
    });
    return true;
  }

  if (message.type === 'GET_LAST_SELECTED') {
    chrome.storage.local.get(['lastSelectedElement'], (res) => {
      sendResponse({ payload: res.lastSelectedElement || null });
    });
    return true;
  }
});
