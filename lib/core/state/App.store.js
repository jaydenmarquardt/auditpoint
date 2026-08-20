import { createStore, useStore } from "./Store";
import { writeRoute } from "../../utils/Url.util";
const initialState = {
    route: "dashboard",
    sidebarOpen: true,
    fullscreen: false,
    queueBarOpen: false,
};
export const appStore = createStore(initialState);
export function navigate(route) {
    writeRoute(route);
    appStore.setState((state) => (Object.assign(Object.assign({}, state), { route })));
}
export function toggleSidebar() {
    appStore.setState((state) => (Object.assign(Object.assign({}, state), { sidebarOpen: !state.sidebarOpen })));
}
export function setSidebarOpen(open) {
    appStore.setState((state) => (Object.assign(Object.assign({}, state), { sidebarOpen: open })));
}
export function setFullscreen(fullscreen) {
    appStore.setState((state) => (Object.assign(Object.assign({}, state), { fullscreen })));
}
export function setQueueBarOpen(open) {
    appStore.setState((state) => (Object.assign(Object.assign({}, state), { queueBarOpen: open })));
}
export function toggleQueueBar() {
    appStore.setState((state) => (Object.assign(Object.assign({}, state), { queueBarOpen: !state.queueBarOpen })));
}
export function toggleFullscreen() {
    appStore.setState((state) => (Object.assign(Object.assign({}, state), { fullscreen: !state.fullscreen })));
}
export function useAppState(selector) {
    return useStore(appStore, selector !== null && selector !== void 0 ? selector : ((state) => state));
}
//# sourceMappingURL=App.store.js.map