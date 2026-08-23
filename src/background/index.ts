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
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_INSPECTOR' });
    } catch {
      // Content script might not be injected yet into page
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js'],
        });
        await chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_INSPECTOR' });
      } catch (err) {
        console.error('Failed to inject or toggle inspector:', err);
      }
    }
  }
});

// Helper to open file in editor
function openInEditor(fileName: string, lineNumber: number, editor = 'vscode') {
  let scheme = 'vscode';
  if (editor === 'cursor') scheme = 'cursor';
  if (editor === 'webstorm') scheme = 'webstorm';

  const cleanPath = fileName.replace(/^[a-zA-Z]+:\/\//, '');
  const url = `${scheme}://file/${cleanPath}:${lineNumber}`;
  
  chrome.tabs.create({ url });
}

// Handle runtime messages
chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
  if (message.type === 'ELEMENT_SELECTED') {
    const tab = sender.tab;
    const data: SelectedElementData = message.payload;

    // Capture tab screenshot
    if (tab?.windowId) {
      chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, (dataUrl) => {
        if (dataUrl && !chrome.runtime.lastError) {
          data.screenshotUrl = dataUrl;
        }

        // Store selected element
        chrome.storage.local.set({ lastSelectedElement: data });

        // Forward to sidepanel or popup
        chrome.runtime.sendMessage({
          type: 'ELEMENT_SELECTED',
          payload: data,
        }).catch(() => {});

        // Open Side Panel / Sidebar automatically on selection
        openSidebarPanel(tab);
      });
    } else {
      chrome.storage.local.set({ lastSelectedElement: data });
      openSidebarPanel(tab);
    }

    sendResponse({ received: true });
    return true;
  }

  if (message.type === 'OPEN_IN_EDITOR') {
    chrome.storage.local.get(['settings'], (res) => {
      const editor = res.settings?.defaultEditor || 'vscode';
      openInEditor(message.source.fileName, message.source.lineNumber, editor);
    });
    sendResponse({ opened: true });
    return true;
  }

  if (message.type === 'GET_LAST_SELECTED') {
    chrome.storage.local.get(['lastSelectedElement'], (res) => {
      sendResponse({ payload: res.lastSelectedElement || null });
    });
    return true;
  }
});
