import * as React from "react";
import { TableColumn } from "../../components/Components.types";
import { PublishingPerson } from "./PublishingAudit.types";
export declare const peopleColumns: TableColumn<PublishingPerson>[];
export declare const PeopleTab: React.FC<{
    people: PublishingPerson[];
    onSelect: (person: PublishingPerson) => void;
}>;
//# sourceMappingURL=People.tab.d.ts.map