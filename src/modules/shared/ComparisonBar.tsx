import * as React from "react";
import { Toggle } from "@/components/inputs/Toggle";
import { Dropdown } from "@/components/inputs/Dropdown";
import { Notice } from "@/components/feedback/Notice";
import { Theme } from "@/theme/Theme.api";
import { Reports, reportFolderUrl } from "@/api/Reports.api";
import { ReportEnvelope, ReportIndexEntry } from "@/api/Reports.types";
import { formatDateTime } from "@/utils/Format.util";
import { toErrorMessage } from "@/utils/Guard.util";

export interface ComparisonBarProps {
  kind: string;
  /** Excluded from the list: comparing a run with itself says nothing. */
  currentId?: string;
  onChange: (data: unknown | undefined) => void;
}

/**
 * Picks an earlier run of the same report to measure this one against. The chosen
 * run's data goes back to the page, which rebuilds its own view from it.
 */
export const ComparisonBar: React.FC<ComparisonBarProps> = ({ kind, currentId, onChange }) => {
  const [on, setOn] = React.useState(false);
  const [runs, setRuns] = React.useState<ReportIndexEntry[]>([]);
  const [selected, setSelected] = React.useState<string>("");
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!on || runs.length > 0) return;

    Reports()
      .index()
      .then((all) => setRuns(all.filter((entry) => entry.kind === kind && entry.id !== currentId)))
      .catch((failure: unknown) => setError(toErrorMessage(failure)));
  }, [on, kind, currentId, runs.length]);

  const choose = (fileName: string): void => {
    setSelected(fileName);
    setError(undefined);

    if (!fileName) {
      onChange(undefined);
      return;
    }

    setLoading(true);
    Reports()
      .read(`${reportFolderUrl()}/${fileName}`)
      .then((envelope) => onChange((envelope as ReportEnvelope).data))
      .catch((failure: unknown) => setError(toErrorMessage(failure)))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  return (
    <div style={{ display: "grid", gap: Theme.tokens.space.sm, minWidth: 0 }}>
      <div style={{ display: "flex", gap: Theme.tokens.space.md, alignItems: "flex-end", flexWrap: "wrap" }}>
        <Toggle
          label="Comparison"
          checked={on}
          onChange={(next) => {
            setOn(next);
            if (!next) {
              setSelected("");
              onChange(undefined);
            }
          }}
          onText="On"
          offText="Off"
          inlineLabel
        />

        {on && (
          <div style={{ minWidth: 320 }}>
            <Dropdown
              label="Compare against"
              placeholder={loading ? "Loading run…" : "Pick an earlier run"}
              options={runs.map((run) => ({
                key: run.fileName,
                text: `${formatDateTime(run.updatedIso)} · ${run.createdBy || "Unknown"}`,
              }))}
              selectedKey={selected}
              onChange={choose}
            />
          </div>
        )}
      </div>

      {on && runs.length === 0 && !error && (
        <Notice tone="info" message="No earlier runs of this report are saved yet." />
      )}
      {error && <Notice tone="error" message={error} onDismiss={() => setError(undefined)} />}
    </div>
  );
};
