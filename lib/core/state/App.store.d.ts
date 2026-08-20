export interface AppState {
    route: string;
    sidebarOpen: boolean;
    fullscreen: boolean;
    queueBarOpen: boolean;
}
export declare const appStore: import("./Store").Store<AppState>;
export declare function navigate(route: string): void;
export declare function toggleSidebar(): void;
export declare function setSidebarOpen(open: boolean): void;
export declare function setFullscreen(fullscreen: boolean): void;
export declare function setQueueBarOpen(open: boolean): void;
export declare function toggleQueueBar(): void;
export declare function toggleFullscreen(): void;
export declare function useAppState(): AppState;
export declare function useAppState<TSlice>(selector: (state: AppState) => TSlice): TSlice;
//# sourceMappingURL=App.store.d.ts.map