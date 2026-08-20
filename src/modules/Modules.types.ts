import * as React from "react";
import { ReportDefinition } from "@/core/report/Report.types";

export type ModuleGroup = "overview" | "audits" | "tools" | "system";

export interface Module {
  key: string;
  label: string;
  /** Bumped when the module ships behaviour or schema changes. */
  version: string;
  description: string;
  iconName: string;
  group: ModuleGroup;
  hidden?: boolean;
  /** Tools work without report storage, so they are not gated on configuration. */
  requiresConfig?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  report?: ReportDefinition<any, any>;
  load: () => Promise<{ default: React.ComponentType }>;
}
