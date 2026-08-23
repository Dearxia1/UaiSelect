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
  screenshotUrl?: string; // Data URL of the snapshot
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
  showSource: boolean;
  showHierarchy: boolean;
  showSnapshot: boolean;
  showStyles: boolean;
  showPrompt: boolean;
}

export interface AppSettings {
  defaultEditor: 'vscode' | 'cursor' | 'webstorm' | 'custom';
  customEditorScheme: string;
  autoCaptureScreenshot: boolean;
  theme: 'dark' | 'light' | 'system';
  highlightColor: string;
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
  | { type: 'OPEN_IN_EDITOR'; source: SourceLocation }
  | { type: 'GET_LAST_SELECTED' }
  | { type: 'LAST_SELECTED_RESPONSE'; payload: SelectedElementData | null };
