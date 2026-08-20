import { __awaiter } from "tslib";
import { SitePages } from "../../api/SitePages.api";
import { Reports } from "../../api/Reports.api";
import { toErrorMessage } from "../../utils/Guard.util";
import { checkConfig } from "../../api/Settings.api";
export function loadDashboardSummary() {
    return __awaiter(this, void 0, void 0, function* () {
        const configured = checkConfig().configured;
        const [pages, reports] = yield Promise.all([
            SitePages().getItems({ top: 500 }),
            // The reports folder only exists after the first save.
            !configured
                ? Promise.resolve([])
                : Reports()
                    .list()
                    .catch((error) => {
                    if (/does not exist|not found|404/i.test(toErrorMessage(error, "")))
                        return [];
                    throw error;
                }),
        ]);
        return { pageCount: pages.length, reports, latestReport: reports[0] };
    });
}
//# sourceMappingURL=Dashboard.logic.js.map