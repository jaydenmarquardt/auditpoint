import * as React from "react";
import { Pivot, PivotItem } from "@fluentui/react/lib/Pivot";
import { Theme } from "@/theme/Theme.api";
import { TabsProps } from "@/components/Components.types";

export const Tabs: React.FC<TabsProps> = ({ items, selectedKey, onChange, ariaLabel }) => (
  <div style={{ minWidth: 0 }}>
    <Pivot
      aria-label={ariaLabel}
      selectedKey={selectedKey}
      onLinkClick={(item) => {
        if (item?.props.itemKey && onChange) onChange(item.props.itemKey);
      }}
      overflowBehavior="menu"
      styles={{
        root: {
          display: "flex",
          gap: 4,
          padding: 4,
          background: Theme.palette().surfaceAlt,
          border: `1px solid ${Theme.palette().border}`,
          borderRadius: Theme.tokens.radius.md,
          overflowX: "auto",
        },
        link: {
          height: 36,
          lineHeight: "36px",
          padding: `0 ${Theme.tokens.space.md}`,
          borderRadius: Theme.tokens.radius.sm,
          color: Theme.palette().textMuted,
          selectors: {
            ":hover": { background: Theme.palette().surface, color: Theme.palette().text },
            "::before": { display: "none" },
          },
        },
        linkIsSelected: {
          background: Theme.palette().surface,
          color: Theme.palette().accent,
          fontWeight: 600,
          border: `1px solid ${Theme.palette().border}`,
          boxShadow: Theme.tokens.shadow.sm,
          selectors: {
            "::before": {
              display: "block",
              height: 3,
              bottom: 2,
              left: 12,
              right: 12,
              borderRadius: 3,
              background: Theme.palette().accent,
            },
          },
        },
        count: { color: "inherit" },
      }}
    >
      {items.map((item) => (
        <PivotItem
          key={item.key}
          itemKey={item.key}
          headerText={item.label}
          itemIcon={item.iconName}
          itemCount={item.count}
        >
          <div style={{ paddingTop: Theme.tokens.space.lg, minWidth: 0 }}>{item.content}</div>
        </PivotItem>
      ))}
    </Pivot>
  </div>
);
