import * as React from "react";
import { Card } from "../../components/layout/Card";
import { TextField } from "../../components/inputs/TextField";
import { TextArea } from "../../components/inputs/TextArea";
import { NumberField } from "../../components/inputs/NumberField";
import { Toggle } from "../../components/inputs/Toggle";
import { Dropdown } from "../../components/inputs/Dropdown";
import { Badge } from "../../components/feedback/Badge";
import { Theme } from "../../theme/Theme.api";
export function ReportConfigPanel({ title, definition, config, onChange, disabled, bare, }) {
    const values = config;
    const set = (key, value) => onChange(Object.assign(Object.assign({}, values), { [key]: value }));
    const groups = definition.configFields.reduce((all, field) => {
        var _a, _b;
        const group = (_a = field.group) !== null && _a !== void 0 ? _a : "";
        return Object.assign(Object.assign({}, all), { [group]: [...((_b = all[group]) !== null && _b !== void 0 ? _b : []), field] });
    }, {});
    // Scope first, then the names it needs, then how far it goes, then the rest.
    const ORDER = ["", "What to scan", "Columns and paths", "Limits", "Thresholds", "Options"];
    const ordered = Object.keys(groups).sort((first, second) => {
        const left = ORDER.indexOf(first);
        const right = ORDER.indexOf(second);
        return (left === -1 ? ORDER.length : left) - (right === -1 ? ORDER.length : right);
    });
    const row = (field) => (React.createElement("li", { key: field.key, style: {
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 220px)",
            alignItems: "center",
            gap: Theme.tokens.space.md,
            padding: `${Theme.tokens.space.md} 0`,
            borderBottom: `1px solid ${Theme.palette().border}`,
        } },
        React.createElement("div", { style: { minWidth: 0 } },
            React.createElement("div", { style: { fontWeight: 600 } }, field.label),
            field.description && (React.createElement("div", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted } }, field.description))),
        React.createElement("div", { style: { justifySelf: "end", width: "100%" } }, control(field, values[field.key], set, disabled))));
    const list = (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md } },
        ordered.map((group) => (React.createElement("section", { key: group || "general" },
            group && (React.createElement("h3", { style: {
                    margin: `0 0 ${Theme.tokens.space.xs}`,
                    fontSize: Theme.tokens.font.sm,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: Theme.palette().textMuted,
                } }, group)),
            React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0 } }, groups[group].map(row))))),
        React.createElement("p", { style: { margin: 0, fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted } }, definition.description)));
    if (bare)
        return list;
    return (React.createElement(Card, { title: title, subtitle: definition.description, actions: React.createElement(Badge, { label: `v${definition.version}`, tone: "neutral", showIcon: false }) }, list));
}
function control(field, value, set, disabled) {
    var _a;
    if (field.type === "toggle") {
        return (React.createElement("div", { style: { display: "flex", justifyContent: "flex-end" } },
            React.createElement(Toggle, { label: "", checked: Boolean(value), onChange: (next) => set(field.key, next), disabled: disabled, onText: "On", offText: "Off", inlineLabel: true })));
    }
    if (field.type === "number") {
        return (React.createElement(NumberField, { label: "", value: Number(value !== null && value !== void 0 ? value : 0), onChange: (next) => set(field.key, next), min: field.min, max: field.max, step: field.step, disabled: disabled }));
    }
    if (field.type === "choice") {
        return (React.createElement(Dropdown, { label: "", options: (_a = field.options) !== null && _a !== void 0 ? _a : [], selectedKey: String(value !== null && value !== void 0 ? value : ""), onChange: (next) => set(field.key, next), disabled: disabled }));
    }
    if (field.multiline) {
        return (React.createElement(TextArea, { label: "", value: String(value !== null && value !== void 0 ? value : ""), onChange: (next) => set(field.key, next), rows: 3, disabled: disabled }));
    }
    return (React.createElement(TextField, { label: "", value: String(value !== null && value !== void 0 ? value : ""), required: field.required, onChange: (next) => set(field.key, next), disabled: disabled }));
}
//# sourceMappingURL=ReportConfigPanel.js.map