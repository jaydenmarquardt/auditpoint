import * as React from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { SearchBox } from "../../components/inputs/SearchBox";
import { Tabs } from "../../components/data/Tabs";
import { Toolbar } from "../../components/layout/Toolbar";
import { Card } from "../../components/layout/Card";
import { EmptyState } from "../../components/states/Empty.state";
import { Tokens } from "../../theme/Tokens";
import { BoardContent } from "./ComponentBoard.content";
import { BoardSection } from "./BoardSection";
import { BOARD_GROUPS } from "./Board.sections";
function matches(section, term) {
    if (term.length === 0)
        return true;
    const haystack = `${section.name} ${section.summary}`.toLowerCase();
    return haystack.indexOf(term) !== -1;
}
const ComponentBoard = () => {
    const [search, setSearch] = React.useState("");
    const [tab, setTab] = React.useState(BOARD_GROUPS[0].key);
    const term = search.trim().toLowerCase();
    const items = BOARD_GROUPS.map((group) => {
        const sections = group.sections.filter((section) => matches(section, term));
        return {
            key: group.key,
            label: group.label,
            count: sections.length,
            content: sections.length === 0 ? (React.createElement(EmptyState, { title: BoardContent.noMatch.title, description: BoardContent.noMatch.description, iconName: "Filter", actionLabel: "Clear filter", onAction: () => setSearch("") })) : (React.createElement("div", { style: { display: "grid", gap: Tokens.space.md } }, sections.map((section) => (React.createElement(BoardSection, { key: section.name, name: section.name, summary: section.summary }, section.render()))))),
        };
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: BoardContent.title, description: BoardContent.description }),
        React.createElement(Card, { title: BoardContent.rulesTitle },
            React.createElement("ol", { style: { margin: 0, paddingLeft: Tokens.space.lg, display: "grid", gap: Tokens.space.xs } }, BoardContent.rules.map((rule) => (React.createElement("li", { key: rule }, rule))))),
        React.createElement("div", { style: { marginTop: Tokens.space.lg } },
            React.createElement(Toolbar, { ariaLabel: "Component board filters" },
                React.createElement(SearchBox, { label: BoardContent.search, value: search, onChange: setSearch })),
            React.createElement(Tabs, { ariaLabel: "Component groups", items: items, selectedKey: tab, onChange: setTab }))));
};
export default ComponentBoard;
//# sourceMappingURL=ComponentBoard.page.js.map