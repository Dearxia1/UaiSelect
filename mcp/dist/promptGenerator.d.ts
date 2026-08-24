import { SelectedElementData } from './types.js';
export declare function formatDataContext(data: SelectedElementData): string;
export declare function generatePrompt(data: SelectedElementData, mode?: 'fix-visual' | 'add-feature' | 'refactor' | 'tailwind-convert' | 'custom' | 'explain', userInstruction?: string): string;
