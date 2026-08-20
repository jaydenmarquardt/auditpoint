import { createStore, useStore } from "@/core/state/Store";
import { writeRoute } from "@/utils/Url.util";

export interface AppState {
  route: string;
  sidebarOpen: boolean;
  fullscreen: boolean;
  queueBarOpen: boolean;
}

const initialState: AppState = {
  route: "dashboard",
  sidebarOpen: true,
  fullscreen: false,
  queueBarOpen: false,
};

export const appStore = createStore<AppState>(initialState);

export function navigate(route: string): void {
  writeRoute(route);
  appStore.setState((state) => ({ ...state, route }));
}

export function toggleSidebar(): void {
  appStore.setState((state) => ({ ...state, sidebarOpen: !state.sidebarOpen }));
}

export function setSidebarOpen(open: boolean): void {
  appStore.setState((state) => ({ ...state, sidebarOpen: open }));
}

export function setFullscreen(fullscreen: boolean): void {
  appStore.setState((state) => ({ ...state, fullscreen }));
}

export function setQueueBarOpen(open: boolean): void {
  appStore.setState((state) => ({ ...state, queueBarOpen: open }));
}

export function toggleQueueBar(): void {
  appStore.setState((state) => ({ ...state, queueBarOpen: !state.queueBarOpen }));
}

export function toggleFullscreen(): void {
  appStore.setState((state) => ({ ...state, fullscreen: !state.fullscreen }));
}

export function useAppState(): AppState;
export function useAppState<TSlice>(selector: (state: AppState) => TSlice): TSlice;
export function useAppState<TSlice>(selector?: (state: AppState) => TSlice): TSlice | AppState {
  return useStore(appStore, selector ?? ((state) => state as unknown as TSlice));
}
