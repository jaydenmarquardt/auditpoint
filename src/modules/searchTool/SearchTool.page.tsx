import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs } from "@/components/data/Tabs";
import { Badge } from "@/components/feedback/Badge";
import { Theme } from "@/theme/Theme.api";
import { Search } from "@/api/Search.api";
import { SearchOutcome, SearchRow } from "@/api/Search.types";
import { useMediaQuery } from "@/core/hooks/useMediaQuery";
import { findModule } from "@/modules/Modules.registry";
import { SearchToolContent } from "@/modules/searchTool/SearchTool.content";
import { QueryBuilder } from "@/modules/searchTool/Query.builder";
import { ResultDialog } from "@/modules/searchTool/Result.dialog";
import { SearchTab } from "@/modules/searchTool/tabs/Search.tab";
import { IndexCheckTab } from "@/modules/searchTool/tabs/IndexCheck.tab";
import { HistoryTab } from "@/modules/searchTool/tabs/History.tab";
import { HistoryEntry, Refinement, SearchFormState } from "@/modules/searchTool/SearchTool.types";
import { addHistory, clearHistory, defaultForm, readHistory, toRequest } from "@/modules/searchTool/SearchTool.logic";
import { toErrorMessage } from "@/utils/Guard.util";

const SearchToolPage: React.FC = () => {
  const [tab, setTab] = React.useState("search");
  const [form, setForm] = React.useState<SearchFormState>(defaultForm);
  const [outcome, setOutcome] = React.useState<SearchOutcome | undefined>(undefined);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [page, setPage] = React.useState(0);
  const [refinements, setRefinements] = React.useState<Refinement[]>([]);
  const [selected, setSelected] = React.useState<SearchRow | undefined>(undefined);
  const [history, setHistory] = React.useState<HistoryEntry[]>(() => readHistory());

  const module = findModule("search-tool");
  const narrow = useMediaQuery("(max-width: 1100px)");

  const run = React.useCallback(
    (state: SearchFormState, nextPage: number, filters: Refinement[]) => {
      setBusy(true);
      setError(undefined);

      Search()
        .run(toRequest(state, nextPage, filters))
        .then((result) => {
          setOutcome(result);
          setPage(nextPage);
          setHistory(
            addHistory({
              iso: new Date().toISOString(),
              queryText: result.queryText || "*",
              totalRows: result.totalRows,
              elapsedMs: result.elapsedMs,
            })
          );
        })
        .catch((thrown: unknown) => setError(toErrorMessage(thrown)))
        .then(() => setBusy(false))
        .catch(() => setBusy(false));
    },
    []
  );

  return (
    <>
      <PageHeader
        title={SearchToolContent.title}
        description={SearchToolContent.description}
        actions={
          module ? (
            <Badge label={`${SearchToolContent.moduleVersion} ${module.version}`} tone="neutral" showIcon={false} />
          ) : undefined
        }
      />

      <Tabs
        ariaLabel={SearchToolContent.title}
        selectedKey={tab}
        onChange={setTab}
        items={[
          {
            key: "search",
            label: SearchToolContent.tabs.search,
            content: (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: narrow ? "1fr" : "minmax(420px, 520px) minmax(0, 1fr)",
                  gap: Theme.tokens.space.lg,
                  alignItems: "start",
                  minWidth: 0,
                }}
              >
                <QueryBuilder
                  form={form}
                  onChange={setForm}
                  busy={busy}
                  onRun={() => {
                    setRefinements([]);
                    run(form, 0, []);
                  }}
                />

                <SearchTab
                  outcome={outcome}
                  busy={busy}
                  error={error}
                  page={page}
                  rowLimit={form.rowLimit}
                  refinements={refinements}
                  onPage={(next) => run(form, next, refinements)}
                  onRefine={(refinement) => {
                    const next = [...refinements.filter((entry) => entry.token !== refinement.token), refinement];
                    setRefinements(next);
                    run(form, 0, next);
                  }}
                  onRemoveRefinement={(token) => {
                    const next = refinements.filter((entry) => entry.token !== token);
                    setRefinements(next);
                    run(form, 0, next);
                  }}
                  onClearRefiners={() => {
                    setRefinements([]);
                    run(form, 0, []);
                  }}
                  onSelect={setSelected}
                />
              </div>
            ),
          },
          {
            key: "index",
            label: SearchToolContent.tabs.index,
            content: <IndexCheckTab />,
          },
          {
            key: "history",
            label: SearchToolContent.tabs.history,
            count: history.length,
            content: (
              <HistoryTab
                entries={history}
                onClear={() => setHistory(clearHistory())}
                onRerun={(queryText) => {
                  const next: SearchFormState = { ...form, useRawQuery: true, rawQuery: queryText };
                  setForm(next);
                  setTab("search");
                  setRefinements([]);
                  run(next, 0, []);
                }}
              />
            ),
          },
        ]}
      />

      <ResultDialog row={selected} onDismiss={() => setSelected(undefined)} />
    </>
  );
};

export default SearchToolPage;
