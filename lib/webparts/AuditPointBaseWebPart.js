import { __awaiter } from "tslib";
import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { PropertyPaneCheckbox, PropertyPaneTextField, } from "@microsoft/sp-property-pane";
import App from "../app/App";
import { setupSp } from "../api/Sp.api";
import { initSettings, registerSettingsWriter } from "../api/Settings.api";
import { appStore } from "../core/state/App.store";
import { MODULES, setHostModules } from "../modules/Modules.registry";
import { APP_VERSION } from "../version";
/** Per module switch, stored as `module_<key>` so the property pane can bind to it. */
export function modulePropertyKey(key) {
    return `module_${key.replace(/[^a-z0-9]+/gi, "_")}`;
}
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
export class AuditPointBaseWebPart extends BaseClientSideWebPart {
    /** Modules this host offers at all. Undefined offers every registered module. */
    get modules() {
        return undefined;
    }
    /** Shown at the top of the property pane, above the settings JSON. */
    get propertyPaneDescription() {
        return `AuditPoint ${APP_VERSION}. Settings are edited inside the app; this is the raw JSON.`;
    }
    onInit() {
        const _super = Object.create(null, {
            onInit: { get: () => super.onInit }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.configure();
            yield _super.onInit.call(this);
        });
    }
    render() {
        ReactDom.render(React.createElement(App, { context: this.context, displayMode: this.displayMode }), this.domElement);
    }
    onPropertyPaneFieldChanged() {
        this.configure();
        this.render();
    }
    onDispose() {
        registerSettingsWriter(undefined);
        ReactDom.unmountComponentAtNode(this.domElement);
    }
    get dataVersion() {
        return Version.parse(APP_VERSION);
    }
    getPropertyPaneConfiguration() {
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
    moduleFields() {
        return this.offered().map((module) => PropertyPaneCheckbox(modulePropertyKey(module.key), {
            text: module.label,
            checked: this.moduleEnabled(module.key),
        }));
    }
    offered() {
        const allowed = this.modules;
        return MODULES.filter((module) => !allowed || allowed.indexOf(module.key) !== -1).map((module) => ({
            key: module.key,
            label: module.label,
        }));
    }
    /** A module is on unless this web part's own property says otherwise. */
    moduleEnabled(key) {
        const value = this.properties[modulePropertyKey(key)];
        return value === undefined ? true : value !== false;
    }
    /**
     * Wires PnP, the module allow list and settings. Runs before the first render and
     * again on every property pane change, so a module can be switched off live.
     */
    configure() {
        setupSp(this.context);
        setHostModules(this.offered().filter((module) => this.moduleEnabled(module.key)).map((module) => module.key));
        // The app edits its own settings, so it writes back onto this web part.
        registerSettingsWriter((json) => {
            this.properties.settingsJson = json;
            this.context.propertyPane.refresh();
        });
        const settings = initSettings(this.properties.settingsJson, {
            url: this.context.pageContext.web.absoluteUrl,
            title: this.context.pageContext.web.title,
        });
        appStore.setState((state) => (Object.assign(Object.assign({}, state), { route: settings.defaultRoute || state.route })));
    }
}
export default AuditPointBaseWebPart;
//# sourceMappingURL=AuditPointBaseWebPart.js.map