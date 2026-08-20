import * as React from "react";
import { Badge, Button, Card, Checkbox, ComboBox, DatePickerField, Drawer, Dropdown, FieldRow, IconButton, Modal, MultiDropdown, Notice, NumberField, PageHeader, ProgressBar, RadioGroup, SearchBox, Spinner, StatTile, Table, Tabs, TextArea, TextField, Toggle, Toolbar, } from "../../components";
import { ProgressGroup } from "../../components/feedback/ProgressGroup";
import { ProgressRing } from "../../components/feedback/ProgressRing";
import { StatusBadge } from "../../components/feedback/StatusBadge";
import { BarChart } from "../../components/charts/BarChart";
import { DonutChart } from "../../components/charts/DonutChart";
import { LineChart } from "../../components/charts/LineChart";
import { Sparkline } from "../../components/charts/Sparkline";
import { StackedBar } from "../../components/charts/StackedBar";
import { Legend } from "../../components/charts/Legend";
import { AsyncBoundary } from "../../components/states/AsyncBoundary";
import { EmptyState } from "../../components/states/Empty.state";
import { ErrorState } from "../../components/states/Error.state";
import { LoadingState } from "../../components/states/Loading.state";
import { UnauthorisedState } from "../../components/states/Unauthorised.state";
import { Theme } from "../../theme/Theme.api";
const OPTIONS = [
    { key: "all", text: "All pages" },
    { key: "news", text: "News" },
    { key: "landing", text: "Landing pages" },
    { key: "archived", text: "Archived", disabled: true },
];
const ButtonsDemo = () => (React.createElement(React.Fragment, null,
    React.createElement(Button, { label: "Primary", variant: "primary", iconName: "Play", onClick: () => undefined }),
    React.createElement(Button, { label: "Default", onClick: () => undefined }),
    React.createElement(Button, { label: "Subtle", variant: "subtle", iconName: "Edit", onClick: () => undefined }),
    React.createElement(Button, { label: "Danger", variant: "danger", iconName: "Delete", onClick: () => undefined }),
    React.createElement(Button, { label: "Busy", busy: true, onClick: () => undefined }),
    React.createElement(Button, { label: "Disabled", disabled: true, onClick: () => undefined })));
const IconButtonsDemo = () => {
    const [pinned, setPinned] = React.useState(false);
    return (React.createElement(React.Fragment, null,
        React.createElement(IconButton, { iconName: "Refresh", ariaLabel: "Refresh results", tooltip: "Refresh" }),
        React.createElement(IconButton, { iconName: "Pin", ariaLabel: "Pin this dashboard", tooltip: "Pin", toggled: pinned, onClick: () => setPinned(!pinned) }),
        React.createElement(IconButton, { iconName: "Delete", ariaLabel: "Delete report", disabled: true })));
};
const TabsDemo = () => {
    const [selected, setSelected] = React.useState("summary");
    return (React.createElement("div", { style: { width: "100%" } },
        React.createElement(Tabs, { ariaLabel: "Demo tabs", selectedKey: selected, onChange: setSelected, items: [
                { key: "summary", label: "Summary", iconName: "ViewDashboard", content: React.createElement("p", null, "Summary content.") },
                { key: "issues", label: "Issues", count: 12, content: React.createElement("p", null, "Issue list.") },
                { key: "history", label: "History", content: React.createElement("p", null, "Past runs.") },
            ] })));
};
const TextFieldsDemo = () => {
    const [text, setText] = React.useState("Home.aspx");
    const [notes, setNotes] = React.useState("");
    const [count, setCount] = React.useState(50);
    const [search, setSearch] = React.useState("");
    return (React.createElement("div", { style: { width: "100%" } },
        React.createElement(FieldRow, null,
            React.createElement(TextField, { label: "Page name", value: text, onChange: setText, required: true, iconName: "Page" }),
            React.createElement(NumberField, { label: "Page limit", value: count, onChange: setCount, min: 1, max: 500, step: 10 }),
            React.createElement(SearchBox, { label: "Search pages", value: search, onChange: setSearch })),
        React.createElement("div", { style: { marginTop: Theme.tokens.space.md } },
            React.createElement(TextArea, { label: "Notes", value: notes, onChange: setNotes, rows: 3, description: "Recorded against the saved report." }))));
};
const SelectsDemo = () => {
    const [single, setSingle] = React.useState("all");
    const [many, setMany] = React.useState(["news"]);
    const [combo, setCombo] = React.useState("landing");
    return (React.createElement("div", { style: { width: "100%" } },
        React.createElement(FieldRow, null,
            React.createElement(Dropdown, { label: "Scope", options: OPTIONS, selectedKey: single, onChange: setSingle }),
            React.createElement(MultiDropdown, { label: "Include types", options: OPTIONS, selectedKeys: many, onChange: setMany }),
            React.createElement(ComboBox, { label: "Template", options: OPTIONS, selectedKey: combo, onChange: setCombo }))));
};
const ChoicesDemo = () => {
    const [checked, setChecked] = React.useState(true);
    const [enabled, setEnabled] = React.useState(false);
    const [mode, setMode] = React.useState("quick");
    const [date, setDate] = React.useState(undefined);
    return (React.createElement("div", { style: { width: "100%" } },
        React.createElement(FieldRow, null,
            React.createElement(Checkbox, { label: "Save to Site Assets", checked: checked, onChange: setChecked }),
            React.createElement(Toggle, { label: "Include drafts", checked: enabled, onChange: setEnabled, inlineLabel: true }),
            React.createElement(RadioGroup, { label: "Scan depth", options: [
                    { key: "quick", text: "Quick" },
                    { key: "full", text: "Full" },
                ], selectedKey: mode, onChange: setMode, inline: true }),
            React.createElement(DatePickerField, { label: "Modified since", value: date, onChange: setDate }))));
};
const StatusDemo = () => (React.createElement(React.Fragment, null,
    React.createElement(Badge, { label: "Neutral" }),
    React.createElement(Badge, { label: "Info", tone: "info", iconName: "Info" }),
    React.createElement(Badge, { label: "Passed", tone: "success" }),
    React.createElement(Badge, { label: "Review", tone: "warning" }),
    React.createElement(Badge, { label: "Failed", tone: "danger" }),
    React.createElement(Spinner, { label: "Scanning\u2026", size: "small" }),
    React.createElement("div", { style: { width: 220 } },
        React.createElement(ProgressBar, { label: "Scan", ratio: 0.45, description: "45 of 100 pages" }))));
const NoticeDemo = () => (React.createElement("div", { style: { width: "100%", display: "grid", gap: Theme.tokens.space.sm } },
    React.createElement(Notice, { tone: "info", message: "Reports are written to the configured report library." }),
    React.createElement(Notice, { tone: "success", message: "Scan finished. 128 pages checked." }),
    React.createElement(Notice, { tone: "warning", message: "12 pages were skipped because they are checked out." }),
    React.createElement(Notice, { tone: "error", message: "The scan failed after 40 pages. Nothing was saved." })));
const ROWS = [
    { id: "1", page: "Home.aspx", issues: 0, status: "pass" },
    { id: "2", page: "News/Update.aspx", issues: 4, status: "fail" },
    { id: "3", page: "Teams/HR.aspx", issues: 1, status: "fail" },
];
const TableDemo = () => (React.createElement("div", { style: { width: "100%" } },
    React.createElement(Table, { ariaLabel: "Demo results", rows: ROWS, getRowKey: (row) => row.id, columns: [
            { key: "page", header: "Page", minWidth: 180, render: (row) => React.createElement("span", null, row.page) },
            { key: "issues", header: "Issues", minWidth: 80, maxWidth: 100, render: (row) => React.createElement("span", null, row.issues) },
            {
                key: "status",
                header: "Status",
                minWidth: 100,
                maxWidth: 120,
                render: (row) => (React.createElement(Badge, { label: row.status === "pass" ? "Pass" : "Fail", tone: row.status === "pass" ? "success" : "danger" })),
            },
        ] })));
const OverlaysDemo = () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    return (React.createElement(React.Fragment, null,
        React.createElement(Button, { label: "Open modal", onClick: () => setModalOpen(true) }),
        React.createElement(Button, { label: "Open drawer", onClick: () => setDrawerOpen(true) }),
        React.createElement(Modal, { open: modalOpen, title: "Delete this report?", description: "The file is sent to the site recycle bin.", onDismiss: () => setModalOpen(false), footer: React.createElement(React.Fragment, null,
                React.createElement(Button, { label: "Delete", variant: "danger", onClick: () => setModalOpen(false) }),
                React.createElement(Button, { label: "Cancel", onClick: () => setModalOpen(false) })) }),
        React.createElement(Drawer, { open: drawerOpen, title: "Report detail", onDismiss: () => setDrawerOpen(false) },
            React.createElement("p", null, "Drawers carry detail that would crowd the table."))));
};
const LayoutDemo = () => (React.createElement("div", { style: { width: "100%" } },
    React.createElement(PageHeader, { title: "Section title", description: "PageHeader owns the h1 for a dashboard. One per page.", actions: React.createElement(Button, { label: "Action", variant: "primary" }) }),
    React.createElement(Toolbar, { ariaLabel: "Demo toolbar" },
        React.createElement(Badge, { label: "3 filters", tone: "info" }),
        React.createElement(Button, { label: "Clear", variant: "subtle" })),
    React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.md, flexWrap: "wrap" } },
        React.createElement(StatTile, { label: "Pages", value: "128", hint: "Site Pages library" }),
        React.createElement(StatTile, { label: "Issues", value: "17", tone: "danger", badge: "Action" }),
        React.createElement(Card, { title: "Card", subtitle: "Groups related content." },
            React.createElement("p", { style: { margin: 0 } }, "Cards take an optional onClick to become a single large target.")))));
const StatesDemo = () => (React.createElement("div", { style: { width: "100%", display: "grid", gap: Theme.tokens.space.md } },
    React.createElement(LoadingState, { full: false }),
    React.createElement(EmptyState, { onAction: () => undefined, actionLabel: "Refresh" }),
    React.createElement(ErrorState, { detail: "404: list 'Site Pages' does not exist", onRetry: () => undefined }),
    React.createElement(UnauthorisedState, { userName: "Jane Citizen" })));
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const ChartsDemo = () => (React.createElement("div", { style: { width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: Theme.tokens.space.md } },
    React.createElement(BarChart, { ariaLabel: "Issues per month", title: "Bar: issues per month", points: MONTHS.map((label, index) => ({ label, value: 12 + ((index * 7) % 23) })) }),
    React.createElement(BarChart, { ariaLabel: "Largest libraries", title: "Horizontal bar: largest libraries", horizontal: true, points: [
            { label: "Documents", value: 4200 },
            { label: "Site Assets", value: 2300 },
            { label: "Style Library", value: 900 },
            { label: "Forms", value: 320 },
        ] }),
    React.createElement(LineChart, { ariaLabel: "Scan duration", title: "Line: scan duration", area: true, series: [
            { key: "pages", label: "Pages", points: MONTHS.map((label, i) => ({ label, value: 40 + ((i * 13) % 60) })) },
            { key: "lists", label: "Lists", points: MONTHS.map((label, i) => ({ label, value: 20 + ((i * 9) % 35) })) },
        ] }),
    React.createElement(DonutChart, { ariaLabel: "Content split", title: "Donut: content split", centreLabel: "128", segments: [
            { key: "libraries", label: "Libraries", value: 42 },
            { key: "lists", label: "Lists", value: 61 },
            { key: "hidden", label: "Hidden", value: 25 },
        ] }),
    React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md } },
        React.createElement(StackedBar, { ariaLabel: "Conformance", title: "Stacked bar: conformance", segments: [
                { key: "pass", label: "Pass", value: 320 },
                { key: "warn", label: "Review", value: 44 },
                { key: "fail", label: "Fail", value: 18 },
            ] }),
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: Theme.tokens.space.md } },
            React.createElement(Sparkline, { ariaLabel: "Requests per minute", values: [3, 6, 4, 9, 12, 7, 14, 11, 18] }),
            React.createElement(Legend, { items: [{ key: "req", label: "Requests / min", colour: Theme.seriesColour(0), value: "18" }] })),
        React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.md } },
            React.createElement(ProgressRing, { ratio: 0.68, label: "Scan" }),
            React.createElement(ProgressRing, { ratio: 1, status: "succeeded", label: "Saved" }),
            React.createElement(ProgressRing, { status: "failed", ratio: 0.35, label: "Failed" })))));
const ProgressDemo = () => (React.createElement("div", { style: { width: "100%", display: "grid", gap: Theme.tokens.space.md } },
    React.createElement(ProgressBar, { label: "Determinate", ratio: 0.42, countLabel: "42/100" }),
    React.createElement(ProgressBar, { label: "Indeterminate", status: "running" }),
    React.createElement(ProgressBar, { label: "Waiting on queue", status: "waiting", ratio: 0 }),
    React.createElement(ProgressBar, { label: "Throttled by SharePoint", status: "throttled", ratio: 0.3, countLabel: "retry in 12s" }),
    React.createElement(ProgressBar, { label: "Paused", status: "paused", ratio: 0.55 }),
    React.createElement(ProgressBar, { label: "Failed", status: "failed", ratio: 0.2, description: "401 on /sites/hr" }),
    React.createElement(ProgressBar, { label: "Complete", status: "succeeded", ratio: 1 }),
    React.createElement(ProgressGroup, { label: "Lists audit (parent)", status: "running", ratio: 0.5, description: "2 of 4 stages complete", steps: [
            { key: "read", label: "Read lists", status: "succeeded", ratio: 1, countLabel: "128/128" },
            { key: "storage", label: "Measure storage", status: "running", ratio: 0.4, countLabel: "51/128" },
            { key: "perms", label: "Check permissions", status: "throttled", ratio: 0.1, message: "Retrying after 429" },
            { key: "save", label: "Save report", status: "pending" },
        ] })));
const StatusDemoRow = () => (React.createElement(React.Fragment, null,
    React.createElement(StatusBadge, { status: "pending" }),
    React.createElement(StatusBadge, { status: "waiting" }),
    React.createElement(StatusBadge, { status: "running" }),
    React.createElement(StatusBadge, { status: "throttled" }),
    React.createElement(StatusBadge, { status: "paused" }),
    React.createElement(StatusBadge, { status: "succeeded" }),
    React.createElement(StatusBadge, { status: "failed" }),
    React.createElement(StatusBadge, { status: "cancelled" }),
    React.createElement(StatusBadge, { status: "skipped" })));
const AsyncStatesDemo = () => {
    const [state, setState] = React.useState("loading");
    const result = {
        status: state === "empty" || state === "success" ? "success" : state,
        data: state === "empty" ? [] : ["Home.aspx", "News.aspx"],
        error: state === "error" ? "500, the list is not available" : undefined,
        isEmpty: state === "empty",
        reload: () => setState("loading"),
    };
    return (React.createElement("div", { style: { width: "100%", display: "grid", gap: Theme.tokens.space.md } },
        React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.sm, flexWrap: "wrap" } }, ["loading", "empty", "error", "unauthorised", "success"].map((option) => (React.createElement(Button, { key: option, label: option, variant: state === option ? "primary" : "default", onClick: () => setState(option) })))),
        React.createElement(AsyncBoundary, { result: result }, (data) => (React.createElement("ul", { style: { margin: 0 } }, data.map((entry) => (React.createElement("li", { key: entry }, entry))))))));
};
export const BOARD_GROUPS = [
    {
        key: "actions",
        label: "Actions",
        sections: [
            {
                name: "Button",
                summary: "Four variants. Every action in the app uses this, never a bare <button>.",
                render: () => React.createElement(ButtonsDemo, null),
            },
            {
                name: "IconButton",
                summary: "Icon-only action. ariaLabel is mandatory because there is no visible text.",
                render: () => React.createElement(IconButtonsDemo, null),
            },
            {
                name: "Modal and Drawer",
                summary: "Modal for a decision, Drawer for detail. Both trap focus and close on Escape.",
                render: () => React.createElement(OverlaysDemo, null),
            },
        ],
    },
    {
        key: "inputs",
        label: "Inputs",
        sections: [
            {
                name: "Text, number and search fields",
                summary: "Controlled only: value in, onChange out. No internal state, no uncontrolled fallback.",
                render: () => React.createElement(TextFieldsDemo, null),
            },
            {
                name: "Dropdown, MultiDropdown, ComboBox",
                summary: "Dropdown for a fixed list, MultiDropdown for many, ComboBox when the user may type a new value.",
                render: () => React.createElement(SelectsDemo, null),
            },
            {
                name: "Checkbox, Toggle, RadioGroup, DatePicker",
                summary: "Toggle for an immediate setting, Checkbox inside a form, RadioGroup for one-of-few.",
                render: () => React.createElement(ChoicesDemo, null),
            },
        ],
    },
    {
        key: "navigation",
        label: "Navigation",
        sections: [
            {
                name: "Tabs",
                summary: "In-page sections only. Cross-dashboard navigation goes through the sidebar route registry.",
                render: () => React.createElement(TabsDemo, null),
            },
        ],
    },
    {
        key: "feedback",
        label: "Status and feedback",
        sections: [
            {
                name: "Badge, Spinner, ProgressBar",
                summary: "Status at a glance. Badge tone carries meaning, so never use tone alone, always pair with text.",
                render: () => React.createElement(StatusDemo, null),
            },
            {
                name: "Notice",
                summary: "Inline message bar for results of an action. Not for load failures, that is ErrorState.",
                render: () => React.createElement(NoticeDemo, null),
            },
            {
                name: "View states",
                summary: "Loading, empty, error and 401 rendered side by side.",
                render: () => React.createElement(StatesDemo, null),
            },
            {
                name: "AsyncBoundary",
                summary: "Switch between the states an async load actually produces.",
                render: () => React.createElement(AsyncStatesDemo, null),
            },
        ],
    },
    {
        key: "progress",
        label: "Progress",
        sections: [
            {
                name: "ProgressBar states",
                summary: "Pending, waiting, running, throttled, paused, failed and complete.",
                render: () => React.createElement(ProgressDemo, null),
            },
            {
                name: "StatusBadge",
                summary: "Icon plus label for every task and stage status.",
                render: () => React.createElement(StatusDemoRow, null),
            },
        ],
    },
    {
        key: "charts",
        label: "Charts",
        sections: [
            {
                name: "Charts",
                summary: "Bar, horizontal bar, line, area, donut, stacked bar, sparkline and progress ring, all from @fluentui/react-charting.",
                render: () => React.createElement(ChartsDemo, null),
            },
        ],
    },
    {
        key: "layout",
        label: "Layout and data",
        sections: [
            {
                name: "PageHeader, Toolbar, Card, StatTile",
                summary: "Page scaffolding. PageHeader owns the single h1 on a dashboard.",
                render: () => React.createElement(LayoutDemo, null),
            },
            {
                name: "Table",
                summary: "Typed columns with a render function per cell. Row keys are explicit, never the array index.",
                render: () => React.createElement(TableDemo, null),
            },
        ],
    },
];
//# sourceMappingURL=Board.sections.js.map