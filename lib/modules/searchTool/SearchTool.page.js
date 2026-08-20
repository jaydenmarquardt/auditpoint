import * as React from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Tabs } from "../../components/data/Tabs";
import { Badge } from "../../components/feedback/Badge";
import { Theme } from "../../theme/Theme.api";
import { Search } from "../../api/Search.api";
import { useMediaQuery } from "../../core/hooks/useMediaQuery";
import { findModule } from "../Modules.registry";
import { SearchToolContent } from "./SearchTool.content";
import { QueryBuilder } from "./Query.builder";
import { ResultDialog } from "./Result.dialog";
import { SearchTab } from "./tabs/Search.tab";
import { IndexCheckTab } from "./tabs/IndexCheck.tab";
import { HistoryTab } from "./tabs/History.tab";
import { addHistory, clearHistory, defaultForm, readHistory, toRequest } from "./SearchTool.logic";
import { toErrorMessage } from "../../utils/Guard.util";
const SearchToolPage = () => {
    const [tab, setTab] = React.useState("search");
    const [form, setForm] = React.useState(defaultForm);
    const [outcome, setOutcome] = React.useState(undefined);
    const [busy, setBusy] = React.useState(false);
    const [error, setError] = React.useState(undefined);
    const [page, setPage] = React.useState(0);
    const [refinements, setRefinements] = React.useState([]);
    const [selected, setSelected] = React.useState(undefined);
    const [history, setHistory] = React.useState(() => readHistory());
    const module = findModule("search-tool");
    const narrow = useMediaQuery("(max-width: 1100px)");
    const run = React.useCallback((state, nextPage, filters) => {
        setBusy(true);
        setError(undefined);
        Search()
            .run(toRequest(state, nextPage, filters))
            .then((result) => {
            setOutcome(result);
            setPage(nextPage);
            setHistory(addHistory({
                iso: new Date().toISOString(),
                queryText: result.queryText || "*",
                totalRows: result.totalRows,
                elapsedMs: result.elapsedMs,
            }));
        })
            .catch((thrown) => setError(toErrorMessage(thrown)))
            .then(() => setBusy(false))
            .catch(() => setBusy(false));
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: SearchToolContent.title, description: SearchToolContent.description, actions: module ? (React.createElement(Badge, { label: `${SearchToolContent.moduleVersion} ${module.version}`, tone: "neutral", showIcon: false })) : undefined }),
        React.createElement(Tabs, { ariaLabel: SearchToolContent.title, selectedKey: tab, onChange: setTab, items: [
                {
                    key: "search",
                    label: SearchToolContent.tabs.search,
                    content: (React.createElement("div", { style: {
                            display: "grid",
                            gridTemplateColumns: narrow ? "1fr" : "minmax(420px, 520px) minmax(0, 1fr)",
                            gap: Theme.tokens.space.lg,
                            alignItems: "start",
                            minWidth: 0,
                        } },
                        React.createElement(QueryBuilder, { form: form, onChange: setForm, busy: busy, onRun: () => {
                                setRefinements([]);
                                run(form, 0, []);
                            } }),
                        React.createElement(SearchTab, { outcome: outcome, busy: busy, error: error, page: page, rowLimit: form.rowLimit, refinements: refinements, onPage: (next) => run(form, next, refinements), onRefine: (refinement) => {
                                const next = [...refinements.filter((entry) => entry.token !== refinement.token), refinement];
                                setRefinements(next);
                                run(form, 0, next);
                            }, onRemoveRefinement: (token) => {
                                const next = refinements.filter((entry) => entry.token !== token);
                                setRefinements(next);
                                run(form, 0, next);
                            }, onClearRefiners: () => {
                                setRefinements([]);
                                run(form, 0, []);
                            }, onSelect: setSelected }))),
                },
                {
                    key: "index",
                    label: SearchToolContent.tabs.index,
                    content: React.createElement(IndexCheckTab, null),
                },
                {
                    key: "history",
                    label: SearchToolContent.tabs.history,
                    count: history.length,
                    content: (React.createElement(HistoryTab, { entries: history, onClear: () => setHistory(clearHistory()), onRerun: (queryText) => {
                            const next = Object.assign(Object.assign({}, form), { useRawQuery: true, rawQuery: queryText });
                            setForm(next);
                            setTab("search");
                            setRefinements([]);
                            run(next, 0, []);
                        } })),
                },
            ] }),
        React.createElement(ResultDialog, { row: selected, onDismiss: () => setSelected(undefined) })));
};
export default SearchToolPage;
//# sourceMappingURL=SearchTool.page.js.map