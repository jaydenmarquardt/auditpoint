# Rules for agents

SPFx 1.23.0 · React 17 · Fluent UI React v8 · PnPjs v4 · pnpm · TypeScript strict.

Read this before writing code. The in-app **Component board** is the live counterpart.

## Definitions

**Module**: a page or dashboard inside the app. A module may run reports, change settings or expose a
tool. Modules live in `src/modules/<name>/` and are listed in `src/modules/Modules.registry.ts`; the
sidebar, routing and report registration all derive from that registry. Every module carries a
`version` string, bumped whenever its behaviour or data shape changes; its report carries the same
version and it is stamped onto every envelope the report writes.

**Report**: a runnable, staged job owned by a module. Every report: declares a typed `defaultConfig`
plus `configFields` rendered by `<ReportConfigPanel>` so it is configured before it runs, requires app
settings to be complete, checkpoints to the report library after each stage, can be paused and resumed
from its last completed stage, records issues (401/403/429) per target, and can be exported (JSON, and
CSV where the shape suits it). Stages read their settings from `context.config`; the config is stored
on the envelope so a resumed or reloaded run uses the same settings.

## Reuse before create

Controls live in `src/components`. Import from `@/components` and extend the existing component if it
is close. No one-off buttons, fields, tables or charts inside a page.

Components are grouped by role: `components/actions`, `inputs`, `layout`, `feedback`, `data`, `charts`,
`states`. Everything renderable lives under `src/components`: there is no top-level `states` folder.

New control needed:

1. Find the Fluent UI React **v8** equivalent: <https://storybooks.fluentui.dev/react>.
2. Wrap it in `src/components/<group>/<Name>.tsx` with a typed prop surface.
3. Put the props in `src/components/Components.types.ts`, export from `src/components/index.ts`, add a
   demo to `src/pages/componentBoard/Board.sections.tsx`.

`@fluentui/react` is imported only inside `src/components` and `src/states`.

Charts wrap `@fluentui/react-charting` (Fluent UI v8's chart package) in `src/components/charts`.
Never hand-roll an SVG chart; add a wrapper around the Fluent chart that fits the existing prop shape.

## Types

Every exported type lives in a `*.types.ts` next to its module:
`Components.types.ts`, `Charts.types.ts`, `Lists.types.ts`, `Reports.types.ts`, `Report.types.ts`,
`Settings.types.ts`, `Queue.types.ts`, `Theme.types.ts`. Implementation files import from them; they
do not declare exported interfaces themselves.

## Layering

| Concern | Location |
| --- | --- |
| SharePoint access | `src/api/*.api.ts` |
| Types | `*.types.ts` |
| Derivation | `*.logic.ts` or a hook |
| Strings | `*.content.ts` |
| Rendering | `*.tsx`, success path only |
| Helpers | `src/utils/*.util.ts` |

## SharePoint access

- `setupSp(context)` runs once in the web part. Everything else uses `getSp()` / `getSp(siteUrl)`.
- **Every** SP call is wrapped in `throttled()` from `@/api/Throttle.api`: it enforces concurrency and
  handles 429/503 with Retry-After backoff. A raw PnP call outside a `*.api.ts` is a bug.
- **Every** `*.api.ts` exposes a factory, never loose functions: `SitePages(siteUrl?)`,
  `SiteLists(siteUrl?)`, `Reports(location?)`, `Permissions(siteUrl?)`. List-backed APIs are built with
  `createListApi` (`@/api/List.api`), giving a uniform `getItems(query)` / `getItem(id)` / `count()` /
  `exists()` surface; extra methods are spread onto the factory result (see `SitePages.getHtml`).

## Theme

Colours come from `@/theme/Theme.api`: `Theme.palette()`, `Theme.tone(tone)`, `Theme.chart()`,
`Theme.seriesColour(i)`, `Theme.tokens`. No hex literals in components.

## State

- Local UI state: `useState`.
- Shared state: `createStore` + `useStore` (`@/core/state/Store`).
- Async loads: `useAsync` + `<AsyncBoundary>`.
- Long jobs: the queue (`@/core/queue`). Never an unawaited promise in a component.

## Reports and mini apps

A dashboard that scans anything is a **report**, not an ad-hoc loop:

1. Declare a `ReportDefinition` with ordered stages (`@/core/report/Report.types`). Every report must
   declare config fields, each with a `description` saying what it does and what it costs, and is
   always started from the run dialog, never straight from a button.
2. Each stage calls `context.progress()`, records `context.issue()` for 401/403/429, and writes
   `context.setCursor()` so a resume picks up mid-stage.
3. Stages call `await context.waitIfPaused()` inside every loop so pause and cancel work mid-stage, and
   `context.log(message, level)` for anything worth debugging later (logging is a setting, so never
   assume the log exists).
4. Each module page shows `<ReportHistory>` (previous runs from the report index) and only starts a new
   run through the config dialog. Opening a past run loads it read only; resuming is owner only.
5. `runReport` checkpoints the envelope to the report library after every stage; failed or paused runs
   resume from the last completed stage (Reports page → View → Resume).
   The report folder is verified with `Reports().checkFolder()` and repaired with `ensureFolder()`,
   which report `exists`, `canView` and `canEdit`: surface those rather than failing silently.
   A report is one file (`kind__id.json`) overwritten in place, never recycled and rewritten; a small
   `index.json` in the same folder carries status, owner, version and stage summary for listings.
4. Register the mini app in `src/miniApps/MiniApps.registry.ts`; routes and report runners come from it.
5. Reuse `<ReportRunPanel>` and `<ReportIssues>` from `src/miniApps/shared`.

## Settings

Settings are edited **in the app** (Settings page) and persisted as a single JSON blob on the web part
property `settingsJson`. The property pane exposes that JSON only: never add typed property-pane
fields for app config.

- Read with `useSettings()` / `getSettings()`; write with `saveSettings(next)`.
- Writing requires the page to be in edit mode (`useEditMode()`); in read mode the editor is disabled
  and offers an "Enter edit mode" link.
- Nothing is branded in code. App name, tagline, report library/folder and sites in scope are settings.
- `checkConfig()` / `useConfigCheck()` decides whether the app is configured. **Modules stay disabled
  until it passes**: the sidebar locks them, `RouteView` blocks them, dashboard cards route to
  Settings instead.
- Full screen is a per-user preference in localStorage, never configuration. It is disabled while the
  page is in edit mode.

## View states

Every view handles loading, empty, error and 401 through `<AsyncBoundary>`. Progress uses
`ProgressBar` / `ProgressGroup` / `ProgressRing` with the shared status set: pending, waiting, running,
throttled, paused, succeeded, failed, cancelled, skipped. `StatusBadge` renders any of them with an icon.

## Querying SharePoint

- Batch wherever a call repeats per row: `const [batch, execute] = getSp(url).batched()`, queue the
  chained calls, then `throttled(() => execute())`. One request per 20 lists beats 20 requests.
- Item fields differ by list type. `File_x0020_Size` does not exist; file size comes from
  `select("File/Length").expand("File")` and only on document libraries. Check `kind`/`baseTemplate`
  before selecting library-only fields, or every list returns 400.

## Detail views

Anything that needs more room than a table cell opens `<PreviewDialog>`: title, description, facts
grid, stacked sections and footer actions. Use it for row drill downs (a list, a page, a web part
type) rather than inventing a new panel each time. Debug output (run settings, stages, issues, log)
belongs in the run details dialog, not in report tabs.

## Module file layout

Inside `src/modules/<name>/`:

- `<Name>.page.tsx` wires the module together and holds no markup beyond layout.
- `cards/*.ocard.tsx`: one overview card per file.
- `<Name>.stats.tsx`: the overview stat tiles and the logic that derives them.
- `tabs/*.tab.tsx`: one tab body per file.
- `*.dialog.tsx`: one dialog per file.
- `<Name>.columns.tsx`: table column definitions.
- `<Name>.csv.ts`: every CSV export for the module, one row mapper per shape. Pages call these, they
  never build CSV rows inline.
- `<Name>.report.ts`, `.logic.ts`, `.content.ts`, `.types.ts` as before.

Chart and stat titles read `<measure> by <dimension>` ("Storage by list", "Instances by web part"),
so the same fact is named the same way in every module.

## Overview cards

Overview charts use `<ChartCard>`: title, an info tooltip explaining what the chart is for, and the
chart types the data actually suits (`charts={["hbar", "donut"]}`), so the reader can switch. Stat
tiles take `info` for the same reason. Every card must be able to say why it is on the page.

## Module pages

A module page opens on its run history, never on an empty report. `<ReportHistory>` lists previous
runs with a single primary action; opening or resuming a run swaps to the report view, which carries a
back control (`controller.clear()`). Tabs and the run toolbar only render when a run is open.

## Navigation

The open module lives in the `page` query string (`?page=lists-audit`), written with
`history.replaceState` so a module can be linked to directly. Never move it back to the hash.

## Runs and ownership

- The queue lives in the browser. `restoreQueue()` persists a snapshot to localStorage and marks
  anything that was still running as paused with an "interrupted" note on the next load; report
  progress itself survives in the report library, not in the browser.
- `useLeaveGuard()` warns before a reload or navigation while a task is active.
- `index.json` carries each run's status and owner, so unfinished runs are only listed for, and only
  resumable by, the person who started them.

## Failures

A failed task shows `StatusBadge status="failed"` plus a **View error** action opening `<ErrorDrawer>`
(message, task context, copy, retry). Never leave an error as red text with no way to read or retry it.

## Layout

- Tables render through `<Table>`: fixed columns inside an own-scroll wrapper. Justified DetailsList
  layout inside a flex or grid parent grows the container on every resize tick: do not reintroduce it.
- Grid tracks use `minmax(min(<px>, 100%), 1fr)` and flex/grid children that hold wide content keep
  `minWidth: 0`, otherwise intrinsic content width pushes the page past the viewport.
- `box-sizing: border-box` is set globally for `.auditpoint-root` in `Global.styles.ts`.

## Tables

Columns declare `sortValue` to become sortable and `filterValue` to add a generated value filter;
pass `searchValue` for a keyword box. `<Table>` owns sort, filter and search state and virtualises
above 60 visible rows. Audit output tables must supply all three.

## Accessibility (WCAG 2.2 AA)

Semantic elements, real labels, visible focus, 4.5:1 contrast, keyboard-complete, 44px targets.
Icon-only controls carry `ariaLabel`. Colour never carries meaning alone: always pair with text.

## Writing

- **No em dashes** anywhere: UI strings, comments, docs, commit messages. Use a comma, a colon, a full
  stop or brackets. The same goes for placeholder cells: use `-`, not an em dash.
- Say the thing once. No filler openers ("simply", "just", "in order to"), no restating the label in
  the description, no sentence that only tells the reader what they can already see.
- UI copy is short and literal. A description earns its place by adding a fact the label does not.

## Conventions

- Import via `@/`. No `../../..`.
- Comments are rare and explain **why**. No JSDoc on obvious props, no narration.
- `pnpm check` (tsc + eslint) must pass.
- Bump `src/version.ts`, `package.json` and `config/package-solution.json` together.
