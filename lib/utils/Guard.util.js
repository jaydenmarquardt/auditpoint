export function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
export function isDefined(value) {
    return value !== null && value !== undefined;
}
/** Narrow an unknown thrown value into something renderable. */
export function toErrorMessage(error, fallback = "Something went wrong.") {
    if (error instanceof Error && isNonEmptyString(error.message))
        return error.message;
    if (isNonEmptyString(error))
        return error;
    return fallback;
}
/** SharePoint returns 401/403 in several shapes depending on the transport. */
export function isUnauthorised(error) {
    var _a;
    const status = (_a = error === null || error === void 0 ? void 0 : error.status) !== null && _a !== void 0 ? _a : error === null || error === void 0 ? void 0 : error.httpStatus;
    if (status === 401 || status === 403)
        return true;
    return /\b(401|403|access denied|unauthoriz)/i.test(toErrorMessage(error, ""));
}
//# sourceMappingURL=Guard.util.js.map