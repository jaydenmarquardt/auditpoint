import { registerReport } from "@/core/report/Report.store";
import { Module } from "@/modules/Modules.types";
import { listsAuditReport } from "@/modules/listsAudit/ListsAudit.report";
import { webPartAuditReport } from "@/modules/webPartAudit/WebPartAudit.report";
import { indexingAuditReport } from "@/modules/indexingAudit/IndexingAudit.report";
import { permissionsAuditReport } from "@/modules/permissionsAudit/PermissionsAudit.report";
import { usersAuditReport } from "@/modules/usersAudit/UsersAudit.report";
import { contentAuditReport } from "@/modules/contentAudit/ContentAudit.report";
import { publishingAuditReport } from "@/modules/publishingAudit/PublishingAudit.report";
import { imagesAuditReport } from "@/modules/imagesAudit/ImagesAudit.report";
import { linkAuditReport } from "@/modules/linkAudit/LinkAudit.report";

export const MODULES: Module[] = [
  {
    key: "lists-audit",
    label: "Lists and libraries",
    version: "1.2.0",
    description: "Items, folders, files, sizes, file types, content types, versioning and permissions for every list.",
    iconName: "BulletedList",
    group: "audits",
    report: listsAuditReport,
    load: () =>
      import(/* webpackChunkName: "app-lists-audit" */ "@/modules/listsAudit/ListsAudit.page") as Promise<{
        default: React.ComponentType;
      }>,
  },
  {
    key: "webpart-audit",
    label: "Web parts",
    version: "1.3.0",
    description: "Every web part placed on a page, where it sits and the properties it was saved with.",
    iconName: "Puzzle",
    group: "audits",
    report: webPartAuditReport,
    load: () =>
      import(/* webpackChunkName: "app-webpart-audit" */ "@/modules/webPartAudit/WebPartAudit.page") as Promise<{
        default: React.ComponentType;
      }>,
  },
  {
    key: "indexing-audit",
    label: "Indexing",
    version: "1.1.0",
    description: "Crawl settings, index coverage per list, item spot checks and managed properties.",
    iconName: "SearchAndApps",
    group: "audits",
    report: indexingAuditReport,
    load: () =>
      import(/* webpackChunkName: "app-indexing-audit" */ "@/modules/indexingAudit/IndexingAudit.page") as Promise<{
        default: React.ComponentType;
      }>,
  },
  {
    key: "permissions-audit",
    label: "Permissions",
    version: "1.2.0",
    description: "Groups, permission levels, every role assignment, broken inheritance and direct user grants.",
    iconName: "Permissions",
    group: "audits",
    report: permissionsAuditReport,
    load: () =>
      import(
        /* webpackChunkName: "app-permissions-audit" */ "@/modules/permissionsAudit/PermissionsAudit.page"
      ) as Promise<{ default: React.ComponentType }>,
  },
  {
    key: "users-audit",
    label: "Users and groups",
    version: "1.2.0",
    description: "Site users over time, group membership, external accounts and profile completeness.",
    iconName: "People",
    group: "audits",
    report: usersAuditReport,
    load: () =>
      import(/* webpackChunkName: "app-users-audit" */ "@/modules/usersAudit/UsersAudit.page") as Promise<{
        default: React.ComponentType;
      }>,
  },
  {
    key: "content-audit",
    label: "Content",
    version: "1.1.0",
    description: "Word counts, headings, images and alt text, links, tables and embeds across pages and rich text columns.",
    iconName: "TextDocument",
    group: "audits",
    report: contentAuditReport,
    load: () =>
      import(/* webpackChunkName: "app-content-audit" */ "@/modules/contentAudit/ContentAudit.page") as Promise<{
        default: React.ComponentType;
      }>,
  },
  {
    key: "publishing-audit",
    label: "Publishing",
    version: "1.1.0",
    description: "Approval status, edit frequency, versions, review and expiry dates, stale and unviewed content.",
    iconName: "PageEdit",
    group: "audits",
    report: publishingAuditReport,
    load: () =>
      import(
        /* webpackChunkName: "app-publishing-audit" */ "@/modules/publishingAudit/PublishingAudit.page"
      ) as Promise<{ default: React.ComponentType }>,
  },
  {
    key: "images-audit",
    label: "Images",
    version: "1.0.0",
    description: "Image files, formats and sizes, where each image is used, duplicates, unused files and missing alt text.",
    iconName: "Photo2",
    group: "audits",
    report: imagesAuditReport,
    load: () =>
      import(/* webpackChunkName: "app-images-audit" */ "@/modules/imagesAudit/ImagesAudit.page") as Promise<{
        default: React.ComponentType;
      }>,
  },
  {
    key: "link-audit",
    label: "Links",
    version: "1.0.0",
    description:
      "Every link on a page, in a list item, in a menu or inside a document, what it resolves to, and what is broken, legacy, external or insecure.",
    iconName: "Link",
    group: "audits",
    report: linkAuditReport,
    load: () =>
      import(/* webpackChunkName: "app-link-audit" */ "@/modules/linkAudit/LinkAudit.page") as Promise<{
        default: React.ComponentType;
      }>,
  },
  {
    key: "search-tool",
    label: "Search",
    version: "1.3.0",
    description: "Query the search index, build KQL, inspect managed properties and check indexing.",
    iconName: "Search",
    group: "tools",
    requiresConfig: false,
    load: () =>
      import(/* webpackChunkName: "app-search-tool" */ "@/modules/searchTool/SearchTool.page") as Promise<{
        default: React.ComponentType;
      }>,
  },
];

/** Every report is registered whatever the host allows, so a saved run still opens. */
export function registerModules(): void {
  MODULES.forEach((app) => {
    if (app.report) registerReport(app.report);
  });
}

export function findModule(key: string): Module | undefined {
  return MODULES.find((app) => app.key === key);
}

/**
 * Modules the host allows at all. A host web part sets this once at start up; an
 * empty list means the host has no opinion and every registered module is offered.
 */
let hostAllowed: string[] | undefined;
/** Routes the host has switched off, such as the component board on a live intranet. */
const hiddenRoutes = new Set<string>();

export function setHiddenRoutes(keys: string[]): void {
  hiddenRoutes.clear();
  keys.forEach((key) => hiddenRoutes.add(key));
}

export function isRouteVisible(key: string): boolean {
  return !hiddenRoutes.has(key);
}

export function setHostModules(keys: string[] | undefined): void {
  hostAllowed = keys && keys.length > 0 ? keys : undefined;
}

export function hostModules(): string[] | undefined {
  return hostAllowed;
}

/**
 * True when the host allows the module and the site has not switched it off. Keys
 * that are not modules at all, such as Settings or Reports, are always allowed:
 * locking a host down must never cost it the page that unlocks it again.
 */
export function isModuleEnabled(key: string, disabled: string[] = []): boolean {
  if (!isRouteVisible(key)) return false;
  if (!findModule(key)) return true;
  if (hostAllowed && hostAllowed.indexOf(key) === -1) return false;
  return disabled.indexOf(key) === -1;
}

/** The modules a host offers, whether or not the site has switched each one on. */
export function offeredModules(): Module[] {
  return hostAllowed ? MODULES.filter((module) => hostAllowed?.indexOf(module.key) !== -1) : MODULES;
}

export function enabledModules(disabled: string[] = []): Module[] {
  return offeredModules().filter((module) => disabled.indexOf(module.key) === -1);
}
