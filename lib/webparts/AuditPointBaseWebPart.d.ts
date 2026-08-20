import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
import { SettingsFile } from "../api/Settings.types";
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
    /** The component board is a development aid, so a host ships it deliberately. */
    componentBoard?: boolean;
}
/** Per module switch, stored as `module_<key>` so the property pane can bind to it. */
export declare function modulePropertyKey(key: string): string;
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
export declare abstract class AuditPointBaseWebPart<TProps extends IAuditPointWebPartProps = IAuditPointWebPartProps> extends BaseClientSideWebPart<TProps> {
    private host;
    /**
     * The one thing a host overrides. Runs once before the first render, so it can
     * read a config file or the page context before deciding.
     */
    protected setup(): Promise<AuditPointSetup>;
    /** Shown at the top of the property pane, above the settings JSON. */
    protected get propertyPaneDescription(): string;
    protected onInit(): Promise<void>;
    render(): void;
    protected onPropertyPaneFieldChanged(): void;
    protected onDispose(): void;
    protected get dataVersion(): Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    /** One checkbox per module the host offers, defaulting to on. */
    private moduleFields;
    private offered;
    /** A module is on unless this web part's own property says otherwise. */
    private moduleEnabled;
    /**
     * Wires PnP, the module allow list and settings. Runs before the first render and
     * again on every property pane change, so a module can be switched off live.
     */
    private configure;
}
export default AuditPointBaseWebPart;
//# sourceMappingURL=AuditPointBaseWebPart.d.ts.map