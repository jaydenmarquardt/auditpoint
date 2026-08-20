import { Module } from "./Modules.types";
export declare const MODULES: Module[];
/** Every report is registered whatever the host allows, so a saved run still opens. */
export declare function registerModules(): void;
export declare function findModule(key: string): Module | undefined;
export declare function setHiddenRoutes(keys: string[]): void;
export declare function isRouteVisible(key: string): boolean;
export declare function setHostModules(keys: string[] | undefined): void;
export declare function hostModules(): string[] | undefined;
/**
 * True when the host allows the module and the site has not switched it off. Keys
 * that are not modules at all, such as Settings or Reports, are always allowed:
 * locking a host down must never cost it the page that unlocks it again.
 */
export declare function isModuleEnabled(key: string, disabled?: string[]): boolean;
/** The modules a host offers, whether or not the site has switched each one on. */
export declare function offeredModules(): Module[];
export declare function enabledModules(disabled?: string[]): Module[];
//# sourceMappingURL=Modules.registry.d.ts.map