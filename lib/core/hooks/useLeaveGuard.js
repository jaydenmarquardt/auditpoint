import { useEffect } from "react";
import { isActive, queueStore } from "../queue/Queue.store";
/** Warns before a reload or navigation drops an in-flight task. */
export function useLeaveGuard() {
    useEffect(() => {
        const onBeforeUnload = (event) => {
            const running = queueStore.getState().tasks.filter((task) => isActive(task.status));
            if (running.length === 0)
                return undefined;
            event.preventDefault();
            event.returnValue = "";
            return "";
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, []);
}
//# sourceMappingURL=useLeaveGuard.js.map