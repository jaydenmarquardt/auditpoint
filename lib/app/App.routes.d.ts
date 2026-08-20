import * as React from "react";
import { ModuleGroup } from "../modules/Modules.types";
export interface RouteDefinition {
    key: string;
    label: string;
    iconName: string;
    description: string;
    group: ModuleGroup;
    hidden?: boolean;
    load: () => Promise<{
        default: React.ComponentType;
    }>;
}
export declare const ROUTES: RouteDefinition[];
export declare const DEFAULT_ROUTE = "dashboard";
export declare function findRoute(key: string): RouteDefinition | undefined;
export declare const GROUP_LABELS: Record<ModuleGroup, string>;
//# sourceMappingURL=App.routes.d.ts.map