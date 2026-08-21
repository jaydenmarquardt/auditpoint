# AuditPoint

Full-page SPFx web part hosting a suite of admin-only audit dashboards for a SharePoint site.
The shipped app is white-label: name, tagline, report location and sites in scope are web part settings.

- SPFx **1.23.0**, React 17, Fluent UI React v8, PnPjs v4
- pnpm only (`node-linker=hoisted`: SPFx's webpack rig needs a flat `node_modules`)
- Node 22.14+

## Commands

```bash
pnpm install
pnpm serve      # dev server against the site in config/serve.json
pnpm check      # tsc --noEmit + eslint: must pass before shipping
pnpm ship       # production build + sppkg into sharepoint/solution
```

Set your dev site in `config/serve.json` before `pnpm serve`, and run `pnpm trust-cert` once.

## Shape

```
src/
  api/         *.api.ts: the only place SharePoint is called, all through Throttle.api
  app/         shell: topbar, sidebar, floating queue bar, route registry, lazy route host
  components/  actions/ inputs/ layout/ feedback/ data/ charts/ states/: all UI lives here
  core/
    context/   React context over the web part context + PnP
    hooks/     useAsync, useFullscreen, useMediaQuery
    queue/     task queue: concurrency, pause, cancel, child progress
    report/    resumable staged report engine + controller hook
    state/     tiny observable store
  modules/     one folder per module (report definition + page)
  pages/       system pages: dashboard, component board, queue, reports, settings
  theme/       tokens + Theme.api
  utils/       pure helpers
  webparts/    SPFx entry point and property pane
```

## Access

The app is gated to site collection admins, members of an `… Owners` group, or holders of ManageWeb.
Everyone else gets the 401 state. See `src/api/Permissions.api.ts`.

## Reports

Saved as JSON to the library and folder set in the web part properties (default
`SiteAssets/Audit/Reports`), so they inherit site permissions and versioning. Runs are staged and
checkpointed: a run that fails or is paused can be resumed from its last completed stage, and every
401/403/429 hit during a scan is recorded on the report. See `src/api/Reports.api.ts` and
`src/core/report/`.

## Adding a module

Add a folder under `src/modules/`, declare a `ReportDefinition` with stages, register it in
`Modules.registry.ts`: routing, the queue runner, progress UI, resume and export come for free.

## Settings

Edited on the in-app Settings page and stored as JSON on the web part (`settingsJson`); the property
pane shows only that JSON. Saving needs the page in edit mode. Until the report library and folder are
set, modules stay locked. The Settings page also verifies and repairs the report folder and reports
whether the current user can view and edit it.

## Using AuditPoint in another solution

AuditPoint is consumable as a library: a host solution extends `AuditPointBaseWebPart`
and decides which modules and defaults it ships. See [INSTALL.md](INSTALL.md) for the
dependency, the web part, the `setup()` contract and the release process.

## Contributing

Read [AGENTS.md](AGENTS.md) first: it is the binding set of conventions, and the in-app
**Component board** is its live counterpart.
