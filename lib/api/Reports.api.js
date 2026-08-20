import { __awaiter } from "tslib";
import { getSp, getSiteRelativeUrl } from "./Sp.api";
import { throttled } from "./Throttle.api";
import { getSettings } from "./Settings.api";
import { joinPath } from "../utils/Url.util";
import { PermissionKind } from "@pnp/sp/security";
import { toErrorMessage } from "../utils/Guard.util";
export function reportLocation(overrides = {}) {
    var _a, _b;
    const settings = getSettings();
    return {
        library: (_a = overrides.library) !== null && _a !== void 0 ? _a : settings.reportLibrary,
        folder: (_b = overrides.folder) !== null && _b !== void 0 ? _b : settings.reportFolder,
        webUrl: overrides.webUrl,
    };
}
export function reportFolderUrl(location = reportLocation()) {
    const siteRelative = location.webUrl ? new URL(location.webUrl).pathname : getSiteRelativeUrl();
    return joinPath(siteRelative, location.library, location.folder);
}
function folderAccess(location) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = reportFolderUrl(location);
        const sp = getSp(location.webUrl);
        const [canView, canEdit] = yield Promise.all([
            permission(location, PermissionKind.ViewListItems),
            permission(location, PermissionKind.EditListItems),
        ]);
        try {
            yield throttled(() => sp.web.getFolderByServerRelativePath(url).select("Exists")(), {
                label: "Reports.check",
                priority: true,
                retries: 0,
            });
            return { url, exists: true, canView, canEdit };
        }
        catch (error) {
            return { url, exists: false, canView, canEdit, error: toErrorMessage(error) };
        }
    });
}
function permission(location, kind) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield throttled(() => getSp(location.webUrl).web.currentUserHasPermissions(kind), {
                label: "Reports.permission",
                priority: true,
                retries: 0,
            });
        }
        catch (_a) {
            return false;
        }
    });
}
const INDEX_FILE = "index.json";
export function Reports(location = reportLocation()) {
    const folder = () => reportFolderUrl(location);
    const sp = () => getSp(location.webUrl);
    return {
        folderUrl() {
            return folder();
        },
        checkFolder() {
            return folderAccess(location);
        },
        ensureFolder() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield throttled(() => sp().web.folders.addUsingPath(folder(), true), { label: "Reports.ensure" });
                }
                catch (error) {
                    return Object.assign(Object.assign({}, (yield folderAccess(location))), { error: toErrorMessage(error) });
                }
                return folderAccess(location);
            });
        },
        index() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const text = yield throttled(() => sp().web.getFileByServerRelativePath(`${folder()}/${INDEX_FILE}`).getText(), { label: "Reports.index", priority: true, retries: 0 });
                    return JSON.parse(text);
                }
                catch (_a) {
                    return [];
                }
            });
        },
        list() {
            return __awaiter(this, void 0, void 0, function* () {
                const [entries, files] = yield Promise.all([
                    this.index(),
                    throttled(() => sp()
                        .web.getFolderByServerRelativePath(folder())
                        .files.select("Name", "ServerRelativeUrl", "TimeLastModified", "Length")(), { label: "Reports.list" }),
                ]);
                const byName = new Map(entries.map((entry) => [entry.fileName, entry]));
                return files
                    .filter((file) => file.Name.endsWith(".json") && file.Name !== INDEX_FILE)
                    .map((file) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    const entry = byName.get(file.Name);
                    return {
                        id: (_a = entry === null || entry === void 0 ? void 0 : entry.id) !== null && _a !== void 0 ? _a : file.Name.replace(/\.json$/i, ""),
                        name: file.Name,
                        kind: (_b = entry === null || entry === void 0 ? void 0 : entry.kind) !== null && _b !== void 0 ? _b : file.Name.split("__")[0],
                        title: (_c = entry === null || entry === void 0 ? void 0 : entry.title) !== null && _c !== void 0 ? _c : "",
                        status: (_d = entry === null || entry === void 0 ? void 0 : entry.status) !== null && _d !== void 0 ? _d : "complete",
                        serverRelativeUrl: file.ServerRelativeUrl,
                        modified: (_e = entry === null || entry === void 0 ? void 0 : entry.updatedIso) !== null && _e !== void 0 ? _e : file.TimeLastModified,
                        sizeBytes: Number((_f = file.Length) !== null && _f !== void 0 ? _f : 0),
                        createdBy: (_g = entry === null || entry === void 0 ? void 0 : entry.createdBy) !== null && _g !== void 0 ? _g : "",
                        createdByLogin: (_h = entry === null || entry === void 0 ? void 0 : entry.createdByLogin) !== null && _h !== void 0 ? _h : "",
                    };
                })
                    .sort((a, b) => b.modified.localeCompare(a.modified));
            });
        },
        read(serverRelativeUrl) {
            return __awaiter(this, void 0, void 0, function* () {
                const text = yield throttled(() => sp().web.getFileByServerRelativePath(serverRelativeUrl).getText(), { label: "Reports.read", priority: true });
                return JSON.parse(text);
            });
        },
        save(envelope) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                yield this.ensureFolder();
                const fileName = `${envelope.kind}__${envelope.id}.json`;
                const body = new Blob([JSON.stringify(envelope)], { type: "application/json" });
                const result = yield throttled(() => sp()
                    .web.getFolderByServerRelativePath(folder())
                    .files.addUsingPath(fileName, body, { Overwrite: true }), { label: "Reports.save" });
                yield writeIndex(location, folder, sp, toIndexEntry(envelope, fileName));
                return {
                    id: envelope.id,
                    name: fileName,
                    kind: envelope.kind,
                    title: envelope.title,
                    status: envelope.status,
                    serverRelativeUrl: result.ServerRelativeUrl,
                    modified: envelope.updatedIso,
                    sizeBytes: 0,
                    createdBy: envelope.createdBy,
                    createdByLogin: (_a = envelope.createdByLogin) !== null && _a !== void 0 ? _a : "",
                };
            });
        },
        remove(serverRelativeUrl) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                yield throttled(() => sp().web.getFileByServerRelativePath(serverRelativeUrl).recycle(), {
                    label: "Reports.remove",
                });
                const fileName = (_a = serverRelativeUrl.split("/").pop()) !== null && _a !== void 0 ? _a : "";
                const entries = (yield this.index()).filter((entry) => entry.fileName !== fileName);
                yield writeIndexFile(folder, sp, entries);
            });
        },
    };
}
function toIndexEntry(envelope, fileName) {
    var _a;
    return {
        id: envelope.id,
        kind: envelope.kind,
        title: envelope.title,
        version: envelope.version,
        status: envelope.status,
        createdIso: envelope.createdIso,
        updatedIso: envelope.updatedIso,
        createdBy: envelope.createdBy,
        createdByLogin: (_a = envelope.createdByLogin) !== null && _a !== void 0 ? _a : "",
        sites: envelope.sites,
        issues: envelope.issues.length,
        stages: envelope.stages.map((stage) => ({ key: stage.key, label: stage.label, status: stage.status })),
        fileName,
    };
}
/** One small index file keeps status and owner readable without opening every report. */
function writeIndex(location, folder, sp, entry) {
    return __awaiter(this, void 0, void 0, function* () {
        const existing = yield Reports(location).index();
        const entries = [entry, ...existing.filter((candidate) => candidate.id !== entry.id)];
        yield writeIndexFile(folder, sp, entries);
    });
}
function writeIndexFile(folder, sp, entries) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = new Blob([JSON.stringify(entries)], { type: "application/json" });
        yield throttled(() => sp().web.getFolderByServerRelativePath(folder()).files.addUsingPath(INDEX_FILE, body, { Overwrite: true }), { label: "Reports.index.write" }).catch(() => undefined);
    });
}
//# sourceMappingURL=Reports.api.js.map