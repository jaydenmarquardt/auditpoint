import { __awaiter } from "tslib";
import { AuditPointBaseWebPart } from "../AuditPointBaseWebPart";
/**
 * The stock host: every module, no narrowing. Anything solution specific belongs in
 * the consuming solution's own subclass rather than here.
 */
export default class AuditPointWebPart extends AuditPointBaseWebPart {
    /** This is the reference host, so it carries the component board. */
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            return { componentBoard: true };
        });
    }
}
//# sourceMappingURL=AuditPointWebPart.js.map