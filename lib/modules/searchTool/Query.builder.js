import * as React from "react";
import { Card } from "../../components/layout/Card";
import { Accordion } from "../../components/layout/Accordion";
import { Toolbar } from "../../components/layout/Toolbar";
import { Button } from "../../components/actions/Button";
import { TextField } from "../../components/inputs/TextField";
import { TextArea } from "../../components/inputs/TextArea";
import { NumberField } from "../../components/inputs/NumberField";
import { Dropdown } from "../../components/inputs/Dropdown";
import { DatePickerField } from "../../components/inputs/DatePickerField";
import { Toggle } from "../../components/inputs/Toggle";
import { Theme } from "../../theme/Theme.api";
import { SearchToolContent } from "./SearchTool.content";
import { buildQueryText, defaultForm, fromIsoDate, SOURCE_IDS, toIsoDate, } from "./SearchTool.logic";
export const QueryBuilder = ({ form, onChange, onRun, busy }) => {
    const [copied, setCopied] = React.useState(false);
    const set = (key, value) => onChange(Object.assign(Object.assign({}, form), { [key]: value }));
    const queryText = buildQueryText(form);
    return (React.createElement(Card, { title: SearchToolContent.form.title },
        React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md } },
            React.createElement(Toggle, { label: SearchToolContent.form.useRawQuery, checked: form.useRawQuery, onChange: (value) => set("useRawQuery", value), inlineLabel: true }),
            form.useRawQuery ? (React.createElement(TextArea, { label: SearchToolContent.form.rawQuery, value: form.rawQuery, onChange: (value) => set("rawQuery", value), rows: 4 })) : (React.createElement(React.Fragment, null,
                React.createElement(TextField, { label: SearchToolContent.form.keywords, description: SearchToolContent.form.keywordsHint, value: form.keywords, onChange: (value) => set("keywords", value) }),
                React.createElement(TextField, { label: SearchToolContent.form.path, value: form.path, onChange: (value) => set("path", value), placeholder: "https://tenant.sharepoint.com/sites/team" }),
                React.createElement(TextField, { label: SearchToolContent.form.fileTypes, description: SearchToolContent.form.fileTypesHint, value: form.fileTypes, onChange: (value) => set("fileTypes", value) }))),
            React.createElement(NumberField, { label: SearchToolContent.form.rowLimit, value: form.rowLimit, min: 1, max: 500, step: 10, onChange: (value) => set("rowLimit", value) }),
            React.createElement(Toolbar, { ariaLabel: SearchToolContent.form.title },
                React.createElement(Button, { label: SearchToolContent.form.run, variant: "primary", iconName: "Search", onClick: onRun, busy: busy }),
                React.createElement(Button, { label: copied ? SearchToolContent.form.copied : SearchToolContent.form.copyQuery, iconName: "Copy", onClick: () => {
                        void navigator.clipboard.writeText(queryText);
                        setCopied(true);
                    } }),
                React.createElement(Button, { label: SearchToolContent.form.reset, variant: "subtle", onClick: () => onChange(defaultForm) })),
            !form.useRawQuery && (React.createElement(Accordion, { title: SearchToolContent.form.moreFilters, subtitle: SearchToolContent.form.moreFiltersHint },
                React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md } },
                    React.createElement(TextField, { label: SearchToolContent.form.contentClass, description: SearchToolContent.form.contentClassHint, value: form.contentClass, onChange: (value) => set("contentClass", value) }),
                    React.createElement(TextField, { label: SearchToolContent.form.author, value: form.author, onChange: (value) => set("author", value) }),
                    React.createElement("div", { style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
                            gap: Theme.tokens.space.sm,
                        } },
                        React.createElement(DatePickerField, { label: SearchToolContent.form.modifiedAfter, value: fromIsoDate(form.modifiedAfter), onChange: (value) => set("modifiedAfter", toIsoDate(value)) }),
                        React.createElement(DatePickerField, { label: SearchToolContent.form.modifiedBefore, value: fromIsoDate(form.modifiedBefore), onChange: (value) => set("modifiedBefore", toIsoDate(value)) })),
                    React.createElement(TextField, { label: SearchToolContent.form.extraKql, description: SearchToolContent.form.extraKqlHint, value: form.extraKql, onChange: (value) => set("extraKql", value) })))),
            React.createElement(Accordion, { title: SearchToolContent.form.moreOptions, subtitle: SearchToolContent.form.moreOptionsHint },
                React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md } },
                    React.createElement(TextField, { label: SearchToolContent.form.selectProperties, value: form.selectProperties, onChange: (value) => set("selectProperties", value) }),
                    React.createElement(TextField, { label: SearchToolContent.form.refiners, description: SearchToolContent.form.refinersHint, value: form.refiners, onChange: (value) => set("refiners", value) }),
                    React.createElement("div", { style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
                            gap: Theme.tokens.space.sm,
                        } },
                        React.createElement(TextField, { label: SearchToolContent.form.sortProperty, value: form.sortProperty, onChange: (value) => set("sortProperty", value), placeholder: "LastModifiedTime" }),
                        React.createElement(Toggle, { label: SearchToolContent.form.sortDescending, checked: form.sortDescending, onChange: (value) => set("sortDescending", value), inlineLabel: true })),
                    React.createElement(Dropdown, { label: SearchToolContent.form.sourceId, options: SOURCE_IDS, selectedKey: form.sourceId, onChange: (value) => set("sourceId", value) }),
                    React.createElement(TextField, { label: SearchToolContent.form.queryTemplate, value: form.queryTemplate, onChange: (value) => set("queryTemplate", value), placeholder: "{searchTerms} Path:https://..." }),
                    React.createElement("div", { style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
                            gap: Theme.tokens.space.sm,
                        } },
                        React.createElement(TextField, { label: SearchToolContent.form.xrankTerms, description: SearchToolContent.form.xrankHint, value: form.xrankTerms, onChange: (value) => set("xrankTerms", value) }),
                        React.createElement(NumberField, { label: SearchToolContent.form.xrankBoost, value: form.xrankBoost, min: 1, max: 1000, step: 10, onChange: (value) => set("xrankBoost", value) })),
                    React.createElement(Toggle, { label: SearchToolContent.form.trimDuplicates, checked: form.trimDuplicates, onChange: (value) => set("trimDuplicates", value), inlineLabel: true }),
                    React.createElement(Toggle, { label: SearchToolContent.form.enableStemming, checked: form.enableStemming, onChange: (value) => set("enableStemming", value), inlineLabel: true }))),
            React.createElement("div", null,
                React.createElement("div", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted, marginBottom: 4 } }, SearchToolContent.form.preview),
                React.createElement("pre", { style: {
                        margin: 0,
                        padding: Theme.tokens.space.sm,
                        background: Theme.palette().surfaceAlt,
                        border: `1px solid ${Theme.palette().border}`,
                        borderRadius: Theme.tokens.radius.sm,
                        fontSize: Theme.tokens.font.sm,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                    } }, queryText || "*")))));
};
//# sourceMappingURL=Query.builder.js.map