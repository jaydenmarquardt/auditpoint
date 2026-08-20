import * as React from "react";
const AppContext = React.createContext(undefined);
export const AppContextProvider = AppContext.Provider;
/** Reads resolved user/site without prop drilling; getSp() covers non-React code. */
export function useApp() {
    const value = React.useContext(AppContext);
    if (!value)
        throw new Error("useApp must be used inside <AppContextProvider>.");
    return value;
}
export function useSp() {
    return useApp().sp;
}
export function useAccess() {
    return useApp().access;
}
export function useEditMode() {
    return useApp().editMode;
}
//# sourceMappingURL=App.context.js.map