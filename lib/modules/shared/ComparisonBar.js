import * as React from "react";
import { Card } from "../../components/layout/Card";
import { Toggle } from "../../components/inputs/Toggle";
import { Dropdown } from "../../components/inputs/Dropdown";
import { Notice } from "../../components/feedback/Notice";
import { Spinner } from "../../components/feedback/Spinner";
import { Theme } from "../../theme/Theme.api";
import { Reports, reportFolderUrl } from "../../api/Reports.api";
import { formatDateTime } from "../../utils/Format.util";
import { toErrorMessage } from "../../utils/Guard.util";
/**
 * Picks an earlier run of the same report to measure this one against. The chosen
 * run's data goes back to the page, which rebuilds its own view from it.
 */
export const ComparisonBar = ({ kind, currentId, onChange }) => {
    const [on, setOn] = React.useState(false);
    const [runs, setRuns] = React.useState([]);
    const [selected, setSelected] = React.useState("");
    const [error, setError] = React.useState(undefined);
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        if (!on || runs.length > 0)
            return;
        Reports()
            .index()
            .then((all) => setRuns(all.filter((entry) => entry.kind === kind && entry.id !== currentId)))
            .catch((failure) => setError(toErrorMessage(failure)));
    }, [on, kind, currentId, runs.length]);
    const choose = (fileName) => {
        setSelected(fileName);
        setError(undefined);
        if (!fileName) {
            onChange(undefined);
            return;
        }
        setLoading(true);
        Reports()
            .read(`${reportFolderUrl()}/${fileName}`)
            .then((envelope) => onChange(envelope.data))
            .catch((failure) => setError(toErrorMessage(failure)))
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    };
    return (React.createElement(Card, { title: "Comparison", subtitle: "Measure this run against an earlier one. Every tile then shows the change.", actions: React.createElement(Toggle, { label: "", checked: on, onChange: (next) => {
                setOn(next);
                if (!next) {
                    setSelected("");
                    onChange(undefined);
                }
            }, onText: "On", offText: "Off", inlineLabel: true }) },
        React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.sm, minWidth: 0 } },
            on && (React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.sm, alignItems: "flex-end", flexWrap: "wrap" } },
                React.createElement("div", { style: { flex: "1 1 320px", maxWidth: 420 } },
                    React.createElement(Dropdown, { label: "Compare against", placeholder: "Pick an earlier run", options: runs.map((run) => ({
                            key: run.fileName,
                            text: `${formatDateTime(run.updatedIso)} · ${run.createdBy || "Unknown"}`,
                        })), selectedKey: selected, onChange: choose, disabled: loading })),
                loading && (React.createElement("div", { style: { display: "flex", alignItems: "center", gap: Theme.tokens.space.xs, minHeight: 32 } },
                    React.createElement(Spinner, { size: "small" }),
                    React.createElement("span", { style: { color: Theme.palette().textMuted } }, "Reading that run\u2026"))))),
            on && runs.length === 0 && !error && (React.createElement(Notice, { tone: "info", message: "No earlier runs of this report are saved yet." })),
            !on && (React.createElement("p", { style: { margin: 0, color: Theme.palette().textMuted } }, "Switch this on to pick an earlier run of this report.")),
            error && React.createElement(Notice, { tone: "error", message: error, onDismiss: () => setError(undefined) }))));
};
//# sourceMappingURL=ComparisonBar.js.map