import * as React from "react";
import { DisplayMode } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp";
import { AccessProfile } from "../../api/Sp.types";
export interface AppContextValue {
    webPart: WebPartContext;
    sp: SPFI;
    access: AccessProfile;
    webUrl: string;
    webTitle: string;
    displayMode: DisplayMode;
    editMode: boolean;
}
export declare const AppContextProvider: React.Provider<AppContextValue | undefined>;
/** Reads resolved user/site without prop drilling; getSp() covers non-React code. */
export declare function useApp(): AppContextValue;
export declare function useSp(): SPFI;
export declare function useAccess(): AccessProfile;
export declare function useEditMode(): boolean;
//# sourceMappingURL=App.context.d.ts.map