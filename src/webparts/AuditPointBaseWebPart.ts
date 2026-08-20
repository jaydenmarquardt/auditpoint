import * as React from "react";
import * as ReactDom from "react-dom";
import { DisplayMode, Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  IPropertyPaneField,
  PropertyPaneCheckbox,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import App from "@/app/App";
import { setupSp } from "@/api/Sp.api";
import { initSettings, registerSettingsWriter } from "@/api/Settings.api";
import { appStore } from "@/core/state/App.store";
import { MODULES, setHostModules } from "@/modules/Modules.registry";
import { setReportDefaults } from "@/core/report/Report.store";
import { SettingsFile } from "@/api/Settings.types";
import { APP_VERSION } from "@/version";

export interface IAuditPointWebPartProps {
  /** The whole app configuration, edited in the app and written back here. */
  settingsJson: string;
}

/** Everything a host can decide, returned from one `setup()` in the host web part. */
export interface AuditPointSetup {
  /** Module keys this host offers at all. Omit to offer every module. */
  modules?: string[];
  /** Offered but switched off until someone turns them on for the site. */
  disabledModules?: string[];
  /** Fills in anything the stored settings do not say: name, report location, sites. */
  settings?: Partial<SettingsFile>;
  /** Starting config per report kind, merged over that report's own defaults. */
  reportDefaults?: Record<string, Record<string, unknown>>;
}

/** Per module switch, stored as `module_<key>` so the property pane can bind to it. */
export function modulePropertyKey(key: string): string {
  return `module_${key.replace(/[^a-z0-9]+/gi, "_")}`;
}

/**
 * Everything a host needs to run AuditPoint. A consuming solution declares its own
 * manifest and extends this, overriding `modules` to narrow what it offers:
 *
 * ```ts
 * export default class SiteAuditWebPart extends AuditPointBaseWebPart {
 *   protected async setup(): Promise<AuditPointSetup> {
 *     return {
 *       modules: ["lists-audit", "link-audit"],
 *       settings: { appName: "Site audit", reportLibrary: "SiteAssets" },
 *       reportDefaults: { "link-audit": { checkBrokenLinks: true } },
 *     };
 *   }
 * }
 * ```
 */
export abstract class AuditPointBaseWebPart<
  TProps extends IAuditPointWebPartProps = IAuditPointWebPartProps,
> extends BaseClientSideWebPart<TProps> {
  private host: AuditPointSetup = {};

  /**
   * The one thing a host overrides. Runs once before the first render, so it can
   * read a config file or the page context before deciding.
   */
  protected async setup(): Promise<AuditPointSetup> {
    return {};
  }

  /** Shown at the top of the property pane, above the settings JSON. */
  protected get propertyPaneDescription(): string {
    return `AuditPoint ${APP_VERSION}. Settings are edited inside the app; this is the raw JSON.`;
  }

  protected async onInit(): Promise<void> {
    this.host = (await this.setup()) ?? {};
    this.configure();
    await super.onInit();
  }

  public render(): void {
    ReactDom.render(
      React.createElement(App, { context: this.context, displayMode: this.displayMode as DisplayMode }),
      this.domElement
    );
  }

  protected onPropertyPaneFieldChanged(): void {
    this.configure();
    this.render();
  }

  protected onDispose(): void {
    registerSettingsWriter(undefined);
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse(APP_VERSION);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: this.propertyPaneDescription },
          groups: [
            {
              groupName: "Modules",
              groupFields: this.moduleFields(),
            },
            {
              groupName: "Settings JSON",
              groupFields: [
                PropertyPaneTextField("settingsJson", {
                  label: "Settings",
                  multiline: true,
                  rows: 12,
                }),
              ],
            },
          ],
        },
      ],
    };
  }

  /** One checkbox per module the host offers, defaulting to on. */
  private moduleFields(): IPropertyPaneField<unknown>[] {
    return this.offered().map((module) =>
      PropertyPaneCheckbox(modulePropertyKey(module.key), {
        text: module.label,
        checked: this.moduleEnabled(module.key),
      })
    ) as IPropertyPaneField<unknown>[];
  }

  private offered(): { key: string; label: string }[] {
    const allowed = this.host.modules;
    return MODULES.filter((module) => !allowed || allowed.indexOf(module.key) !== -1).map((module) => ({
      key: module.key,
      label: module.label,
    }));
  }

  /** A module is on unless this web part's own property says otherwise. */
  private moduleEnabled(key: string): boolean {
    const value = (this.properties as unknown as Record<string, unknown>)[modulePropertyKey(key)];
    return value === undefined ? true : value !== false;
  }

  /**
   * Wires PnP, the module allow list and settings. Runs before the first render and
   * again on every property pane change, so a module can be switched off live.
   */
  private configure(): void {
    setupSp(this.context);
    setHostModules(this.offered().filter((module) => this.moduleEnabled(module.key)).map((module) => module.key));
    setReportDefaults(this.host.reportDefaults);

    // The app edits its own settings, so it writes back onto this web part.
    registerSettingsWriter((json: string) => {
      this.properties.settingsJson = json;
      this.context.propertyPane.refresh();
    });

    const settings = initSettings(
      this.properties.settingsJson,
      { url: this.context.pageContext.web.absoluteUrl, title: this.context.pageContext.web.title },
      { ...this.host.settings, disabledModules: this.host.settings?.disabledModules ?? this.host.disabledModules }
    );

    appStore.setState((state) => ({ ...state, route: settings.defaultRoute || state.route }));
  }
}

export default AuditPointBaseWebPart;
