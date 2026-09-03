export interface SourceLocation {
  fileName: string;
  lineNumber: number;
  columnNumber?: number;
  componentName?: string;
  framework?: 'react' | 'vue' | 'svelte' | 'vanilla' | 'unknown';
}

export interface ComputedStyleSummary {
  display: string;
  position: string;
  width: string;
  height: string;
  margin: string;
  padding: string;
  color: string;
  backgroundColor: string;
  fontSize: string;
  fontFamily: string;
  borderRadius: string;
  border: string;
  gap?: string;
  flexDirection?: string;
}

export interface ComponentHierarchyNode {
  name: string;
  tag: string;
  source?: SourceLocation;
  isCustomComponent: boolean;
}

export interface ComponentEventData {
  name: string; // e.g. onClick, onChange, onSubmit
  handlerName?: string; // e.g. 'handleSubmit', 'anonymous', 'inline'
}

export interface ComponentDataContext {
  props?: Record<string, any>;
  state?: Record<string, any> | any[];
  events?: ComponentEventData[];
}

export interface SelectedElementData {
  tagName: string;
  id: string;
  className: string;
  classList: string[];
  tailwindClasses: string[];
  customClasses: string[];
  source?: SourceLocation;
  hierarchy: ComponentHierarchyNode[];
  innerHTMLSnippet: string;
  outerHTMLSnippet: string;
  innerTextSnippet: string;
  computedStyles: ComputedStyleSummary;
  dataContext?: ComponentDataContext;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    left: number;
    bottom: number;
    right: number;
  };
  viewport: {
    width: number;
    height: number;
    devicePixelRatio: number;
  };
  screenshotUrl?: string; // Data URL of the visible viewport snapshot
  fullPageScreenshotUrl?: string; // Data URL of the full scrollable page snapshot
  url: string;
  pageTitle: string;
  timestamp: number;
}

export type PromptMode = 'fix-visual' | 'add-feature' | 'refactor' | 'tailwind-convert' | 'custom' | 'explain';

export interface PromptTemplate {
  id: PromptMode;
  label: string;
  iconName: string;
  description: string;
  generatePrompt: (data: SelectedElementData, userInstruction?: string) => string;
}

export interface CardVisibilitySettings {
  showHierarchy: boolean;
  showSnapshot: boolean;
  showState: boolean;
  showStyles: boolean;
  showPrompt: boolean;
}

export interface AppSettings {
  autoCaptureScreenshot: boolean;
  showFloatingBanner: boolean;
  theme: 'dark' | 'light' | 'system';
  highlightColor: string;
  backgroundColor: string;
  customPromptPrefix: string;
  cards: CardVisibilitySettings;
}

export type ExtensionMessage =
  | { type: 'TOGGLE_INSPECTOR' }
  | { type: 'START_INSPECTION' }
  | { type: 'STOP_INSPECTION' }
  | { type: 'ELEMENT_SELECTED'; payload: SelectedElementData }
  | { type: 'CAPTURE_TAB_REQUEST'; rect: SelectedElementData['rect'] }
  | { type: 'CAPTURE_TAB_RESPONSE'; screenshotUrl: string }
  | { type: 'CAPTURE_FULL_PAGE_REQUEST' }
  | { type: 'CAPTURE_FULL_PAGE_RESPONSE'; screenshotUrl: string }
  | { type: 'CAPTURE_VIEWPORT_REQUEST' }
  | { type: 'CAPTURE_VIEWPORT_RESPONSE'; screenshotUrl: string }
  | { type: 'CAPTURE_SLICE_REQUEST' }
  | { type: 'CAPTURE_SLICE_RESPONSE'; dataUrl: string }
  | { type: 'TAKE_SCREENSHOT' }
  | { type: 'SCREENSHOT_TAKEN'; screenshotUrl: string }
  | { type: 'GET_LAST_SELECTED' }
  | { type: 'LAST_SELECTED_RESPONSE'; payload: SelectedElementData | null };
