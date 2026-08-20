import * as React from "react";
import { SearchFormState } from "./SearchTool.types";
export interface QueryBuilderProps {
    form: SearchFormState;
    onChange: (form: SearchFormState) => void;
    onRun: () => void;
    busy: boolean;
}
export declare const QueryBuilder: React.FC<QueryBuilderProps>;
//# sourceMappingURL=Query.builder.d.ts.map