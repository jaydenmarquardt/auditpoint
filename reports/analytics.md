# Analytics — Feature Report

Source of truth in the existing app:

- `QUARK/src/admin/adminPanel/settings/Analytics.settings.tsx` — thin wrapper, renders `<AnalyticsPanel />`.
- `QUARK/src/admin/adminPanel/analytics/AnalyticsPanel.tsx` — scan orchestration, run controls, saved reports, tab host.
- `QUARK/src/admin/adminPanel/analytics/Analytics.reports.ts` — saved report files.
- `QUARK/src/admin/adminPanel/analytics/types.ts` — view-model types.
- Tabs: `GeneralTab.tsx`, `UserTab.tsx`, `PagesTab.tsx`, `ContentTab.tsx`, `FilesTab.tsx`, `StaleTab.tsx`.
- Shared UI: `Table.tsx`, `ActivityBadges.tsx`, `PageDetailsPanel.tsx`.
- Data engine: `QUARK/src/objects/SiteAnalytics.class.ts` (`SPLAnalytics`).
- File/tenant data: `QUARK/src/api/analytics/FileAnalytics.api.ts`.

Shared plumbing is documented in `api-utils.md`.

---

## 1. Goal

Give an intranet owner a single, self-contained report on a SharePoint site covering:

- **Traffic** — views, unique viewers, time spent, by window and by month.
- **People** — how many users, when they joined.
- **Pages** — per page, per folder and per org-unit performance, plus content depth (word count, webparts, links) and version history.
- **Content lists** — volume, contributors, and category/price/status breakdowns for each business list.
- **Files** — libraries, file types, storage, and what actually gets opened or downloaded.
- **Stale content** — what has expired, is past review, or has been abandoned.

The feature is explicitly labelled **ALPHA** in the UI: *"Metrics are still being validated. Treat this as directional reporting."*

Constraints that shape the design:

- Only site admins may run it (`theUser().isAdmin()`, checked on mount and again on run).
- A scan touches thousands of items and will be throttled. It must be pausable, stoppable, resumable, and checkpointed after every pass.
- Several data sources are tenant-gated. The tool degrades gracefully and *tells the user which permission is missing*, rather than silently showing zero.

## 2. Scan pipeline

Nine named passes, tracked as `AnalyticsStep[]` so a resumed run skips what it already did. Every pass writes a checkpoint file on completion.

| # | Step | What it does |
|---|---|---|
| 1 | `users` | Counts from `User Information List` by created/modified date, windowed. |
| 2 | `userGrowth` | Users joined per month, last 12 months. |
| 3 | `pageStats` | Same windowed counts for `Site Pages`. |
| 4 | `content` | Per-list stats for each configured content source, one at a time. |
| 5 | `pageList` | Loads every page item (folders excluded), plus the Organisational Units lookup list. |
| 6 | `pageScan` | Bulk view totals for all pages, then one summary row per page. |
| 7 | `files` | Library/file-type walk, file view rows, downloads, tenant usage. |
| 8 | `siteTotals` | Daily site activity, overall traffic, day-of-week usage. |
| 9 | `dailyDetail` | Optional pre-load of per-page daily history for the top N pages. |

Notes that matter for a rebuild:

- **Bulk before per-page.** `getPagesViewTotals()` returns every page's view windows in a handful of paged requests (200 rows, up to 200 pages). Asking each page for its own analytics costs seconds per page and cannot finish on a site of any size. The trade is detail: bulk gives aggregate windows only; daily rows come from `getPageAnalytics()` on demand.
- Each page row is then built with **no request of its own** (`getPageSummary`) — likes/comments, user emails and item keys are all pre-loaded once into maps.
- Individual failures never abort the run. Each is caught, pushed onto an `errors[]` array, and surfaced in a collapsible *"N issue(s) found while scanning"* block.
- A stopped or failed scan still keeps everything it collected and still writes the checkpoint.
- Step 9 runs **last and only when asked for**, because everything above it is already saved — stopping during it still leaves a complete report.

### Throttling and concurrency

- `ScanControl` in a ref for pause/stop; every loop checks it between items.
- `AdaptiveConcurrency`: on a throttle the lane count **halves**; after a clean minute it climbs back one lane at a time. The status line reports the current lane count.
- Progress updates are gated (~100 ms) and checkpoints are gated to once a minute, so a big scan is not constantly rewriting a large file.
- A throttle countdown outranks the progress ticker — otherwise the panel keeps saying it is scanning while every lane sits waiting.
- Page requests are spaced 25 ms apart.

### Site-activity fallback

`getSiteActivityByDay()` tries three endpoint shapes in turn (`analytics/getActivitiesByInterval`, `getActivitiesByInterval`, `oneDrive.getAggregatedAnalytics` with `accessStatsByDay`) because tenants disagree about which exists; first one to answer wins.

If none answer, the charts are **summed from a sample of the 25 most-viewed pages** (one request each), `activitySamplePages` is recorded, and the General tab says so on screen.

## 3. Result shape

`IAnalyticsResult`:

- `users: IListStats` — `total` plus `new`/`modified` window counts.
- `pages: IListStats & { items: IPageAnalyticsItem[] }`.
- `content` — keyed stats for `adminCirculars`, `jobDescriptions`, `announcements`, `events`, `classifieds`, `executiveMessages`, `newsItems`, `bigPictureItems`.
- `site` — `overallTraffic`, `activityByDay`, `activitySamplePages`, `usageByDay`, `activitySummary`.
- `files` — window, view rows, libraries, file types, downloads availability + reason, tenant site usage + reason.
- `usersMonthlyJoined`.

**Window set** used everywhere (`IWindowStats`): today, yesterday, last 7 days, this week, last week, this month, last month, last 30 days, last 90 days, last 365 days, this year, last year. Weeks start Monday. `total` is the number of rows actually read, not the list's `ItemCount`, so it always matches the windows beneath it.

**Content source config** is built on demand because list and field names come from config. Each source names its list plus optional field candidates (arrays, tried in order, so one renamed column does not break the query), an optional content-type filter, and an optional **fallback list** used when the first holds nothing (for sites that never migrated). Item queries select `*` plus `ContentType/Name` so a missing custom field cannot break the whole request.

## 4. Persistence

Saved to `SiteAssets/reports/analytics-scan-<runId>.json`, one file per run, overwritten each checkpoint.

`AnalyticsReport`: `version`, `runId`, `scannedAt`, `complete`, `siteUrl`, `completedSteps[]`, `scannedPageIds[]`, `errors[]`, `analytics`.

On mount the panel lists saved reports and **auto-opens the newest**, so the tool is never blank on arrival. Opening a report restores the scope, site URL, errors, last-run stamp and snapshot counters, and marks every section loaded. An incomplete report becomes `resumable` and surfaces a **Resume scan** button plus a line reading *"This report stopped after X of 9 passes, with N pages scanned."*

Reports are labelled by their modified timestamp (locale string).

## 5. Panel chrome

- ALPHA banner (`role="status"`, `aria-live="polite"`).
- Header: title, *Last run* stamp, **Parallel page scans** slider (1–8, default 2, hidden while scanning), **Pause/Resume**, **Stop**, **Resume scan** (when resumable), **Run scan**.
- **Site to scan** panel: *This site* / *Another site* segmented buttons; the second reveals a site-address field validated against the tenancy.
- **Pages to pre-load daily detail for** slider: 0–500, step 25, default 0. Copy explains that view totals arrive in bulk and a page loads its own daily history when opened, so this can stay at zero; raising it pre-loads daily rows for that many of the most-viewed pages in a final pass after the rest is saved.
- **Saved reports** panel: dropdown, *Delete report*, *Open reports folder* link, and the resumable hint.
- **Progress** panel while running: title switches between *Progress* / *Scan paused* / *Throttled, waiting to retry*; a live status line (`[6/9] Reading pages [1,204 / 3,880]`) and a fractional progress bar.
- **Errors** panel: `<details>` with an ordered list.
- Six tabs, slim style. Each tab body is wrapped in a section panel with a title, optional context line, and a *Loading…* state driven by a per-section status (`idle` / `loading` / `loaded`) — general, users, pages and content statuses drive all six tabs.
- Non-admin: the whole panel is replaced by *"You do not have permission to view this feature."*

Every tab has its own **Export report** CSV button (icon + label), exporting exactly what that tab currently shows, including the active filter/window and sort.

## 6. Tabs

### General

- Window switch: **Today / 7d / 30d / 90d**.
- **Overall traffic** card, three KPI + line-chart pairs: *Viewers, summed per page*; *Site visits*; *Avg time per viewer, a page*. Lines are 12-month series. If a value is missing it is recalculated on the fly by summing the page rows.
- Explanatory copy: SharePoint reports viewers per page, so someone who read three pages counts three times; monthly charts only cover the 90 days the scan asks for, so earlier months read as zero; plus the sampled-activity warning when applicable.
- **Content Overview** stat grid: Lists, Libraries, Pages, Files, Users, Images, Items.
- **Views by day of week**: seven rows, each a labelled progress bar scaled to the busiest day, with the view count on the right.
- CSV export: header block, overall traffic metrics, content overview, then day-of-week rows.

### Users

- Hero tile: **Total users**.
- **New users** stat grid across all twelve windows.
- **Users joined (last 12 months)** line chart, axis-titled Month / Joined.
- CSV export: totals, window rows, then month rows.

### Pages

The heaviest tab.

- **Page activity** badges: for each of eleven windows, a box showing *Added* and *Edited* counts with icons, muted when zero.
- **Review and expiry pages** badges: This week / This month / This quarter / Overdue, each showing review (calendar icon) and expiry (warning icon) counts. A review or expiry date set *before* the page's last edit has been overtaken by that edit and is not counted.
- **Views by folder** and **Views by Org** aggregate tables, each with its own window switch (**Today / 7d / 30d / 90d / All**) and sortable columns: label, Views, Unique, Views %, Unique %, Likes, Comments, Pages. Delta columns are hidden for *All*, *Today* and *90d*; engagement columns only show for *All*.
- **Individual page analytics**: a *Pages in site* pill, a **Find pages** search box (matches title, id, url or folder path), the shared window switch, a sortable table (Page, Views, Unique, Views %, Unique %, Likes, Comments) with per-row icon actions — *Open page details*, *View page*, *View folder* (tooltip carries the folder path and id), *Edit page* — and client-side paging at **12 rows per page** with Previous/Next and a `Showing X of Y` line.
- Deltas render with `+` prefix and an up/down/flat tone class. Where only a percentage is known, the previous value is reconstructed from current ÷ (1 + delta/100).
- CSV export covers the whole filtered set with the active window.

### Page details panel

Opened from a page row. A modal overlay (`role="dialog"`, `aria-modal`) that, on open, fires **two requests in parallel** (full page analytics over 730 days, and deep content stats) plus a third for version history, each with its own loading and error state.

- Header: page title, actions **Export CSV**, **View page**, **View folder**, **Edit page**, **Close**.
- Stat grid: All-time views, All-time unique, Likes, Comments, Word count, Character count, Webparts, Headings, Links, Images, Total revisions.
- **Views breakdown** card: paired boxes — Today vs yesterday, This week vs last week, this month vs last month, this quarter vs last quarter, this year vs last year — each with its own percentage-change line, tone-coded.
- Two sub-tabs: **Activity** and **Versions**.
- Activity: three KPI + line charts (Unique viewers, Total views, Average time spent per day), a **Page traffic by time** heat map (hour × day, six-stop colour scale) that falls back to *"Hourly traffic data is not available for this page"*, and a sortable **Daily activity** table (Date, Total views, Unique viewers, Average time spent) with rows normalised to one per calendar day.
- Versions: sortable table (Date modified, Modified by, Version, Open) — up to 200 versions, newest first, each linking to `?version=<label>`.
- Empty state when the page has no traffic at all.

### Content

One card per content list, in a fixed order: Admin circulars, Job descriptions, Announcements, Events, Classifieds, Executive messages, News items, Big picture items.

Each card carries an **Open list** button (uses the list's `DefaultViewUrl`) and shows:

- windowed added/edited stats across the eleven windows,
- contributor count,
- **Items created per month** vertical bar chart,
- and then whatever breakdowns that list supports, each a pie chart plus a text legend of label/value pairs:
  - Events → *Events by event date* bar chart, *Items by category*
  - Classifieds → *Items by category*, *Price range stats* (Free, under $20, $20–99, $100+, unknown)
  - Executive messages → *Items by position title*
  - Job descriptions → *by position function*, *by classification*, *by post location*
  - Admin circulars → *Admin circular replacement stats*: a *Replaced ACs* pill plus a status pie
  - News / Big picture → *Items by category*

Charts only render when there is non-zero data.

### Files

- Summary tiles: Libraries, Files, Images, File types, Size (human-formatted bytes).
- When tenant usage is available, a second tile row: Active files, Page views, Pages visited.
- View switch: **Libraries (n) / File types (n) / Most opened (n)**.
- *Libraries* table: Library (flagged *(no read access, count only)* when unreadable), Files, Folders, Images, Size, Last change. Sortable.
- *File types* table: Type, Files, Share (% of all files), Size. Sortable.
- *Most opened* table: File (linked), Views, Viewers, Downloads. The Downloads column is hidden entirely unless the audit-log source is available; the Views header becomes *Views (lifetime)* when the rows came from the search fallback.
- Contextual notices under *Most opened*: which source the numbers came from and its lag; that downloads need `AuditLogsQuery.Read.All` because no analytics endpoint separates a download from a view; that tenant usage totals need `Reports.Read.All`. Each includes the specific failure reason returned by the API layer.
- Export exports whichever view is active.

### Stale

Flags a page when:

- its expiry date has passed → **Expired**
- its review date has passed → **Review overdue**
- it has neither date and has been untouched for **365 days** → **Neglected**

A review or expiry date earlier than the page's last-modified date is ignored — that edit already overtook it.

- Filter buttons with live counts: **All / Expired / Review overdue / Neglected**.
- Sortable table: Page (linked), Organisational unit (default *Unassigned*), Reason, Due, Days overdue, Last modified, Last editor, Views 30d, Views all time. Default sort: most viewed first.
- Empty state: *"Nothing is overdue in this report."*

## 7. Shared table component

One generic `Table<T>` used by Pages, Files, Stale and the details panel:

- Columns are data: `{key, label, iconName?, sortable?, align?, hide?, render}`.
- Sortable headers render as buttons with an optional leading icon and a chevron that rotates for direction and highlights when active.
- `hide` removes a column entirely (used for the permission-gated Downloads column).
- Empty rows render a muted message instead of a table.
- Sorting is owned by the parent (`sortKey`, `sortDirection`, `onSort`), so each table keeps its own independent sort state.

## 8. Rebuild checklist

- Keep the nine-step, checkpointed pipeline and the `completedSteps` resume contract — it is what makes the feature usable on a real site.
- Keep the bulk-then-detail split for page analytics. Reverting to per-page requests will not finish.
- Keep every gated data source behind a `Capability<T>` shape (`available`, `reason`, `data`) and surface the reason in the UI. Silent zeros are worse than a missing column.
- Keep per-item errors non-fatal and collected.
- Window definitions, the eleven-window stat grid, and the delta/tone conventions should live in one place — they are repeated across four tabs.
- Adaptive concurrency plus gated progress updates are not optional polish; without them the panel re-renders per item and the tenant throttles the run into failure.
