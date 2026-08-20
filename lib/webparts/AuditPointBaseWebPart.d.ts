import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
export interface IAuditPointWebPartProps {
    /** The whole app configuration, edited in the app and written back here. */
    settingsJson: string;
}
/** Per module switch, stored as `module_<key>` so the property pane can bind to it. */
export declare function modulePropertyKey(key: string): string;
/**
 * Everything a host needs to run AuditPoint. A consuming solution declares its own
 * manifest and extends this, overriding `modules` to narrow what it offers:
 *
 * ```ts
 * export default class SiteAuditWebPart extends AuditPointBaseWebPart {
 *   protected get modules(): string[] { return ["lists-audit", "link-audit"]; }
 * }
 * ```
 */
export declare abstract class AuditPointBaseWebPart<TProps extends IAuditPointWebPartProps = IAuditPointWebPartProps> extends BaseClientSideWebPart<TProps> {
    /** Modules this host offers at all. Undefined offers every registered module. */
    protected get modules(): string[] | undefined;
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