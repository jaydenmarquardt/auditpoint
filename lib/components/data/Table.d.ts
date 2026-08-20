import * as React from "react";
import { TableProps } from "../Components.types";
/**
 * Fixed columns in an own-scroll wrapper, rendered a page at a time. Justified
 * layout and virtualisation both misbehave inside nested scroll containers.
 */
export declare function Table<TRow>({ ariaLabel, columns, rows, getRowKey, onRowClick, compact, initialSortKey, initialSortDescending, hideFilters, emptyLabel, searchValue, searchLabel, maxHeight, fill, extraFilters, }: TableProps<TRow>): React.ReactElement;
//# sourceMappingURL=Table.d.ts.map