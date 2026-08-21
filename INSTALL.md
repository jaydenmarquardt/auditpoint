# Adding AuditPoint to a SharePoint solution

AuditPoint ships as a library. A host solution declares its own web part, extends
`AuditPointBaseWebPart`, and decides what the app offers. Nothing else is required:
routing, reports, settings and the module suite come with the package.

## 1. Add the dependency

`lib` is committed on every release branch, so an install never runs a build:

```jsonc
// package.json
"dependencies": {
  "auditpoint": "github:jaydenmarquardt/auditpoint#v0.18.0"
}
```

Use `#main` to track the tip, or a `v<version>` branch to pin. Then `pnpm install`.

The SharePoint framework packages and React are **peer dependencies**, so the host's
copies are used rather than a second set. AuditPoint builds against SPFx 1.23 and runs
against 1.22 or later.

## 2. Declare a web part

`src/webparts/siteAudit/SiteAuditWebPart.manifest.json` is an ordinary manifest, with
`"supportsFullBleed": true` and one property:

```jsonc
"preconfiguredEntries": [
  {
    "title": { "default": "Site audit" },
    "officeFabricIconFontName": "ComplianceAudit",
    "properties": { "settingsJson": "" }
  }
]
```

## 3. Extend the base web part

Everything the host decides lives in one `setup()`:

```ts
import { AuditPointBaseWebPart, AuditPointSetup } from "auditpoint";

export default class SiteAuditWebPart extends AuditPointBaseWebPart {
  protected async setup(): Promise<AuditPointSetup> {
    return {
      // Omit to offer every module.
      modules: ["lists-audit", "link-audit", "content-audit"],
      // Offered, but off until someone turns them on for the site.
      disabledModules: [],
      // The component board is a development aid, so it ships deliberately.
      componentBoard: false,

      // Defaults only: all of this stays editable on the Settings page.
      settings: {
        appName: "Site audit",
        reportLibrary: "SiteAssets",
        reportFolder: "Audit/Reports",
        legacyUrls: ["oldintranet.example.com"],
        fields: {
          publishDate: "ArticleStartDate",
          reviewDate: "ReviewDate",
          expiryDate: "ExpiryDate",
          htmlFields: ["Body", "Description"],
        },
      },

      // Starting config per report, merged over each report's own defaults.
      reportDefaults: {
        "link-audit": { checkBrokenLinks: true, scanAttachments: true },
      },
    };
  }
}
```

Settings precedence, weakest first: the report's defaults, then `setup()`, then the
site's Settings page, then whatever the person running it saved with **Save as default**.

## 4. Register the bundle

```jsonc
// config/config.json
"bundles": {
  "site-audit": {
    "components": [
      {
        "entrypoint": "./lib/webparts/siteAudit/SiteAuditWebPart.js",
        "manifest": "./src/webparts/siteAudit/SiteAuditWebPart.manifest.json"
      }
    ]
  }
}
```

Then build and package as usual. Add the web part to a full width section on a page;
it gates itself to site collection admins, owners and holders of ManageWeb.

## Releasing a new version

In the AuditPoint repo:

```bash
pnpm check          # tsc and eslint
pnpm release        # builds, cuts a v<version> branch with lib, pushes it
```

`lib` is committed deliberately: pnpm 10 refuses to run a git dependency's build
scripts unless every consumer allowlists the package, so a consumable branch has to
carry its own output. Run `pnpm build` before pushing any change, or consumers get
stale code.
