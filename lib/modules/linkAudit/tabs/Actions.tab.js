import * as React from "react";
import { Button } from "../../../components/actions/Button";
import { Card } from "../../../components/layout/Card";
import { Theme } from "../../../theme/Theme.api";
import { LinkAuditContent } from "../LinkAudit.content";
import { exportBrokenAudit, exportExternalAudit, exportFullAudit, exportReferenceList, exportUntestedAudit, } from "../LinkAudit.csv";
/** Every export in one place, each saying what it holds before it is downloaded. */
export const ActionsTab = ({ view }) => {
    const { references, links } = { references: view.references, links: view.links };
    const actions = [
        {
            key: "full",
            label: LinkAuditContent.exportCsv,
            description: LinkAuditContent.actions.fullAudit,
            iconName: "ExcelDocument",
            disabled: view.totals.outgoing === 0,
            run: () => exportFullAudit(references, links.length),
        },
        {
            key: "external",
            label: LinkAuditContent.exportExternal,
            description: LinkAuditContent.actions.external,
            iconName: "Globe",
            disabled: view.totals.external === 0,
            run: () => exportExternalAudit(references, links.length),
        },
        {
            key: "broken",
            label: LinkAuditContent.exportBroken,
            description: LinkAuditContent.actions.broken,
            iconName: "RemoveLink",
            disabled: view.totals.broken === 0,
            run: () => exportBrokenAudit(references, links.length),
        },
        {
            key: "untested",
            label: LinkAuditContent.exportUntested,
            description: LinkAuditContent.actions.untested,
            iconName: "Help",
            disabled: view.untested.length === 0,
            run: () => exportUntestedAudit(references, links.length),
        },
        {
            key: "references",
            label: LinkAuditContent.exportReferences,
            description: LinkAuditContent.actions.references,
            iconName: "Documentation",
            disabled: references.length === 0,
            run: () => exportReferenceList(references),
        },
    ];
    return (React.createElement(Card, { title: LinkAuditContent.actions.title, subtitle: LinkAuditContent.actions.description },
        React.createElement("div", { style: {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
                gap: Theme.tokens.space.md,
                minWidth: 0,
            } }, actions.map((action) => (React.createElement("div", { key: action.key, style: {
                border: `1px solid ${Theme.palette().border}`,
                borderRadius: Theme.tokens.radius.md,
                padding: Theme.tokens.space.md,
                display: "grid",
                gap: Theme.tokens.space.sm,
                alignContent: "start",
                minWidth: 0,
            } },
            React.createElement("p", { style: { margin: 0, color: Theme.palette().textMuted } }, action.description),
            React.createElement("div", null,
                React.createElement(Button, { label: action.label, iconName: action.iconName, variant: "primary", disabled: action.disabled, title: action.disabled ? LinkAuditContent.actions.disabled : action.description, onClick: action.run }))))))));
};
//# sourceMappingURL=Actions.tab.js.map