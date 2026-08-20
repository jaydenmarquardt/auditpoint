import * as React from "react";
import { TableColumn } from "../../components/Components.types";
import { BrokenState, LinkSource, LinkType } from "../../api/Links.types";
import { AggregatedLink, LinkUsage, OutgoingLink, Reference, ReferenceSummary } from "./LinkAudit.types";
export declare const TypeTag: React.FC<{
    type: LinkType;
}>;
export declare const StatusTag: React.FC<{
    broken: BrokenState;
    status?: number;
    matched?: string;
}>;
/** The source and its label together, so an editor knows which control to open. */
export declare const SourceTag: React.FC<{
    source: LinkSource;
    label?: string;
}>;
/** A long url pushes every other column off the table, so it is boxed and wrapped. */
export declare const UrlCell: React.FC<{
    url: string;
    text?: string;
}>;
export declare const referenceColumns: TableColumn<Reference>[];
export declare const linkColumns: TableColumn<AggregatedLink>[];
/** One row per place a link is written: the broken tab and the link dialog share it. */
/** Where a link was written, with a way to go straight there. */
export declare const usageColumns: TableColumn<LinkUsage>[];
/** The untested view adds the one column that view exists to answer. */
export declare function untestedColumns(checked: boolean): TableColumn<LinkUsage>[];
export declare const outgoingColumns: TableColumn<OutgoingLink>[];
export declare const incomingColumns: TableColumn<ReferenceSummary>[];
//# sourceMappingURL=LinkAudit.columns.d.ts.map