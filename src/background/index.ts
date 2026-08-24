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

// Helper to find the active tab across windows and side panels
async function getActiveTab(): Promise<chrome.tabs.Tab | undefined> {
  const tabsCurrent = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabsCurrent && tabsCurrent.length > 0 && tabsCurrent[0].id) {
    return tabsCurrent[0];
  }
  const tabsFocused = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (tabsFocused && tabsFocused.length > 0 && tabsFocused[0].id) {
    return tabsFocused[0];
  }
  const allActive = await chrome.tabs.query({ active: true });
  if (allActive && allActive.length > 0 && allActive[0].id) {
    return allActive[0];
  }
  return undefined;
}

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-inspector') {
    const targetTab = await getActiveTab();
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

  if (message.type === 'CAPTURE_VIEWPORT_REQUEST' || message.type === 'TAKE_SCREENSHOT') {
    getActiveTab().then(async (activeTab) => {
      const windowId = activeTab?.windowId;
      if (windowId) {
        chrome.tabs.captureVisibleTab(windowId, { format: 'png' }, (dataUrl) => {
          const url = (!chrome.runtime.lastError && dataUrl) ? dataUrl : '';
          if (url) {
            chrome.storage.local.get(['lastSelectedElement'], (storageRes) => {
              if (storageRes.lastSelectedElement) {
                storageRes.lastSelectedElement.screenshotUrl = url;
                chrome.storage.local.set({ lastSelectedElement: storageRes.lastSelectedElement });
                chrome.runtime.sendMessage({
                  type: 'ELEMENT_SELECTED',
                  payload: storageRes.lastSelectedElement,
                }).catch(() => {});
              }
            });
          }
          sendResponse({ screenshotUrl: url });
        });
      } else {
        sendResponse({ screenshotUrl: '' });
      }
    }).catch(() => {
      sendResponse({ screenshotUrl: '' });
    });
    return true;
  }

  if (message.type === 'CAPTURE_FULL_PAGE_REQUEST') {
    getActiveTab().then(async (activeTab) => {
      if (!activeTab?.id) {
        sendResponse({ screenshotUrl: '' });
        return;
      }

      const sendFullPageCapture = async () => {
        return new Promise<string>((resolve) => {
          chrome.tabs.sendMessage(activeTab.id!, { type: 'DO_FULL_PAGE_CAPTURE' }, (res) => {
            if (chrome.runtime.lastError || !res?.screenshotUrl) {
              resolve('');
            } else {
              resolve(res.screenshotUrl);
            }
          });
        });
      };

      let screenshotUrl = await sendFullPageCapture();
      if (!screenshotUrl) {
        // Try injecting content.js if missing
        try {
          await chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: ['content.js'],
          });
          screenshotUrl = await sendFullPageCapture();
        } catch {}
      }

      if (screenshotUrl) {
        chrome.storage.local.get(['lastSelectedElement'], (storageRes) => {
          if (storageRes.lastSelectedElement) {
            storageRes.lastSelectedElement.fullPageScreenshotUrl = screenshotUrl;
            chrome.storage.local.set({ lastSelectedElement: storageRes.lastSelectedElement });
            chrome.runtime.sendMessage({
              type: 'ELEMENT_SELECTED',
              payload: storageRes.lastSelectedElement,
            }).catch(() => {});
          }
        });
        sendResponse({ screenshotUrl });
      } else {
        sendResponse({ screenshotUrl: '' });
      }
    }).catch(() => {
      sendResponse({ screenshotUrl: '' });
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
