import * as React from "react";
export interface TopbarProps {
    sidebarOpen: boolean;
    onToggleSidebar: () => void;
    fullscreen: boolean;
    onToggleFullscreen: () => void;
    fullscreenAllowed: boolean;
    activeTaskCount: number;
    onOpenQueue: () => void;
    userName: string;
    siteTitle: string;
}
export declare const Topbar: React.FC<TopbarProps>;
//# sourceMappingURL=Topbar.d.ts.map