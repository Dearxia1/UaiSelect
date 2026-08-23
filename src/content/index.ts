import { ExtensionMessage, SelectedElementData } from '../types';
import { UaiSelectOverlay } from './overlay';

// Inject Main World bridge into the web page to directly read React Fiber & window properties
function injectMainWorldBridge() {
  if (document.getElementById('uaiselect-main-world-bridge')) return;
  const script = document.createElement('script');
  script.id = 'uaiselect-main-world-bridge';
  script.src = chrome.runtime.getURL('mainWorld.js');
  (document.head || document.documentElement).appendChild(script);
}

try {
  injectMainWorldBridge();
} catch (e) {
  console.error('Failed to inject UaiSelect Main World bridge:', e);
}

const overlay = new UaiSelectOverlay((data: SelectedElementData) => {
  // Element was selected! Send data to background script
  chrome.runtime.sendMessage({
    type: 'ELEMENT_SELECTED',
    payload: data,
  });
});

// Listen for messages from background / popup / shortcuts
chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  if (message.type === 'TOGGLE_INSPECTOR') {
    injectMainWorldBridge();
    const isNowActive = overlay.toggle();
    sendResponse({ active: isNowActive });
    return true;
  }

  if (message.type === 'START_INSPECTION') {
    injectMainWorldBridge();
    overlay.activate();
    sendResponse({ active: true });
    return true;
  }

  if (message.type === 'STOP_INSPECTION') {
    overlay.deactivate();
    sendResponse({ active: false });
    return true;
  }
});
