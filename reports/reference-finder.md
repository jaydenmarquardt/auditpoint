# Reference Finder — Feature Report

Source of truth in the existing app:

- `QUARK/src/admin/adminPanel/settings/ReferenceFinder.settings.tsx` — the whole UI (one file).
- `QUARK/src/api/referenceFinder/ReferenceFinder.util.ts` — scan orchestration, filters, sorts, import/export of raw scans.
- `QUARK/src/api/referenceFinder/LinkAudit.util.ts` — link classification, broken-link checking, aggregation, CSV audits.
- `QUARK/src/api/referenceFinder/ReferenceFinder.types.ts` — all shared types.
- `QUARK/src/api/referenceFinder/Reports.util.ts` — saved report files (checkpoints).

Shared plumbing (throttling, concurrency, report storage, URL parsing, document parsing, CSV/blob) is documented separately in `api-utils.md`.

---

## 1. Goal

Answer, for an entire SharePoint site, the two questions an intranet owner keeps asking:

1. **What links to what?** For any page, list item or document: what points at it (incoming) and what it points at (outgoing).
2. **What is broken or wrong?** Which links are dead, which point at the retired legacy intranet, which are external, which are insecure (`http://`), which have no link text, and which resolve to nothing.

Secondary goals that shape the design:

- A scan of a large site takes a long time and will be throttled by SharePoint. It must be **pausable, stoppable, resumable and checkpointed**, never "start again from zero".
- Results must be **shareable and archivable** — saved to the site, exported to JSON, exported to CSV.
- An editor must be able to fix one link and **re-check just that item** without rescanning the site.

## 2. Mental model

Everything is a **Reference**: one scanned thing (a page, a list item, a document) with:

- identity: `id`, `listName`, `title`, `url`, `editUrl`, optional `fileUrl` (server-relative path for library items)
- `outgoing: OutgoingLink[]` — every link found inside its content
- `incoming: ReferenceSummary[]` — flat copies of the references that link to it (flat so the result set stays serialisable and cycle-free)
- state flags: `scanned`, `documentScanned`, `brokenCount`

The **mega menu** (hub navigation) is folded in as a synthetic Reference with `listName = 'Mega Menu'`, `id = 'megamenu'`, no URL. It is a link *source* only, so nothing ever links to it. This makes menu links resolve into each target's incoming list and gives the menu a row in the table like anything else.

An **AggregatedLink** is the other view of the same data: one row per *destination*, collapsing every spelling of the same URL, holding `variants[]` (the distinct spellings found), `sourceLists[]`, `usages[]` and `count`.

## 3. Scan pipeline

`scanReferences(request)` runs up to three phases. Each phase, on completion, publishes results to the UI *and* writes a checkpoint file, so the table fills in before the slow work runs and a stopped run keeps its progress.

### Phase 1 — `items`

1. Build the data-source list. Configured content data sources, plus (if **Include documents** is on) every non-hidden document library on the web (`BaseTemplate eq 101 and Hidden eq false`), each faked into the data-source shape. Skipped libraries: `Apps for SharePoint`, `Apps for Office`, `Style Library`, `Form Templates`, `Preservation Hold Library` — packages and theme assets, not content.
2. Load all items from every source, with throttle retry per source. A source that fails is skipped, not fatal.
3. Scan each item's content for links with a worker pool at the chosen concurrency. Items already scanned in a resumed run are carried over untouched. Results are written **by index** so parallel workers preserve source ordering.
4. Append the mega menu reference.
5. `indexReferences()` then `classifyReferences()` (see below).
6. Publish + checkpoint.

**Turbo mode** (on by default) makes the per-item content scan use SharePoint's indexed data instead of live reads. Far faster, but the index runs 24–48 hours behind, so freshly edited links can be missing.

### Phase 2 — `documents` (optional, `.docx` / `.pdf` toggles)

Runs *after* the table is already populated, because downloading and parsing files is far heavier than the item scan.

- Only references whose `fileUrl` matches a selected kind.
- Concurrency capped at **2** regardless of the slider, and yields to the browser between files (a large PDF parse blocks the main thread).
- Files over **12 MB** are skipped.
- A `429`/`503` on the file fetch is re-raised as a throttle so the retry helper catches it (a file request returns a status rather than throwing).
- Found links are appended to `outgoing` with `source: 'document'`.
- Index and classify are re-run, then publish + checkpoint.

### Phase 3 — `broken` (optional toggle)

- Candidate set = every link that is still `unsure` **and** intranet, de-duplicated after stripping `?`/`#` (a fragment or query never changes which page exists).
- Each URL requested once at concurrency **4**, `HEAD` with `same-origin` credentials; falls back to `GET` on `405`/`501` (some SharePoint endpoints refuse HEAD).
- `429`/`503` → surface the throttled state, count down, retry once.
- Network-level failure → status `0`, stays unsure.
- Results written back onto every link sharing that URL: `status >= 400` ⇒ `broken: 'yes'`.
- External links cannot be tested from the browser (opaque cross-origin responses) and permanently stay `unsure`.

### Progress and control

- `ScanControl` (pause/stop) lives in a `useRef`, not React state — the scan loop reads it between every item and would otherwise see a stale closure.
- Progress/status callbacks are rate-limited (~100 ms) because one update per item would re-render the whole table thousands of times.
- 1 s cooldown between phases.

## 4. Link classification

`classifyLink()` decides the type, in this order (first match wins): `script` (`javascript:`) → `contact` (`mailto:`/`tel:`) → `anchor` (`#…`) → `legacy` (host contains `dfatintranet.titan.satin.lo`) → `document` (extension in `pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|msg|vsd|vsdx|one`) → `intranet` (server-relative, or same origin as the tenancy) → `external` → `unknown`.

`classifyReferences()` then sets, per link, `linkType`, `isLegacy`, `isIntranet`, a resting `broken` state, and per reference a `brokenCount`.

**Resting broken state** (before anything is actually requested):

| Condition | State | Why |
|---|---|---|
| type `legacy` | `yes` | the legacy intranet is switched off; every link to it is dead |
| resolved to a scanned item (`itemTitle` set) | `no` | it matched a real item in the index |
| `script`, `contact`, `anchor` | `no` | nothing to request |
| `external` | `unsure` | cross-origin responses are opaque, can never be proven |
| unresolved intranet | `unsure` | testable — this is what the broken pass tests |
| anything else | `no` | |

Labels shown in the UI: `yes` → **Broken**, `no` → **Working**, `unsure` → **Untested**.

## 5. Indexing (incoming links)

`indexReferences()` builds a URL → references map, keyed lowercase (SharePoint casing varies between the list and the stored link), registering each reference under its relative URL, absolute URL, `LegacyUrl` and `fileUrl`. Then it walks every outgoing link once, trying the URL as written and again with `?`/`#` stripped.

On a match the link gets stamped with `editUrl`, `itemTitle`, `itemId`, `itemListName`, and the source reference is pushed onto the target's `incoming`.

Two things worth preserving in a rebuild:

- It is **O(links)**, not O(items²) — comparing every item to every other was the original design and did not scale.
- Incoming de-duplication is keyed on `sourceRef + link.source + sourceLabel`, **not** just the source item. A page that links here from both its body and a webpart shows as two distinct incoming rows, which is what an editor needs to fix both.
- It is safe to re-run, which the document and rescan paths depend on.

## 6. Aggregation (by-link view)

`aggregateLinks()` collapses spellings using `normaliseUrl()`: lowercase, strip the tenancy host (so absolute and server-relative forms land on the same key), strip a trailing slash, bare host ⇒ `/`.

Merge rules across variants of the same destination: the first non-empty `targetTitle` and `text` win; any one variant proven `yes` makes the whole row broken; `no` upgrades only from `unsure`; the first non-zero status is kept.

## 7. Persistence

### Saved reports (checkpoints)

Written to `SiteAssets/reports/reference-scan-<runId>.json`, where `runId` is an ISO timestamp with `:` and `.` replaced by `-`. One file per run, **overwritten** each checkpoint, so an interrupted run leaves one resumable file rather than a trail of partials.

Payload (`ScanExport`): `version` (currently 2), `scannedAt`, `count`, `siteUrl`, `runId`, `completedPhases`, `totals`, `references`.

On read, references are normalised (live `item` dropped, missing arrays defaulted) and re-classified — version-1 files predate the type/legacy/broken columns.

The UI lists these newest-first, labelled `<timestamp> (<size>KB)`, with **Delete report** and **Open reports folder** actions.

### Resume

Completed phases are recorded, so **Continue scan** only reruns what is missing. The button appears when results exist and either items never finished, or documents were requested and never ran, or the broken check was requested and never ran.

### Import / export of raw scans

- **Export results** — downloads the same JSON payload as `reference-scan-<yyyy-mm-ddThh-mm-ss>.json`.
- **Import results** — file picker, accepts either a bare array or a `ScanExport`, tolerates hand-edited and v1 files, then re-classifies.

## 8. CSV audits

`buildLinkAudit()` flattens the scan to **one row per link found** (not per item). Every value is forced to a string or number because the shared CSV writer throws on `undefined`.

Columns: `sourceList, sourceId, sourceTitle, sourceUrl, sourceEditUrl, linkText, linkUrl, linkType, linkSource, linkSourceLabel, isIntranet, isLegacy, isBroken, status, targetList, targetId, targetTitle, resolved, isInternal, isExternal, isInsecure, isAnchor, isContact, isJS`.

Each audit CSV is prefixed with a **summary block** (`Measure,Count`) so the sheet opens on the same figures the tool shows without needing a pivot: report name, generated timestamp, the reference totals, then link-type counts (intranet, legacy, document, external, anchor, contact, script, unknown, insecure, empty text, matched, unmapped).

Export buttons:

| Button | File | Filter | Enabled when |
|---|---|---|---|
| Export link audit | `link-audit-<date>.csv` | all links | any outgoing links |
| Export external only | `external-link-audit-<date>.csv` | `isExternal` | any external |
| Export broken only | `broken-link-audit-<date>.csv` | `isBroken = Broken` | any broken |
| Export links (item dialog) | `links-<item-title>.csv` | one reference | that item has outgoing links |
| Export usages (link dialog) | `link-usages-<url-slug>.csv` | one aggregated link's usages | that link has usages |

## 9. UI surface

Rendered as an admin settings page: key `referenceFinder`, icon `Relationship`, title *Reference Finder*, width `1400px`. It is a single `component`-type smart-form field that renders the whole tool; it has no settings to load or save.

### Settings panel (before/between scans)

- **Saved reports** block (only when reports exist): dropdown of saved reports, *Delete report*, *Open reports folder* (new tab). Selecting one loads it without rescanning.
- **Site to scan** text field — blank scans the current site; otherwise an absolute URL, validated to be in the same tenancy (inline error *"That site is not in this tenancy."*). Scanning another site is just handing the data sources a different `IWeb`.
- Toggles: **Include documents** (Yes/No, default on), **Turbo Mode** (On/Off, default on), **Scan .docx content** (default off), **Scan .pdf content** (default off), **Check unmapped intranet links** (default off).
- **Parallel scans** slider, 1–8, step 1, default 1.
- Explanatory copy under each group: the turbo-mode staleness caveat; the document rules (downloaded and read in the browser, runs after results are on screen, two files at a time, skips >12 MB); the broken-check caveat (external links cannot be tested from the browser); the throttling note (waits as long as SharePoint asks, up to three minutes, then retries; progress saved to `SiteAssets/reports` after each stage).

### Action bar

- Idle with results: **Rescan**, **Continue scan** (when resumable).
- Settings open: **Start new scan**.
- Scanning: **Pause/Resume scan**, **Stop scan**.
- Idle: **Export results**, **Export link audit**, **Export external only**, **Export broken only**, **Import results** — each disabled when its underlying count is zero.
- A single status message line under the bar.

### Stat badges

Pill badges with icon, label, count and a colour tone, shown once results exist: Items, Pages, Documents, PDFs, Word docs, Scanned, Incoming, Outgoing, In webparts, In documents, Mega menu, External, Broken.

Tone palette is deliberately hand-defined (grey/green/blue/teal/orange/indigo/red/yellow), every pairing dark text on a light background, because the theme's contrast variables are not defined for every hue and one badge became unreadable.

### Progress

Custom progress bar with `role="progressbar"` and aria value attributes, a percentage label that uses `mix-blend-mode: luminosity` so it stays readable over both the filled and unfilled halves, and a diagonal-stripe fill when paused or throttled. The loading block above it switches title between *Scanning references* / *Scan paused* / *Throttled - waiting to retry*.

### Views

A **Group by** toggle switches between *Item* and *Link*. Switching resets filters, resets to page 0, and swaps the default sort (`list` for items, `uses` for links) — the two views hold different row shapes so each has its own filter/sort pipeline.

**Items table** — columns: List, Title, Incoming, Outgoing, Broken. Row click opens the item dialog; selected row is tinted; a not-yet-scanned row is greyed with a `progress` cursor.

**Links table** — columns: Link, Source (source lists joined), Type (tag), Status (tag), Uses, Resolves to. Row click opens the link dialog.

Both are preceded by a search toolbar and followed by pagination at **100 rows per page**, and a line reading `Showing X of Y results (filtered from Z)`.

### Search toolbar

- Free-text search box. Item search matches title + URL + all outgoing and incoming URLs; link search matches the normalised key, link text and target title.
- **Filters** dropdown — a grid of multi-select filter boxes with paging (8 per page), counts and titles.
- **Sort by** dropdown — single-select sort key plus an Ascending/Descending toggle.

Item filters:

- *Lists* — built from the results, since which libraries exist varies by site.
- *Only show* — Scanned, Has a connection, Has incoming, Has outgoing, Has broken links, Has webpart links, Has links from file content. Every chosen condition must hold.
- *Hide* — Not scanned, No connection, No incoming, No outgoing, No broken links, No webpart links.

Item sorts: Title, List, Incoming Count, Outgoing Count, Broken Count.

Link filters: *Type* (the eight link types), *Status* (Broken / Working / Untested / Matched / Unmapped), *Source* (built from the source lists present in the results).

Link sorts: Times used (default, most-used first), Link, Type, Spellings.

### Item dialog

A real modal (`min(1400px, 94vw)`, max height 88vh) with a sticky header carrying title, subtitle (list name) and actions: **Refresh**, **Export links**, **Edit** (new tab, hidden for the mega menu), **Close**.

Body, for a normal item: list + URL header, then three tables —

- *Broken links* — Found in (source tag + label), Text, URL, Status. Empty state: green "No broken links".
- *Outgoing links* — Found in, Type, Text, URL, Item, Status, Intranet, Legacy, Insecure, Edit action.
- *Incoming links* — Found in, List, ID, Title, URL, Edit action.

Body, for the mega menu: a single table of Menu path (breadcrumb trail through the menu), Label, URL, Type, Status, Resolves to — the menu has no incoming links and nothing to edit per row.

**Refresh** rescans just that item (or re-reads the mega menu), optionally re-parses its document, folds it back into the result set, rebuilds the whole index (incoming links elsewhere may have pointed at it — one pass, so patching is not worth the complexity), re-selects the same row and re-saves the checkpoint.

### Link dialog

Title is the URL, subtitle `Used N times`, actions **Export usages** and **Open link** (new tab).

Body: type tag, status tag, uses badge; a *Written as [n]* list when more than one spelling was found; then *Linked from [n]* — Found in, Source, Title, Text, Edit action.

### Tags used throughout

- **Type tag** — the link type, tone-coded (intranet blue, legacy red, document teal, external orange, anchor grey, contact green, script yellow, unknown grey).
- **Status tag** — Broken (red) / Working (green) / Untested (yellow), with the HTTP status appended when known, plus a separate blue **Matched** pill (with the target title as tooltip) when the link resolved to a scanned item.
- **Source tag** — Content (blue) / Webpart (indigo) / Mega menu (grey) / Document (teal), with the source label (e.g. the webpart name or menu path) underneath in small muted text.
- **Empty panel** — dashed-border tinted panel with icon, bold title and description, used for every empty table and the no-results state.

Long URLs are constrained (`max-width: 340px`, break anywhere) or they push every other column off the table.

## 10. Rebuild checklist

- Types first (`Reference`, `OutgoingLink`, `AggregatedLink`, totals, filter/sort contracts) — everything else hangs off them.
- Classification and index/aggregate are pure functions over `Reference[]`; they are the testable core and should stay free of any data-access code.
- Keep the phase/checkpoint split. It is the difference between a tool that survives a 4,000-item site and one that does not.
- Keep filters and sorts as data (`{key, title, children, onFilterItems}` / `{key, title, onSortItems}`) so both views share one toolbar.
- Memoise the derived sets (`summariseReferences`, `aggregateLinks`, the source filter). Without it every render walks the whole result set several times, which at tens of thousands of links drops frames on every keystroke.
