import * as React from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Tabs } from "../../components/data/Tabs";
import { Badge } from "../../components/feedback/Badge";
import { Theme } from "../../theme/Theme.api";
import { useReport } from "../../core/report/useReport";
import { ReportRunPanel } from "../shared/ReportRunPanel";
import { ReportConfigPanel } from "../shared/ReportConfigPanel";
import { ReportHistory } from "../shared/ReportHistory";
import { findModule } from "../Modules.registry";
import { statTiles } from "./PublishingAudit.stats";
import { ComparisonBar } from "../shared/ComparisonBar";
import { publishingAuditReport } from "./PublishingAudit.report";
import { PublishingAuditContent } from "./PublishingAudit.content";
import { buildView } from "./PublishingAudit.logic";
import { exportPublishingAudit } from "./PublishingAudit.csv";
import { reviewColumns } from "./PublishingAudit.columns";
import { OverviewTab } from "./tabs/Overview.tab";
import { ItemsTab } from "./tabs/Items.tab";
import { PeopleTab } from "./People.tab";
import { PersonDialog } from "./Person.dialog";
import { ItemDialog } from "./Item.dialog";
const PublishingAuditPage = () => {
    var _a, _b, _c, _d, _e, _f;
    const controller = useReport(publishingAuditReport);
    const [tab, setTab] = React.useState("overview");
    const [configOpen, setConfigOpen] = React.useState(false);
    const [person, setPerson] = React.useState(undefined);
    const [selected, setSelected] = React.useState(undefined);
    const module = findModule("publishing-audit");
    const data = (_a = controller.envelope) === null || _a === void 0 ? void 0 : _a.data;
    const updatedIso = (_b = controller.envelope) === null || _b === void 0 ? void 0 : _b.updatedIso;
    const config = (_d = (_c = controller.envelope) === null || _c === void 0 ? void 0 : _c.config) !== null && _d !== void 0 ? _d : controller.config;
    // Stages mutate data in place, so the envelope timestamp is what changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const view = React.useMemo(() => buildView(data, config), [data, config, updatedIso]);
    const [previousData, setPreviousData] = React.useState(undefined);
    // The earlier run is rebuilt through the same view, so every tile compares like for like.
    const previousTiles = React.useMemo(() => {
        if (!previousData)
            return undefined;
        const previousView = buildView(previousData, config);
        return statTiles(previousView, config);
    }, [previousData, config]);
    const items = (_e = data === null || data === void 0 ? void 0 : data.items) !== null && _e !== void 0 ? _e : [];
    const hasData = items.length > 0;
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: PublishingAuditContent.title, description: PublishingAuditContent.description, actions: module ? (React.createElement(Badge, { label: `${PublishingAuditContent.moduleVersion} ${module.version}`, tone: "neutral", showIcon: false })) : undefined }),
        !controller.envelope && !controller.running && (React.createElement(ReportHistory, { kind: publishingAuditReport.kind, title: PublishingAuditContent.historyTitle, newLabel: PublishingAuditContent.run, busy: controller.running, onNew: () => setConfigOpen(true), onOpen: (url) => void controller.open(url), onResume: (url) => void controller.resumeSaved(url), onImport: (file) => void controller.importJson(file), error: controller.error, onDismissError: controller.clearError })),
        React.createElement(ReportRunPanel, { title: publishingAuditReport.title, controller: controller, definition: publishingAuditReport, onBack: controller.envelope ? controller.clear : undefined, backLabel: PublishingAuditContent.backToRuns, configOpen: configOpen, onConfigOpenChange: setConfigOpen, configPanel: React.createElement(ReportConfigPanel, { bare: true, title: PublishingAuditContent.configTitle, definition: publishingAuditReport, config: controller.config, onChange: controller.setConfig }), menuItems: hasData
                ? [
                    { key: "csv", label: PublishingAuditContent.exportCsv, iconName: "ExcelDocument", onClick: () => exportPublishingAudit(data) },
                ]
                : [], runLabel: {
                run: PublishingAuditContent.run,
                rerun: PublishingAuditContent.rerun,
                pause: PublishingAuditContent.pause,
                resume: PublishingAuditContent.resume,
                cancel: PublishingAuditContent.cancel,
                configTitle: PublishingAuditContent.configTitle,
            } }),
        (controller.envelope || controller.running) && (React.createElement("div", { style: { marginTop: Theme.tokens.space.lg, minWidth: 0 } },
            React.createElement(Tabs, { ariaLabel: PublishingAuditContent.title, selectedKey: tab, onChange: setTab, items: [
                    {
                        key: "overview",
                        label: PublishingAuditContent.tabs.overview,
                        content: (React.createElement(OverviewTab, { view: view, config: config, hasData: hasData, onRun: () => setConfigOpen(true), previousTiles: previousTiles, comparison: hasData ? (React.createElement(ComparisonBar, { kind: publishingAuditReport.kind, currentId: (_f = controller.envelope) === null || _f === void 0 ? void 0 : _f.id, onChange: (next) => setPreviousData(next) })) : undefined })),
                    },
                    {
                        key: "items",
                        label: PublishingAuditContent.tabs.items,
                        count: items.length,
                        content: React.createElement(ItemsTab, { items: items, onSelect: setSelected }),
                    },
                    {
                        key: "people",
                        label: PublishingAuditContent.tabs.people,
                        count: view.people.length,
                        content: React.createElement(PeopleTab, { people: view.people, onSelect: setPerson }),
                    },
                    {
                        key: "unpublished",
                        label: PublishingAuditContent.tabs.unpublished,
                        count: view.unpublishedItems.length,
                        content: (React.createElement(ItemsTab, { items: view.unpublishedItems, emptyTitle: PublishingAuditContent.unpublishedTab, emptyDescription: PublishingAuditContent.unpublishedEmpty, onSelect: setSelected })),
                    },
                    {
                        key: "review",
                        label: PublishingAuditContent.tabs.review,
                        count: view.reviewItems.length,
                        content: (React.createElement(ItemsTab, { items: view.reviewItems, columns: reviewColumns, emptyTitle: PublishingAuditContent.noReview.title, emptyDescription: PublishingAuditContent.noReview.description, onSelect: setSelected })),
                    },
                    {
                        key: "stale",
                        label: PublishingAuditContent.tabs.stale,
                        count: view.staleItems.length,
                        content: (React.createElement(ItemsTab, { items: view.staleItems, emptyTitle: PublishingAuditContent.noStale.title, emptyDescription: PublishingAuditContent.noStale.description, onSelect: setSelected })),
                    },
                ] }))),
        React.createElement(PersonDialog, { person: person, onDismiss: () => setPerson(undefined), onSelectItem: (item) => {
                setPerson(undefined);
                setSelected(item);
            } }),
        React.createElement(ItemDialog, { item: selected, versionDepth: config.versionDepth, onLoaded: (item, count, editors) => {
                item.versionCount = count;
                item.versionEditors = editors;
                setSelected(Object.assign({}, item));
            }, onDismiss: () => setSelected(undefined) })));
};
export default PublishingAuditPage;
//# sourceMappingURL=PublishingAudit.page.js.map