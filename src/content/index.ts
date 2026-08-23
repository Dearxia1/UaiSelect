import { ExtensionMessage, SelectedElementData } from '../types';
import { UaiSelectOverlay } from './overlay';

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
    const isNowActive = overlay.toggle();
    sendResponse({ active: isNowActive });
    return true;
  }

  if (message.type === 'START_INSPECTION') {
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
