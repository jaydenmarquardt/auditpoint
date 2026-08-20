import * as React from "react";
import { PreviewDialog } from "../../components/actions/PreviewDialog";
import { Button } from "../../components/actions/Button";
import { Badge } from "../../components/feedback/Badge";
import { Theme } from "../../theme/Theme.api";
import { PermissionsAuditContent } from "./PermissionsAudit.content";
import { formatNumber } from "../../utils/Format.util";
export const LevelDialog = ({ level, grants, onDismiss }) => {
    var _a;
    if (!level)
        return null;
    const rights = (_a = level.permissions) !== null && _a !== void 0 ? _a : [];
    const holders = grants.filter((grant) => grant.roles.indexOf(level.name) !== -1);
    return (React.createElement(PreviewDialog, { open: Boolean(level), onDismiss: onDismiss, title: level.name, description: level.description || undefined, facts: [
            {
                label: PermissionsAuditContent.columns.type,
                value: (React.createElement(Badge, { label: level.isCustom ? PermissionsAuditContent.columns.custom : PermissionsAuditContent.columns.builtIn, tone: level.isCustom ? "warning" : "neutral" })),
            },
            { label: PermissionsAuditContent.level.rights, value: formatNumber(rights.length) },
            { label: PermissionsAuditContent.level.holders, value: formatNumber(holders.length) },
        ], actions: React.createElement(Button, { label: "Close", variant: "primary", onClick: onDismiss }), sections: [
            {
                key: "rights",
                title: PermissionsAuditContent.level.rights,
                content: rights.length === 0 ? (React.createElement("p", { style: { margin: 0, color: Theme.palette().textMuted } }, PermissionsAuditContent.level.noRights)) : (React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.xs, flexWrap: "wrap" } }, rights.map((permission) => (React.createElement(Badge, { key: permission, label: permission, tone: "info", showIcon: false }))))),
            },
            {
                key: "holders",
                title: PermissionsAuditContent.level.holders,
                content: holders.length === 0 ? (React.createElement("p", { style: { margin: 0, color: Theme.palette().textMuted } }, PermissionsAuditContent.level.noHolders)) : (React.createElement("ul", { style: { margin: 0, paddingLeft: Theme.tokens.space.lg } }, holders.map((grant) => (React.createElement("li", { key: `${grant.scope}-${grant.scopeUrl}-${grant.principalId}` },
                    grant.principalTitle,
                    " on ",
                    grant.scopeTitle,
                    " (",
                    PermissionsAuditContent.scope[grant.scope],
                    ")"))))),
            },
        ] }));
};
//# sourceMappingURL=Level.dialog.js.map