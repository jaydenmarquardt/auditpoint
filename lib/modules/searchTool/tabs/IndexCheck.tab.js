import * as React from "react";
import { Card } from "../../../components/layout/Card";
import { StatTile } from "../../../components/layout/StatTile";
import { Button } from "../../../components/actions/Button";
import { TextField } from "../../../components/inputs/TextField";
import { Picker } from "../../../components/inputs/Picker";
import { RadioGroup } from "../../../components/inputs/RadioGroup";
import { Notice } from "../../../components/feedback/Notice";
import { Spinner } from "../../../components/feedback/Spinner";
import { Theme } from "../../../theme/Theme.api";
import { Search } from "../../../api/Search.api";
import { Indexing } from "../../../api/Indexing.api";
import { SiteLists } from "../../../api/Lists.api";
import { useAsync } from "../../../core/hooks/useAsync";
import { SearchToolContent } from "../SearchTool.content";
import { toErrorMessage } from "../../../utils/Guard.util";
import { formatDateTime, formatDuration } from "../../../utils/Format.util";
const ITEM_SAMPLE = 200;
export const IndexCheckTab = () => {
    var _a;
    const [mode, setMode] = React.useState("url");
    const [target, setTarget] = React.useState("");
    const [listId, setListId] = React.useState(undefined);
    const [items, setItems] = React.useState([]);
    const [loadingItems, setLoadingItems] = React.useState(false);
    const [busy, setBusy] = React.useState(false);
    const [error, setError] = React.useState(undefined);
    const [result, setResult] = React.useState(undefined);
    const lists = useAsync(() => SiteLists().getAll(false), { enabled: mode === "list" });
    const pickList = (id) => {
        var _a;
        setListId(id);
        setItems([]);
        setTarget("");
        const list = ((_a = lists.data) !== null && _a !== void 0 ? _a : []).find((candidate) => candidate.id === id);
        if (!list)
            return;
        setLoadingItems(true);
        Indexing()
            .sampleItems(list, ITEM_SAMPLE)
            .then((loaded) => setItems(loaded.filter((item) => item.url)))
            .catch((thrown) => setError(toErrorMessage(thrown)))
            .then(() => setLoadingItems(false))
            .catch(() => setLoadingItems(false));
    };
    const check = () => {
        if (!target.trim())
            return;
        setBusy(true);
        setError(undefined);
        Search()
            .isIndexed(target)
            .then(setResult)
            .catch((thrown) => setError(toErrorMessage(thrown)))
            .then(() => setBusy(false))
            .catch(() => setBusy(false));
    };
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md, maxWidth: 960 } },
        React.createElement(Card, { title: SearchToolContent.index.title, subtitle: SearchToolContent.index.description },
            React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md } },
                React.createElement(RadioGroup, { label: SearchToolContent.index.mode, inline: true, selectedKey: mode, onChange: (value) => {
                        setMode(value);
                        setTarget("");
                        setResult(undefined);
                    }, options: [
                        { key: "url", text: SearchToolContent.index.modeUrl },
                        { key: "list", text: SearchToolContent.index.modeList },
                    ] }),
                mode === "url" ? (React.createElement(TextField, { label: SearchToolContent.index.target, value: target, onChange: setTarget, placeholder: "https://tenant.sharepoint.com/sites/team/SitePages/Home.aspx" })) : (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md } },
                    lists.status === "loading" && React.createElement(Spinner, { label: SearchToolContent.index.loadingLists }),
                    lists.status === "error" && React.createElement(Notice, { tone: "error", message: (_a = lists.error) !== null && _a !== void 0 ? _a : "" }),
                    lists.data && (React.createElement(Picker, { label: SearchToolContent.index.list, options: lists.data.map((list) => ({ key: list.id, text: list.title })), selectedKey: listId, onChange: pickList, placeholder: SearchToolContent.index.listPlaceholder })),
                    loadingItems && React.createElement(Spinner, { label: SearchToolContent.index.loadingItems }),
                    items.length > 0 && (React.createElement(Picker, { label: SearchToolContent.index.item, options: items.map((item) => ({ key: item.url, text: item.title || item.url })), selectedKey: target, onChange: setTarget, placeholder: SearchToolContent.index.itemPlaceholder })),
                    target && (React.createElement("code", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted, wordBreak: "break-all" } }, target)))),
                React.createElement("div", null,
                    React.createElement(Button, { label: SearchToolContent.index.check, variant: "primary", iconName: "Search", onClick: check, busy: busy, disabled: !target.trim() })))),
        error && (React.createElement(Card, { title: SearchToolContent.index.failed },
            React.createElement("pre", { style: {
                    margin: 0,
                    padding: Theme.tokens.space.md,
                    background: Theme.tone("danger").bg,
                    border: `1px solid ${Theme.tone("danger").border}`,
                    borderRadius: Theme.tokens.radius.sm,
                    fontSize: Theme.tokens.font.sm,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                } }, error))),
        busy && React.createElement(Spinner, { label: SearchToolContent.index.check }),
        result && !busy && (React.createElement(Card, { title: result.indexed ? SearchToolContent.index.indexed : SearchToolContent.index.notIndexed, subtitle: `${SearchToolContent.index.queryUsed}: ${result.queryText}` },
            React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md } },
                !result.indexed && React.createElement(Notice, { tone: "warning", message: SearchToolContent.index.notIndexedHint }),
                result.row && React.createElement(ResultFacts, { row: result.row, elapsedMs: result.elapsedMs }))))));
};
const ResultFacts = ({ row, elapsedMs }) => (React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.md, flexWrap: "wrap" } },
    React.createElement(StatTile, { label: SearchToolContent.index.lastModified, value: formatDateTime(row.LastModifiedTime) }),
    React.createElement(StatTile, { label: SearchToolContent.index.fileType, value: row.FileType || "-" }),
    React.createElement(StatTile, { label: SearchToolContent.index.contentClass, value: row.contentclass || "-" }),
    React.createElement(StatTile, { label: SearchToolContent.index.web, value: row.SPWebUrl || "-" }),
    React.createElement(StatTile, { label: SearchToolContent.index.checkTime, value: formatDuration(elapsedMs) })));
//# sourceMappingURL=IndexCheck.tab.js.map