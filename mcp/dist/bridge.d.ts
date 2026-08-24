import http from 'node:http';
import { SelectedElementData } from './types.js';
export declare const BRIDGE_PORT = 42123;
export declare const BRIDGE_HOST = "127.0.0.1";
export declare function getCurrentElement(): SelectedElementData | null;
export declare function setCurrentElement(data: SelectedElementData): void;
export declare function onElementChange(listener: (elem: SelectedElementData) => void): () => void;
export declare function startLocalBridge(port?: number): Promise<http.Server>;
