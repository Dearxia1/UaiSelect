export interface SourceLocation {
    fileName: string;
    lineNumber: number;
    columnNumber?: number;
    componentName?: string;
    framework?: 'react' | 'vue' | 'svelte' | 'astro' | 'angular' | 'unknown';
}
export interface ComponentHierarchyNode {
    name: string;
    tag: string;
    source?: SourceLocation;
    isCustomComponent?: boolean;
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
export interface ComponentEventData {
    name: string;
    handlerName?: string;
}
export interface ComponentDataContext {
    props?: Record<string, any>;
    state?: Record<string, any>;
    events?: ComponentEventData[];
}
export interface SelectedElementData {
    tagName: string;
    id?: string;
    className?: string;
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
    screenshotUrl?: string;
    fullPageScreenshotUrl?: string;
    url: string;
    pageTitle: string;
    timestamp: number;
}
