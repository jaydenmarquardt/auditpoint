import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBox } from "@/components/inputs/SearchBox";
import { Tabs } from "@/components/data/Tabs";
import { Toolbar } from "@/components/layout/Toolbar";
import { Card } from "@/components/layout/Card";
import { EmptyState } from "@/components/states/Empty.state";
import { Tokens } from "@/theme/Tokens";
import { BoardContent } from "@/pages/componentBoard/ComponentBoard.content";
import { BoardSection } from "@/pages/componentBoard/BoardSection";
import { BOARD_GROUPS } from "@/pages/componentBoard/Board.sections";
import { BoardSectionSpec } from "@/pages/componentBoard/Board.types";

function matches(section: BoardSectionSpec, term: string): boolean {
  if (term.length === 0) return true;
  const haystack = `${section.name} ${section.summary}`.toLowerCase();
  return haystack.indexOf(term) !== -1;
}

const ComponentBoard: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const [tab, setTab] = React.useState(BOARD_GROUPS[0].key);
  const term = search.trim().toLowerCase();

  const items = BOARD_GROUPS.map((group) => {
    const sections = group.sections.filter((section) => matches(section, term));

    return {
      key: group.key,
      label: group.label,
      count: sections.length,
      content:
        sections.length === 0 ? (
          <EmptyState
            title={BoardContent.noMatch.title}
            description={BoardContent.noMatch.description}
            iconName="Filter"
            actionLabel="Clear filter"
            onAction={() => setSearch("")}
          />
        ) : (
          <div style={{ display: "grid", gap: Tokens.space.md }}>
            {sections.map((section) => (
              <BoardSection key={section.name} name={section.name} summary={section.summary}>
                {section.render()}
              </BoardSection>
            ))}
          </div>
        ),
    };
  });

  return (
    <>
      <PageHeader title={BoardContent.title} description={BoardContent.description} />

      <Card title={BoardContent.rulesTitle}>
        <ol style={{ margin: 0, paddingLeft: Tokens.space.lg, display: "grid", gap: Tokens.space.xs }}>
          {BoardContent.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
      </Card>

      <div style={{ marginTop: Tokens.space.lg }}>
        <Toolbar ariaLabel="Component board filters">
          <SearchBox label={BoardContent.search} value={search} onChange={setSearch} />
        </Toolbar>

        <Tabs ariaLabel="Component groups" items={items} selectedKey={tab} onChange={setTab} />
      </div>
    </>
  );
};

export default ComponentBoard;
