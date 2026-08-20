import * as React from "react";
export interface BoardSectionProps {
    name: string;
    summary: string;
    children: React.ReactNode;
}
export interface BoardSectionSpec {
    name: string;
    summary: string;
    render: () => React.ReactNode;
}
export interface BoardGroup {
    key: string;
    label: string;
    sections: BoardSectionSpec[];
}
//# sourceMappingURL=Board.types.d.ts.map