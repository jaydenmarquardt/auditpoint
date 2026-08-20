import { registerReport } from "../core/report/Report.store";
import { listsAuditReport } from "./listsAudit/ListsAudit.report";
import { webPartAuditReport } from "./webPartAudit/WebPartAudit.report";
import { indexingAuditReport } from "./indexingAudit/IndexingAudit.report";
import { permissionsAuditReport } from "./permissionsAudit/PermissionsAudit.report";
import { usersAuditReport } from "./usersAudit/UsersAudit.report";
import { contentAuditReport } from "./contentAudit/ContentAudit.report";
import { publishingAuditReport } from "./publishingAudit/PublishingAudit.report";
import { imagesAuditReport } from "./imagesAudit/ImagesAudit.report";
import { linkAuditReport } from "./linkAudit/LinkAudit.report";
export const MODULES = [
    {
        key: "lists-audit",
        label: "Lists and libraries",
        version: "1.2.0",
        description: "Items, folders, files, sizes, file types, content types, versioning and permissions for every list.",
        iconName: "BulletedList",
        group: "audits",
        report: listsAuditReport,
        load: () => import(/* webpackChunkName: "app-lists-audit" */ "@/modules/listsAudit/ListsAudit.page"),
    },
    {
        key: "webpart-audit",
        label: "Web parts",
        version: "1.3.0",
        description: "Every web part placed on a page, where it sits and the properties it was saved with.",
        iconName: "Puzzle",
        group: "audits",
        report: webPartAuditReport,
        load: () => import(/* webpackChunkName: "app-webpart-audit" */ "@/modules/webPartAudit/WebPartAudit.page"),
    },
    {
        key: "indexing-audit",
        label: "Indexing",
        version: "1.1.0",
        description: "Crawl settings, index coverage per list, item spot checks and managed properties.",
        iconName: "SearchAndApps",
        group: "audits",
        report: indexingAuditReport,
        load: () => import(/* webpackChunkName: "app-indexing-audit" */ "@/modules/indexingAudit/IndexingAudit.page"),
    },
    {
        key: "permissions-audit",
        label: "Permissions",
        version: "1.2.0",
        description: "Groups, permission levels, every role assignment, broken inheritance and direct user grants.",
        iconName: "Permissions",
        group: "audits",
        report: permissionsAuditReport,
        load: () => import(
        /* webpackChunkName: "app-permissions-audit" */ "@/modules/permissionsAudit/PermissionsAudit.page"),
    },
    {
        key: "users-audit",
        label: "Users and groups",
        version: "1.2.0",
        description: "Site users over time, group membership, external accounts and profile completeness.",
        iconName: "People",
        group: "audits",
        report: usersAuditReport,
        load: () => import(/* webpackChunkName: "app-users-audit" */ "@/modules/usersAudit/UsersAudit.page"),
    },
    {
        key: "content-audit",
        label: "Content",
        version: "1.1.0",
        description: "Word counts, headings, images and alt text, links, tables and embeds across pages and rich text columns.",
        iconName: "TextDocument",
        group: "audits",
        report: contentAuditReport,
        load: () => import(/* webpackChunkName: "app-content-audit" */ "@/modules/contentAudit/ContentAudit.page"),
    },
    {
        key: "publishing-audit",
        label: "Publishing",
        version: "1.1.0",
        description: "Approval status, edit frequency, versions, review and expiry dates, stale and unviewed content.",
        iconName: "PageEdit",
        group: "audits",
        report: publishingAuditReport,
        load: () => import(
        /* webpackChunkName: "app-publishing-audit" */ "@/modules/publishingAudit/PublishingAudit.page"),
    },
    {
        key: "images-audit",
        label: "Images",
        version: "1.0.0",
        description: "Image files, formats and sizes, where each image is used, duplicates, unused files and missing alt text.",
        iconName: "Photo2",
        group: "audits",
        report: imagesAuditReport,
        load: () => import(/* webpackChunkName: "app-images-audit" */ "@/modules/imagesAudit/ImagesAudit.page"),
    },
    {
        key: "link-audit",
        label: "Links",
        version: "1.0.0",
        description: "Every link on a page, in a list item, in a menu or inside a document, what it resolves to, and what is broken, legacy, external or insecure.",
        iconName: "Link",
        group: "audits",
        report: linkAuditReport,
        load: () => import(/* webpackChunkName: "app-link-audit" */ "@/modules/linkAudit/LinkAudit.page"),
    },
    {
        key: "search-tool",
        label: "Search",
        version: "1.3.0",
        description: "Query the search index, build KQL, inspect managed properties and check indexing.",
        iconName: "Search",
        group: "tools",
        requiresConfig: false,
        load: () => import(/* webpackChunkName: "app-search-tool" */ "@/modules/searchTool/SearchTool.page"),
    },
];
/** Every report is registered whatever the host allows, so a saved run still opens. */
export function registerModules() {
    MODULES.forEach((app) => {
        if (app.report)
            registerReport(app.report);
    });
}
export function findModule(key) {
    return MODULES.find((app) => app.key === key);
}
/**
 * Modules the host allows at all. A host web part sets this once at start up; an
 * empty list means the host has no opinion and every registered module is offered.
 */
let hostAllowed;
export function setHostModules(keys) {
    hostAllowed = keys && keys.length > 0 ? keys : undefined;
}
export function hostModules() {
    return hostAllowed;
}
/**
 * True when the host allows the module and the site has not switched it off. Keys
 * that are not modules at all, such as Settings or Reports, are always allowed:
 * locking a host down must never cost it the page that unlocks it again.
 */
export function isModuleEnabled(key, disabled = []) {
    if (!findModule(key))
        return true;
    if (hostAllowed && hostAllowed.indexOf(key) === -1)
        return false;
    return disabled.indexOf(key) === -1;
}
/** The modules a host offers, whether or not the site has switched each one on. */
export function offeredModules() {
    return hostAllowed ? MODULES.filter((module) => (hostAllowed === null || hostAllowed === void 0 ? void 0 : hostAllowed.indexOf(module.key)) !== -1) : MODULES;
}
export function enabledModules(disabled = []) {
    return offeredModules().filter((module) => disabled.indexOf(module.key) === -1);
}
//# sourceMappingURL=Modules.registry.js.map