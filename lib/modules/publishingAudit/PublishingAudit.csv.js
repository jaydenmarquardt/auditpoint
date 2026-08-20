import { expiryDate, reviewDate, statusLabel } from "./PublishingAudit.logic";
import { downloadCsv } from "../../utils/Export.util";
export function itemRow(item) {
    var _a, _b, _c, _d, _e, _f;
    return {
        site: item.siteUrl,
        list: item.listTitle,
        itemId: item.itemId,
        title: item.title,
        url: item.url,
        status: statusLabel(item.moderationStatus),
        createdBy: item.authorTitle,
        created: item.created,
        lastEditedBy: item.editorTitle,
        modified: item.modified,
        version: item.versionLabel,
        versionCount: (_a = item.versionCount) !== null && _a !== void 0 ? _a : "",
        versionEditors: ((_b = item.versionEditors) !== null && _b !== void 0 ? _b : []).join("|"),
        reviewDate: (_c = reviewDate(item)) !== null && _c !== void 0 ? _c : "",
        expiryDate: (_d = expiryDate(item)) !== null && _d !== void 0 ? _d : "",
        viewsRecent: (_e = item.viewsRecent) !== null && _e !== void 0 ? _e : "",
        viewsLifetime: (_f = item.viewsLifetime) !== null && _f !== void 0 ? _f : "",
    };
}
export function exportPublishingAudit(data) {
    var _a;
    downloadCsv("publishing-audit", ((_a = data === null || data === void 0 ? void 0 : data.items) !== null && _a !== void 0 ? _a : []).map(itemRow));
}
//# sourceMappingURL=PublishingAudit.csv.js.map