import * as React from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  ComboBox,
  DatePickerField,
  Drawer,
  Dropdown,
  FieldRow,
  IconButton,
  Modal,
  MultiDropdown,
  Notice,
  NumberField,
  PageHeader,
  ProgressBar,
  RadioGroup,
  SearchBox,
  SelectOption,
  Spinner,
  StatTile,
  Table,
  Tabs,
  TextArea,
  TextField,
  Toggle,
  Toolbar,
} from "@/components";
import { ProgressGroup } from "@/components/feedback/ProgressGroup";
import { ProgressRing } from "@/components/feedback/ProgressRing";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { LineChart } from "@/components/charts/LineChart";
import { Sparkline } from "@/components/charts/Sparkline";
import { StackedBar } from "@/components/charts/StackedBar";
import { Legend } from "@/components/charts/Legend";
import { AsyncBoundary } from "@/components/states/AsyncBoundary";
import { EmptyState } from "@/components/states/Empty.state";
import { ErrorState } from "@/components/states/Error.state";
import { LoadingState } from "@/components/states/Loading.state";
import { UnauthorisedState } from "@/components/states/Unauthorised.state";
import { Theme } from "@/theme/Theme.api";
import { BoardGroup } from "@/pages/componentBoard/Board.types";

const OPTIONS: SelectOption[] = [
  { key: "all", text: "All pages" },
  { key: "news", text: "News" },
  { key: "landing", text: "Landing pages" },
  { key: "archived", text: "Archived", disabled: true },
];

const ButtonsDemo: React.FC = () => (
  <>
    <Button label="Primary" variant="primary" iconName="Play" onClick={() => undefined} />
    <Button label="Default" onClick={() => undefined} />
    <Button label="Subtle" variant="subtle" iconName="Edit" onClick={() => undefined} />
    <Button label="Danger" variant="danger" iconName="Delete" onClick={() => undefined} />
    <Button label="Busy" busy onClick={() => undefined} />
    <Button label="Disabled" disabled onClick={() => undefined} />
  </>
);

const IconButtonsDemo: React.FC = () => {
  const [pinned, setPinned] = React.useState(false);
  return (
    <>
      <IconButton iconName="Refresh" ariaLabel="Refresh results" tooltip="Refresh" />
      <IconButton
        iconName="Pin"
        ariaLabel="Pin this dashboard"
        tooltip="Pin"
        toggled={pinned}
        onClick={() => setPinned(!pinned)}
      />
      <IconButton iconName="Delete" ariaLabel="Delete report" disabled />
    </>
  );
};

const TabsDemo: React.FC = () => {
  const [selected, setSelected] = React.useState("summary");
  return (
    <div style={{ width: "100%" }}>
      <Tabs
        ariaLabel="Demo tabs"
        selectedKey={selected}
        onChange={setSelected}
        items={[
          { key: "summary", label: "Summary", iconName: "ViewDashboard", content: <p>Summary content.</p> },
          { key: "issues", label: "Issues", count: 12, content: <p>Issue list.</p> },
          { key: "history", label: "History", content: <p>Past runs.</p> },
        ]}
      />
    </div>
  );
};

const TextFieldsDemo: React.FC = () => {
  const [text, setText] = React.useState("Home.aspx");
  const [notes, setNotes] = React.useState("");
  const [count, setCount] = React.useState(50);
  const [search, setSearch] = React.useState("");

  return (
    <div style={{ width: "100%" }}>
      <FieldRow>
        <TextField label="Page name" value={text} onChange={setText} required iconName="Page" />
        <NumberField label="Page limit" value={count} onChange={setCount} min={1} max={500} step={10} />
        <SearchBox label="Search pages" value={search} onChange={setSearch} />
      </FieldRow>
      <div style={{ marginTop: Theme.tokens.space.md }}>
        <TextArea
          label="Notes"
          value={notes}
          onChange={setNotes}
          rows={3}
          description="Recorded against the saved report."
        />
      </div>
    </div>
  );
};

const SelectsDemo: React.FC = () => {
  const [single, setSingle] = React.useState("all");
  const [many, setMany] = React.useState<string[]>(["news"]);
  const [combo, setCombo] = React.useState("landing");

  return (
    <div style={{ width: "100%" }}>
      <FieldRow>
        <Dropdown label="Scope" options={OPTIONS} selectedKey={single} onChange={setSingle} />
        <MultiDropdown label="Include types" options={OPTIONS} selectedKeys={many} onChange={setMany} />
        <ComboBox label="Template" options={OPTIONS} selectedKey={combo} onChange={setCombo} />
      </FieldRow>
    </div>
  );
};

const ChoicesDemo: React.FC = () => {
  const [checked, setChecked] = React.useState(true);
  const [enabled, setEnabled] = React.useState(false);
  const [mode, setMode] = React.useState("quick");
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div style={{ width: "100%" }}>
      <FieldRow>
        <Checkbox label="Save to Site Assets" checked={checked} onChange={setChecked} />
        <Toggle label="Include drafts" checked={enabled} onChange={setEnabled} inlineLabel />
        <RadioGroup
          label="Scan depth"
          options={[
            { key: "quick", text: "Quick" },
            { key: "full", text: "Full" },
          ]}
          selectedKey={mode}
          onChange={setMode}
          inline
        />
        <DatePickerField label="Modified since" value={date} onChange={setDate} />
      </FieldRow>
    </div>
  );
};

const StatusDemo: React.FC = () => (
  <>
    <Badge label="Neutral" />
    <Badge label="Info" tone="info" iconName="Info" />
    <Badge label="Passed" tone="success" />
    <Badge label="Review" tone="warning" />
    <Badge label="Failed" tone="danger" />
    <Spinner label="Scanning…" size="small" />
    <div style={{ width: 220 }}>
      <ProgressBar label="Scan" ratio={0.45} description="45 of 100 pages" />
    </div>
  </>
);

const NoticeDemo: React.FC = () => (
  <div style={{ width: "100%", display: "grid", gap: Theme.tokens.space.sm }}>
    <Notice tone="info" message="Reports are written to the configured report library." />
    <Notice tone="success" message="Scan finished. 128 pages checked." />
    <Notice tone="warning" message="12 pages were skipped because they are checked out." />
    <Notice tone="error" message="The scan failed after 40 pages. Nothing was saved." />
  </div>
);

interface DemoRow {
  id: string;
  page: string;
  issues: number;
  status: "pass" | "fail";
}

const ROWS: DemoRow[] = [
  { id: "1", page: "Home.aspx", issues: 0, status: "pass" },
  { id: "2", page: "News/Update.aspx", issues: 4, status: "fail" },
  { id: "3", page: "Teams/HR.aspx", issues: 1, status: "fail" },
];

const TableDemo: React.FC = () => (
  <div style={{ width: "100%" }}>
    <Table
      ariaLabel="Demo results"
      rows={ROWS}
      getRowKey={(row) => row.id}
      columns={[
        { key: "page", header: "Page", minWidth: 180, render: (row) => <span>{row.page}</span> },
        { key: "issues", header: "Issues", minWidth: 80, maxWidth: 100, render: (row) => <span>{row.issues}</span> },
        {
          key: "status",
          header: "Status",
          minWidth: 100,
          maxWidth: 120,
          render: (row) => (
            <Badge label={row.status === "pass" ? "Pass" : "Fail"} tone={row.status === "pass" ? "success" : "danger"} />
          ),
        },
      ]}
    />
  </div>
);

const OverlaysDemo: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <>
      <Button label="Open modal" onClick={() => setModalOpen(true)} />
      <Button label="Open drawer" onClick={() => setDrawerOpen(true)} />

      <Modal
        open={modalOpen}
        title="Delete this report?"
        description="The file is sent to the site recycle bin."
        onDismiss={() => setModalOpen(false)}
        footer={
          <>
            <Button label="Delete" variant="danger" onClick={() => setModalOpen(false)} />
            <Button label="Cancel" onClick={() => setModalOpen(false)} />
          </>
        }
      />

      <Drawer open={drawerOpen} title="Report detail" onDismiss={() => setDrawerOpen(false)}>
        <p>Drawers carry detail that would crowd the table.</p>
      </Drawer>
    </>
  );
};

const LayoutDemo: React.FC = () => (
  <div style={{ width: "100%" }}>
    <PageHeader
      title="Section title"
      description="PageHeader owns the h1 for a dashboard. One per page."
      actions={<Button label="Action" variant="primary" />}
    />
    <Toolbar ariaLabel="Demo toolbar">
      <Badge label="3 filters" tone="info" />
      <Button label="Clear" variant="subtle" />
    </Toolbar>
    <div style={{ display: "flex", gap: Theme.tokens.space.md, flexWrap: "wrap" }}>
      <StatTile label="Pages" value="128" hint="Site Pages library" />
      <StatTile label="Issues" value="17" tone="danger" badge="Action" />
      <Card title="Card" subtitle="Groups related content.">
        <p style={{ margin: 0 }}>Cards take an optional onClick to become a single large target.</p>
      </Card>
    </div>
  </div>
);

const StatesDemo: React.FC = () => (
  <div style={{ width: "100%", display: "grid", gap: Theme.tokens.space.md }}>
    <LoadingState full={false} />
    <EmptyState onAction={() => undefined} actionLabel="Refresh" />
    <ErrorState detail="404: list 'Site Pages' does not exist" onRetry={() => undefined} />
    <UnauthorisedState userName="Jane Citizen" />
  </div>
);


const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

const ChartsDemo: React.FC = () => (
  <div style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: Theme.tokens.space.md }}>
    <BarChart
      ariaLabel="Issues per month"
      title="Bar: issues per month"
      points={MONTHS.map((label, index) => ({ label, value: 12 + ((index * 7) % 23) }))}
    />
    <BarChart
      ariaLabel="Largest libraries"
      title="Horizontal bar: largest libraries"
      horizontal
      points={[
        { label: "Documents", value: 4200 },
        { label: "Site Assets", value: 2300 },
        { label: "Style Library", value: 900 },
        { label: "Forms", value: 320 },
      ]}
    />
    <LineChart
      ariaLabel="Scan duration"
      title="Line: scan duration"
      area
      series={[
        { key: "pages", label: "Pages", points: MONTHS.map((label, i) => ({ label, value: 40 + ((i * 13) % 60) })) },
        { key: "lists", label: "Lists", points: MONTHS.map((label, i) => ({ label, value: 20 + ((i * 9) % 35) })) },
      ]}
    />
    <DonutChart
      ariaLabel="Content split"
      title="Donut: content split"
      centreLabel="128"
      segments={[
        { key: "libraries", label: "Libraries", value: 42 },
        { key: "lists", label: "Lists", value: 61 },
        { key: "hidden", label: "Hidden", value: 25 },
      ]}
    />
    <div style={{ display: "grid", gap: Theme.tokens.space.md }}>
      <StackedBar
        ariaLabel="Conformance"
        title="Stacked bar: conformance"
        segments={[
          { key: "pass", label: "Pass", value: 320 },
          { key: "warn", label: "Review", value: 44 },
          { key: "fail", label: "Fail", value: 18 },
        ]}
      />
      <div style={{ display: "flex", alignItems: "center", gap: Theme.tokens.space.md }}>
        <Sparkline ariaLabel="Requests per minute" values={[3, 6, 4, 9, 12, 7, 14, 11, 18]} />
        <Legend items={[{ key: "req", label: "Requests / min", colour: Theme.seriesColour(0), value: "18" }]} />
      </div>
      <div style={{ display: "flex", gap: Theme.tokens.space.md }}>
        <ProgressRing ratio={0.68} label="Scan" />
        <ProgressRing ratio={1} status="succeeded" label="Saved" />
        <ProgressRing status="failed" ratio={0.35} label="Failed" />
      </div>
    </div>
  </div>
);

const ProgressDemo: React.FC = () => (
  <div style={{ width: "100%", display: "grid", gap: Theme.tokens.space.md }}>
    <ProgressBar label="Determinate" ratio={0.42} countLabel="42/100" />
    <ProgressBar label="Indeterminate" status="running" />
    <ProgressBar label="Waiting on queue" status="waiting" ratio={0} />
    <ProgressBar label="Throttled by SharePoint" status="throttled" ratio={0.3} countLabel="retry in 12s" />
    <ProgressBar label="Paused" status="paused" ratio={0.55} />
    <ProgressBar label="Failed" status="failed" ratio={0.2} description="401 on /sites/hr" />
    <ProgressBar label="Complete" status="succeeded" ratio={1} />
    <ProgressGroup
      label="Lists audit (parent)"
      status="running"
      ratio={0.5}
      description="2 of 4 stages complete"
      steps={[
        { key: "read", label: "Read lists", status: "succeeded", ratio: 1, countLabel: "128/128" },
        { key: "storage", label: "Measure storage", status: "running", ratio: 0.4, countLabel: "51/128" },
        { key: "perms", label: "Check permissions", status: "throttled", ratio: 0.1, message: "Retrying after 429" },
        { key: "save", label: "Save report", status: "pending" },
      ]}
    />
  </div>
);

const StatusDemoRow: React.FC = () => (
  <>
    <StatusBadge status="pending" />
    <StatusBadge status="waiting" />
    <StatusBadge status="running" />
    <StatusBadge status="throttled" />
    <StatusBadge status="paused" />
    <StatusBadge status="succeeded" />
    <StatusBadge status="failed" />
    <StatusBadge status="cancelled" />
    <StatusBadge status="skipped" />
  </>
);

const AsyncStatesDemo: React.FC = () => {
  const [state, setState] = React.useState<"loading" | "empty" | "error" | "unauthorised" | "success">("loading");

  const result = {
    status: state === "empty" || state === "success" ? "success" : state,
    data: state === "empty" ? [] : ["Home.aspx", "News.aspx"],
    error: state === "error" ? "500, the list is not available" : undefined,
    isEmpty: state === "empty",
    reload: () => setState("loading"),
  } as Parameters<typeof AsyncBoundary>[0]["result"];

  return (
    <div style={{ width: "100%", display: "grid", gap: Theme.tokens.space.md }}>
      <div style={{ display: "flex", gap: Theme.tokens.space.sm, flexWrap: "wrap" }}>
        {(["loading", "empty", "error", "unauthorised", "success"] as const).map((option) => (
          <Button
            key={option}
            label={option}
            variant={state === option ? "primary" : "default"}
            onClick={() => setState(option)}
          />
        ))}
      </div>
      <AsyncBoundary result={result}>
        {(data) => (
          <ul style={{ margin: 0 }}>
            {(data as string[]).map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
        )}
      </AsyncBoundary>
    </div>
  );
};

export const BOARD_GROUPS: BoardGroup[] = [
  {
    key: "actions",
    label: "Actions",
    sections: [
      {
        name: "Button",
        summary: "Four variants. Every action in the app uses this, never a bare <button>.",
        render: () => <ButtonsDemo />,
      },
      {
        name: "IconButton",
        summary: "Icon-only action. ariaLabel is mandatory because there is no visible text.",
        render: () => <IconButtonsDemo />,
      },
      {
        name: "Modal and Drawer",
        summary: "Modal for a decision, Drawer for detail. Both trap focus and close on Escape.",
        render: () => <OverlaysDemo />,
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
        render: () => <TextFieldsDemo />,
      },
      {
        name: "Dropdown, MultiDropdown, ComboBox",
        summary: "Dropdown for a fixed list, MultiDropdown for many, ComboBox when the user may type a new value.",
        render: () => <SelectsDemo />,
      },
      {
        name: "Checkbox, Toggle, RadioGroup, DatePicker",
        summary: "Toggle for an immediate setting, Checkbox inside a form, RadioGroup for one-of-few.",
        render: () => <ChoicesDemo />,
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
        render: () => <TabsDemo />,
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
        render: () => <StatusDemo />,
      },
      {
        name: "Notice",
        summary: "Inline message bar for results of an action. Not for load failures, that is ErrorState.",
        render: () => <NoticeDemo />,
      },
      {
        name: "View states",
        summary: "Loading, empty, error and 401 rendered side by side.",
        render: () => <StatesDemo />,
      },
      {
        name: "AsyncBoundary",
        summary: "Switch between the states an async load actually produces.",
        render: () => <AsyncStatesDemo />,
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
        render: () => <ProgressDemo />,
      },
      {
        name: "StatusBadge",
        summary: "Icon plus label for every task and stage status.",
        render: () => <StatusDemoRow />,
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
        render: () => <ChartsDemo />,
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
        render: () => <LayoutDemo />,
      },
      {
        name: "Table",
        summary: "Typed columns with a render function per cell. Row keys are explicit, never the array index.",
        render: () => <TableDemo />,
      },
    ],
  },
];
