# Shared API & Utility Layer

Everything both **Reference Finder** and **Analytics** depend on. Each entry states what it does, why it exists in that shape, and what a rebuild must preserve.

---

## 1. Throttling and scan control — `util/Throttle.ts`

SharePoint throttles hard. This module is the reason a long scan survives it.

### Constants

| Name | Value | Purpose |
|---|---|---|
| `THROTTLE_PAUSE_MS` | 3 min | fallback wait when the response does not say how long |
| `THROTTLE_RETRIES` | 3 | attempts before giving up |
| `PROGRESS_THROTTLE_MS` | 100 ms | minimum gap between progress/status updates |
| `MIN_RETRY_AFTER_MS` | 10 s | floor on a trusted `Retry-After` |
| `LANE_RECOVERY_MS` | 60 s | clean time before a lane is earned back |

### `ScanGate` / `ScanControl`

Interface: `isStopped`, `isPaused`, `checkpoint(): Promise<boolean>`. `checkpoint()` blocks while paused (polling every 250 ms) and returns `false` once the scan should give up.

`ScanControl` implements it with `reset/stop/pause/resume`. **It must be held outside React state** (a `useRef`) — the scan loop reads it between every item and would otherwise close over a stale value. `openGate` is the no-op implementation for callers with nothing to pause.

### `isThrottleError(e)`

True on status `429` or `503` (checking `status`, `statusCode` and `response.status`), or when the message contains `429`, `throttl` or `too many requests`.

### `retryAfterMs(e, fallback)`

Reads `retryAfter` / `headers['retry-after']` / `response.retryAfter`. Honouring the tenant's own number turns a blind five-minute hold into the few seconds actually requested. Clamped to `[10s, fallback]`.

### `countdown(ms, control, tick)`

Counts down in one-second slices so **stop stays responsive**, holds (does not decrement) while paused, and calls `tick(secondsLeft)` for the status line.

### `retryWhenThrottled<T>(request, options)`

The single wrapper every request goes through. Runs the request; on a throttle it flags `onThrottled(true)`, counts down the honoured wait, then retries. **Anything that is not a throttle is rethrown untouched.** Throws `Still throttled after retries` when exhausted.

Callers that fetch raw (not via the SharePoint client) must convert a `429`/`503` *response* into a thrown error carrying `status`, or the retry layer cannot see it.

### `AdaptiveConcurrency`

A lane budget rather than a worker pool: workers park in `acquire()` while `active >= limit`, so the limit can change mid-pass. `backOff()` **halves** the lanes (one throttle usually means several more); `recover()` adds one lane back after a clean `recoveryMs`. `lanes` is exposed for the status line.

### `updateGate(ms)`

Returns a `(force?) => boolean` gate. One status update per item re-renders the whole panel, so callers ask the gate whether it is time yet. Also used with a one-minute interval to rate-limit checkpoint writes.

---

## 2. Concurrency and request queue — `util/RequestQueue.ts`

- **`wait(ms)`** — promise-based sleep.
- **`runWithConcurrency(items, worker, concurrency = 5, startDelayMs = 0)`** — the pool used by every scan. Fixed number of workers pulling from a shared index; results are written **by index**, so ordering survives parallelism. `startDelayMs` spaces request starts (Analytics uses 25 ms).
- **`RequestQueue` / `q(dataKey, request)` / `qc(...)`** — a serialised, cache-aware queue with a 25 ms gap between requests, keyed so a pending request can be cancelled. Used by the general data-access layer these features sit on.
- **`timeOut(request, timeout = 1000, retries = 0)`** — races a request against a timer. Both analytics HTTP helpers wrap their fetch in `timeOut(…, 30000, 1)`: one hung request would otherwise hold a scan lane open for the entire run.

---

## 3. Report storage — `util/ReportStore.ts`

Both features persist to the same place, with different prefixes.

- Library: `SiteAssets`, folder: `reports`. Reference Finder writes `reference-scan-*.json`; Analytics writes `analytics-scan-*.json`.
- **`ensureReportsFolder(folder)`** — asks for the folder and creates it on the miss. Asking and catching is cheaper than listing the library to check.
- **`listReportFiles(folder, prefix?)`** — selects `Name`, `ServerRelativeUrl`, `TimeLastModified`, `Length`; filters to `.json` and the prefix; sorts **newest first**. A missing folder just means no reports, so it returns `[]` rather than throwing.
- **`saveReportFile(folder, name, payload)`** — `addUsingPath` with `Overwrite: true`. One file per run, overwritten each checkpoint, so an interrupted run leaves **one resumable file rather than a trail of partials**.
- **`readReportFile<T>(url)`**, **`deleteReportFile(url)`**.
- **`reportsFolderUrl(folder)`** — absolute URL, for the *Open reports folder* link.
- **`newRunId()`** — `new Date().toISOString()` with `:` and `.` replaced by `-`. Timestamp-based so a resumed run keeps writing to the file it started.

`StoredReportFile`: `{ name, url, modified, size }`.

---

## 4. URL handling — `util/Url.ts`

### Link classification primitives

`isUrlAnchor` (`#…`), `isUrlContact` (`mailto:`/`tel:`), `isUrlJS` (`javascript:`), `isUrlInsecure` (`http://`), `isUrlLink` (none of anchor/contact/js), `isUrlExternal` (a link, not same protocol+host, not starting `/`), `isUrlInternal`, `isUrlRelative`.

### `LinkInfo` and `LinkSource`

```ts
type LinkSource = 'content' | 'webpart' | 'megamenu' | 'document';

interface LinkInfo {
  url: string; text: string;
  isInternal: boolean; isExternal: boolean; isInsecure: boolean;
  isAnchor: boolean; isContact: boolean; isJS: boolean;
  element?: HTMLElement;   // live DOM node — must be stripped before storing
  source?: LinkSource;
  sourceLabel?: string;    // webpart name, mega-menu breadcrumb, etc.
}
```

`element` is why the stored type is `Omit<LinkInfo, 'element'>` — a live node cannot be serialised.

### Builders

- **`getLinkInfo(anchor)`** — from a DOM anchor, `source: 'content'`.
- **`getLinkInfoFromUrl(url, text?, source, sourceLabel?)`** — from a bare URL. Used by the mega menu and the document parser.
- **`scanHTMLForLinks(html)`** — parses an HTML string with `DOMParser`, collects every `<a href>` that is not a pure fragment, returns `LinkInfo[]`. Parse failure returns `[]`.
- **`linkInfo(anchor, scan)`** — the same plus an optional live reachability test.

### Other

- **`getWebFromUrl(url)`** — resolves an absolute URL to the owning `IWeb` by taking the first two path segments.
- URL-param helpers: `getUrlParam`, `getUrlParams`, `hasUrlParam`, `setUrlParam` (history `replaceState`), `removeUrlParam`, `getUrlDetails`, `getCurrentUrl`. Values pass through URL-safe encode/decode that round-trips JSON.

---

## 5. Document parsing — `api/docs/Docs.util.ts`

Reads hyperlinks out of `.docx` and `.pdf` files **entirely in the browser**, with no third-party parser.

### Entry point

`scanDocumentForLinks(source, { maxBytes, fileName })` where `source` is a URL (fetched with `same-origin` credentials) or an `ArrayBuffer`.

Returns `DocumentScan`: `{ url, kind, bytes, links, skipped?, status? }`. `status` is exposed so callers can spot a throttle — the fetch answers with a status rather than throwing. `skipped` carries the reason: not a docx/pdf, request failed, or larger than the limit.

Size is checked twice: against the declared `content-length` before download, and against the actual buffer after. Default cap 25 MB (Reference Finder passes 12 MB). Kind is detected from the magic bytes (`PK` ⇒ docx, `%PD` ⇒ pdf) and falls back to the file extension.

### `.docx`

The zip central directory is read by hand (scanning backwards for the EOCD record, since the trailing comment is variable length), entries are inflated with `DecompressionStream('deflate-raw')`, and:

1. Every `word/_rels/*.rels` part is parsed; relationships whose `Type` ends `/relationships/hyperlink` yield the target URL, with the visible label pulled from the matching `w:hyperlink` node in the owning part.
2. `word/document.xml`, headers, footers, footnotes and endnotes are swept for **bare URLs** typed straight into the body — those are never relationships.

### `.pdf`

Decoded as `latin1` so string offsets stay usable as byte offsets. `/URI (...)` entries are collected from the raw text, then up to **500** `/FlateDecode` streams are inflated and swept the same way (newer writers pack annotation objects into compressed object streams). A malformed file can look like thousands of streams, hence the bound. PDF string escapes are unescaped.

### Helpers

`documentKindFromName(name)` → `'docx' | 'pdf' | 'unsupported'`; `isScannableDocument(name)`. Both features use the former for counting PDFs vs Word docs.

Links are de-duplicated by cleaned URL (trailing punctuation stripped, fragments dropped).

---

## 6. File / blob helpers — `util/Blob.ts`

- **`download(filename, data, fileType)`** — Blob + object URL + synthetic anchor click, revoked immediately after.
- **`upload(allowedFileTypes?)`** — synthetic file input, resolves with the file text. Used by *Import results*.
- **`readBlobText(file)`**.

Note: the Analytics tabs each carry their own inline CSV download helper rather than using this one. A rebuild should collapse them onto a single helper.

---

## 7. CSV — `util/Array.ts`

**`toCSV(data: object[])`** — headers from the first row's keys, values `JSON.stringify`d with `null` → `''`, and `\r\n`, `\n`, `\r`, `,`, `"` and `;` replaced with a space. Rows joined with `\r\n`.

Two consequences a rebuild must respect: every field must be a defined string or number before it reaches this (undefined throws), and the escaping is lossy — it strips separators rather than quoting them. The Analytics tabs use their own quote-doubling writer instead, which is the more correct behaviour.

---

## 8. Date helpers — `util/Date.ts`

`startOfDay`, `startOfWeek` (**Monday**, not Sunday), `startOfMonth`, `startOfYear`, `addDays`. These define every window boundary in both features, so the week convention is load-bearing.

---

## 9. Site and tenancy context

- **`theTenancyUrl()`** — tenancy origin. Used for URL normalisation, tenancy validation and building analytics endpoints.
- **`theSiteUrl()`** — current site's server-relative path.
- **`theHub()`** — hub site instance; supplies the mega-menu config and the root site/web IDs.
- **`theContext()`** — SPFx context; supplies `spHttpClient` and `msGraphClientFactory`.
- **`theUser().isAdmin()`** — the Analytics permission gate.
- **`isSameTenancy(siteUrl)`** (in `LinkAudit.util.ts`, reused by Analytics) — origin comparison. Both features validate a typed site address with it before scanning.
- **`analyticsWeb(siteUrl?)`** / `resolveWeb(siteUrl?)` — `Web([sp().web, target])` or the current web. Scanning another site in the tenancy is only ever "hand the data sources a different `IWeb`".

---

## 10. Analytics data engine — `objects/SiteAnalytics.class.ts`

`SPLAnalytics(hub, { control, siteUrl, onStatus, onThrottled })`. Every SharePoint call goes through `send()` → `retryWhenThrottled`, and every loop calls `proceed()` → `control.checkpoint()`.

### Caches (built once per instance)

- `listIds` — list title → GUID.
- `itemKeys` — list → map of item id → `{ itemId (UniqueId), itemGUID }`, read in **one paged request**. Per-page lookups were what tipped large sites into throttling. Items created since the bulk read fall back to a direct request.
- `counters` — page id → `{ likes, comments }`. `OData__LikeCount` / `OData__CommentCount` must be requested **by name**; a `select(*)` omits them, and reading them off the page object loads the whole client-side page (three or four requests per page).
- `userEmails` — user id → email. One read of the user list beats two user requests per page.
- `ids` — `{ host, siteId, webId, siteKey }`. The hub knows its own; a scan pointed at another site asks that site for them.

### HTTP

`getJson(url, label)` uses `spHttpClient` with `accept: application/json;odata.metadata=minimal`, wrapped in a 30 s timeout with one retry. On a non-ok response it throws an error carrying `status` and `retryAfter` — the analytics endpoints are not on the pnp client, so a throttle arrives as a plain 429 response and has to be converted for the retry helper.

### Public surface

| Method | Returns |
|---|---|
| `itemsStatsFromList(list)` | windowed created/modified counts (`total` = rows read) |
| `userStats()` / `pageStats()` | the above for `User Information List` / `Site Pages` |
| `listContributorCount(list)` | distinct `AuthorId` count |
| `contentListStats(list, options)` | full content-list analytics incl. breakdowns |
| `getIdsForAnalytics(list?, id?)` | host/site/web/list/item identifiers |
| `getPagesViewTotals()` | `Map<key, IPageViewTotals>` for every page, in ~n/200 requests |
| `getSiteActivityByDay(daysBack = 90)` | daily site rows; `[]` when no endpoint answers |
| `getSampledActivityByDay(pageIds, pages?)` | daily rows summed from a page sample |
| `getPageSummary(page, totals?)` | one page row, **no request of its own** |
| `pageKey(pageId)` | the unique id the bulk rows are keyed by |
| `getPageAnalytics(pageId, daysBack = 90, loaded?)` | full per-page detail incl. daily rows and change percentages |
| `getPageVersions(pageId)` | up to 200 versions, newest first, each with a `?version=` URL |
| `getFileAnalytics(window, top)` | delegates to `fileViews()` |
| `userMonthlyJoinedStats(months = 12)` | monthly joined series |
| `getOverallTrafficStats(pageItems, activity)` | window totals + three 12-month series |
| `getUsageInsightsByDay(activity)` | seven day-of-week rows |
| `getLibraryStats()` | site summary + per-library + per-file-type stats |
| `getSiteActivitySummary()` | the summary half of the above |
| `pageDeepStats(pageId)` | word/char/webpart/heading/link/image counts |

### Endpoint notes

- Bulk totals: `/_api/v2.1/sites/{siteKey}/lists/{listId}/items?$expand=analytics(...)&$top=200`, following `@odata.nextLink`, capped at 200 pages (~40,000 items). Rows are filed under **every** key they offer — `listItemUniqueId`, `id`, and the URL path — because which one comes back varies.
- Per-page detail: `.../items/{itemId}/oneDrive.getAggregatedAnalytics` expanding `accessStatsByDay` with the window children and `itemActivityStats`.
- `pageUrlKey(url)` reduces any URL to its lowercase path so absolute and server-relative forms match.
- Monthly series bucket on `YYYY-MM` with zeroed buckets pre-created for the last N months, so gaps still plot.
- Library walk: lists selected with `Id, Title, BaseTemplate, ItemCount, Hidden`; templates `101/109/119` count as libraries; each library's items selected with `FSObjType, File_x0020_Type, File_x0020_Size, Modified`, top 5000. `Site Pages` is counted as pages, not files. A library the account cannot read is still included with `unreadable: true` and its `ItemCount` only.
- `pageDeepStats` strips scripts, styles and tags to plain text for word/char counts, counts `<h1-6>` and `<img>` by regex, reads webparts off the page object, and scans content for links once (scanning twice doubled the cost of every deep read for nothing). Image count is `max(img tags, image-extension links)`.

---

## 11. File analytics API — `api/analytics/FileAnalytics.api.ts`

Three data sources, each with a different permission story, all returning a consistent shape.

### `Capability<T>` = `{ available, reason?, data? }`

The pattern that makes permission gating visible instead of silent. `isPermissionError(e)` treats 401/403, or a message containing forbidden / unauthorized / access denied / insufficient privileges, as a permission failure; anything else is reported as a plain request failure.

`permissionMessage(scope)` produces the actionable instruction: add the scope to `webApiPermissionRequests` in `package-solution.json`, deploy, then approve it in SharePoint admin centre → Advanced → API access.

Gated scopes: `AuditLogsQuery.Read.All` (downloads), `Reports.Read.All` (tenant usage).

### `fileViews({ window, top, host, siteKey, sitePath, throttle })`

1. **Primary — item analytics** (no extra scope): `/_api/v2.1/sites/{siteKey}/items` filtered to files, expanding the window (`lastSevenDays` / `lastThirtyDays` / `lastNinetyDays`), ordered by unique viewers, 200 per page, up to 25 pages. Unpaged, a large library is silently cut off at the first page.
2. **Fallback — search index**: `IsDocument:1 path:"<site>"` selecting `ViewsLifeTime`, `ViewsRecent`, `ViewsLifeTimeUniqueUsers`. This is the usage pipeline, so it lags 24–48 hours and only carries lifetime counts, not a chosen window.

Each row records `source: 'analytics' | 'search'` so the UI can relabel the column and explain the lag. Rows are sorted by views and cut to `top`. A total failure returns `[]`, never throws.

### `siteUsageDetail(period)`

Graph `/reports/getSharePointSiteUsageDetail(period='D7'|'D30'|'D90'|'D180')`. Handles both the JSON and the older CSV response shape (with a hand-written CSV parser that honours quoted cells and doubled quotes). Maps to `SiteUsageRow` (site URL/name, file count, active files, page views, visited pages, storage bytes, last activity). Requires `Reports.Read.All`; the tenant privacy setting must also allow identifiable names or every site comes back hashed.

### `fileDownloads({ days, maxRecords })`

The **only** real download source — no analytics endpoint separates a download from a view. Runs against the unified audit log, which is a server-side job:

1. `POST /security/auditLog/queries` with the date range, `operationFilters: ['FileDownloaded']`, `serviceFilters: ['SharePoint']`.
2. Poll every 5 s, up to 24 attempts (2 min). `failed`/`cancelled` → report it and suggest a shorter window; still running at the end → tell the user audit searches can take several minutes.
3. Page `/records?$top=999` up to `maxRecords` (default 5000), counting per `auditData.ObjectId` lowercased.

### `withDownloads(rows, downloads)`

Folds the counts onto the view rows, matching on lowercased file URL. Returns the rows untouched when no download data exists — which is what keeps the Downloads column hidden rather than showing zeros.

---

## 12. Cross-cutting conventions worth carrying over

1. **One retry wrapper, one gate.** Every request goes through `retryWhenThrottled`; every loop calls `control.checkpoint()`. Nothing else deals with throttling or cancellation.
2. **Bulk reads, cached maps, then per-item assembly.** Both features were rewritten this way after per-item lookups made large sites unscannable.
3. **Checkpoint after every pass, overwrite one file per run.** Resume is a list of completed step names, nothing more.
4. **Never let one item fail the run.** Catch, record, continue, surface the list at the end.
5. **Gate every UI update.** ~100 ms for progress, ~60 s for checkpoint writes.
6. **Strip live objects before storing.** DOM nodes and SharePoint item instances never reach state or a saved file.
7. **Degrade loudly.** When a source is unavailable, say which permission is missing and what to do — never render a silent zero.
8. **Filters and sorts as data.** `{key, title, children, onFilterItems}` and `{key, title, onSortItems}` let one toolbar drive views with different row shapes.
