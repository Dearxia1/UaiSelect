export declare function handleGetSelectedElement(): {
    content: {
        type: string;
        text: string;
    }[];
};
export declare function handleGetElementPrompt(args: {
    mode?: 'fix-visual' | 'add-feature' | 'refactor' | 'tailwind-convert' | 'custom' | 'explain';
    userInstruction?: string;
}): {
    content: {
        type: string;
        text: string;
    }[];
};
export declare function handleGetComponentHierarchy(): {
    content: {
        type: string;
        text: string;
    }[];
};
export declare function handleGetStylesAndProps(): {
    content: {
        type: string;
        text: string;
    }[];
};
export declare function handleOpenElementSource(args: {
    editor?: 'cursor' | 'code' | 'windsurf';
}): {
    content: {
        type: string;
        text: string;
    }[];
};
