import * as React from "react";
import { Card } from "@/components/layout/Card";
import { StatTile } from "@/components/layout/StatTile";
import { Button } from "@/components/actions/Button";
import { TextField } from "@/components/inputs/TextField";
import { Picker } from "@/components/inputs/Picker";
import { RadioGroup } from "@/components/inputs/RadioGroup";
import { Notice } from "@/components/feedback/Notice";
import { Spinner } from "@/components/feedback/Spinner";
import { Theme } from "@/theme/Theme.api";
import { Search } from "@/api/Search.api";
import { Indexing } from "@/api/Indexing.api";
import { SiteLists } from "@/api/Lists.api";
import { SiteList } from "@/api/Lists.types";
import { IndexCheck, SearchRow } from "@/api/Search.types";
import { SampleItem } from "@/api/Indexing.types";
import { useAsync } from "@/core/hooks/useAsync";
import { SearchToolContent } from "@/modules/searchTool/SearchTool.content";
import { toErrorMessage } from "@/utils/Guard.util";
import { formatDateTime, formatDuration } from "@/utils/Format.util";

const ITEM_SAMPLE = 200;

export const IndexCheckTab: React.FC = () => {
  const [mode, setMode] = React.useState("url");
  const [target, setTarget] = React.useState("");
  const [listId, setListId] = React.useState<string | undefined>(undefined);
  const [items, setItems] = React.useState<SampleItem[]>([]);
  const [loadingItems, setLoadingItems] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [result, setResult] = React.useState<IndexCheck | undefined>(undefined);

  const lists = useAsync(() => SiteLists().getAll(false), { enabled: mode === "list" });

  const pickList = (id: string): void => {
    setListId(id);
    setItems([]);
    setTarget("");

    const list = (lists.data ?? []).find((candidate: SiteList) => candidate.id === id);
    if (!list) return;

    setLoadingItems(true);
    Indexing()
      .sampleItems(list, ITEM_SAMPLE)
      .then((loaded) => setItems(loaded.filter((item) => item.url)))
      .catch((thrown: unknown) => setError(toErrorMessage(thrown)))
      .then(() => setLoadingItems(false))
      .catch(() => setLoadingItems(false));
  };

  const check = (): void => {
    if (!target.trim()) return;

    setBusy(true);
    setError(undefined);

    Search()
      .isIndexed(target)
      .then(setResult)
      .catch((thrown: unknown) => setError(toErrorMessage(thrown)))
      .then(() => setBusy(false))
      .catch(() => setBusy(false));
  };

  return (
    <div style={{ display: "grid", gap: Theme.tokens.space.md, maxWidth: 960 }}>
      <Card title={SearchToolContent.index.title} subtitle={SearchToolContent.index.description}>
        <div style={{ display: "grid", gap: Theme.tokens.space.md }}>
          <RadioGroup
            label={SearchToolContent.index.mode}
            inline
            selectedKey={mode}
            onChange={(value) => {
              setMode(value);
              setTarget("");
              setResult(undefined);
            }}
            options={[
              { key: "url", text: SearchToolContent.index.modeUrl },
              { key: "list", text: SearchToolContent.index.modeList },
            ]}
          />

          {mode === "url" ? (
            <TextField
              label={SearchToolContent.index.target}
              value={target}
              onChange={setTarget}
              placeholder="https://tenant.sharepoint.com/sites/team/SitePages/Home.aspx"
            />
          ) : (
            <div style={{ display: "grid", gap: Theme.tokens.space.md }}>
              {lists.status === "loading" && <Spinner label={SearchToolContent.index.loadingLists} />}
              {lists.status === "error" && <Notice tone="error" message={lists.error ?? ""} />}

              {lists.data && (
                <Picker
                  label={SearchToolContent.index.list}
                  options={lists.data.map((list) => ({ key: list.id, text: list.title }))}
                  selectedKey={listId}
                  onChange={pickList}
                  placeholder={SearchToolContent.index.listPlaceholder}
                />
              )}

              {loadingItems && <Spinner label={SearchToolContent.index.loadingItems} />}

              {items.length > 0 && (
                <Picker
                  label={SearchToolContent.index.item}
                  options={items.map((item) => ({ key: item.url, text: item.title || item.url }))}
                  selectedKey={target}
                  onChange={setTarget}
                  placeholder={SearchToolContent.index.itemPlaceholder}
                />
              )}

              {target && (
                <code style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted, wordBreak: "break-all" }}>
                  {target}
                </code>
              )}
            </div>
          )}

          <div>
            <Button
              label={SearchToolContent.index.check}
              variant="primary"
              iconName="Search"
              onClick={check}
              busy={busy}
              disabled={!target.trim()}
            />
          </div>
        </div>
      </Card>

      {error && (
        <Card title={SearchToolContent.index.failed}>
          <pre
            style={{
              margin: 0,
              padding: Theme.tokens.space.md,
              background: Theme.tone("danger").bg,
              border: `1px solid ${Theme.tone("danger").border}`,
              borderRadius: Theme.tokens.radius.sm,
              fontSize: Theme.tokens.font.sm,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {error}
          </pre>
        </Card>
      )}

      {busy && <Spinner label={SearchToolContent.index.check} />}

      {result && !busy && (
        <Card
          title={result.indexed ? SearchToolContent.index.indexed : SearchToolContent.index.notIndexed}
          subtitle={`${SearchToolContent.index.queryUsed}: ${result.queryText}`}
        >
          <div style={{ display: "grid", gap: Theme.tokens.space.md }}>
            {!result.indexed && <Notice tone="warning" message={SearchToolContent.index.notIndexedHint} />}
            {result.row && <ResultFacts row={result.row} elapsedMs={result.elapsedMs} />}
          </div>
        </Card>
      )}
    </div>
  );
};

const ResultFacts: React.FC<{ row: SearchRow; elapsedMs: number }> = ({ row, elapsedMs }) => (
  <div style={{ display: "flex", gap: Theme.tokens.space.md, flexWrap: "wrap" }}>
    <StatTile label={SearchToolContent.index.lastModified} value={formatDateTime(row.LastModifiedTime)} />
    <StatTile label={SearchToolContent.index.fileType} value={row.FileType || "-"} />
    <StatTile label={SearchToolContent.index.contentClass} value={row.contentclass || "-"} />
    <StatTile label={SearchToolContent.index.web} value={row.SPWebUrl || "-"} />
    <StatTile label={SearchToolContent.index.checkTime} value={formatDuration(elapsedMs)} />
  </div>
);
