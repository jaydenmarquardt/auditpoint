import * as React from "react";
import { DisplayMode } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp";
import { AccessProfile } from "@/api/Sp.types";

export interface AppContextValue {
  webPart: WebPartContext;
  sp: SPFI;
  access: AccessProfile;
  webUrl: string;
  webTitle: string;
  displayMode: DisplayMode;
  editMode: boolean;
}

const AppContext = React.createContext<AppContextValue | undefined>(undefined);

export const AppContextProvider = AppContext.Provider;

/** Reads resolved user/site without prop drilling; getSp() covers non-React code. */
export function useApp(): AppContextValue {
  const value = React.useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside <AppContextProvider>.");
  return value;
}

export function useSp(): SPFI {
  return useApp().sp;
}

export function useAccess(): AccessProfile {
  return useApp().access;
}

export function useEditMode(): boolean {
  return useApp().editMode;
}
