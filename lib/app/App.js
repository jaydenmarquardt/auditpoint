import * as React from "react";
import { DisplayMode } from "@microsoft/sp-core-library";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import { AppContextProvider } from "../core/context/App.context";
import { Permissions } from "../api/Permissions.api";
import { getSp } from "../api/Sp.api";
import { useSettings } from "../api/Settings.api";
import { useAsync } from "../core/hooks/useAsync";
import { LoadingState } from "../components/states/Loading.state";
import { ErrorState } from "../components/states/Error.state";
import { UnauthorisedState } from "../components/states/Unauthorised.state";
import { ErrorBoundary } from "../components/states/ErrorBoundary";
import { AppContent } from "./App.content";
import { Shell } from "./Shell";
import { registerBuiltInTasks } from "../core/queue/Queue.tasks";
import { registerModules } from "../modules/Modules.registry";
import { restoreFullscreenPreference } from "../core/hooks/useFullscreen";
import { restoreQueue } from "../core/queue/Queue.persist";
import { useLeaveGuard } from "../core/hooks/useLeaveGuard";
import { injectGlobalStyles } from "../theme/Global.styles";
initializeIcons(undefined, { disableWarnings: true });
registerBuiltInTasks();
registerModules();
export const App = ({ context, displayMode }) => {
    const access = useAsync(() => Permissions().accessProfile(), { isEmpty: () => false });
    const appName = useSettings((settings) => settings.appName);
    React.useEffect(() => {
        injectGlobalStyles();
        restoreFullscreenPreference();
        restoreQueue();
    }, []);
    useLeaveGuard();
    if (access.status === "loading" || access.status === "idle") {
        return React.createElement(LoadingState, { label: AppContent.boot.checkingAccess });
    }
    if (access.status === "unauthorised")
        return React.createElement(UnauthorisedState, { appName: appName });
    if (access.status === "error" || !access.data) {
        return React.createElement(ErrorState, { detail: access.error, onRetry: access.reload });
    }
    if (!access.data.isAdmin)
        return React.createElement(UnauthorisedState, { userName: access.data.user.title, appName: appName });
    return (React.createElement(ErrorBoundary, null,
        React.createElement(AppContextProvider, { value: {
                webPart: context,
                sp: getSp(),
                access: access.data,
                webUrl: context.pageContext.web.absoluteUrl,
                webTitle: context.pageContext.web.title,
                displayMode,
                editMode: displayMode === DisplayMode.Edit,
            } },
            React.createElement(Shell, null))));
};
export default App;
//# sourceMappingURL=App.js.map