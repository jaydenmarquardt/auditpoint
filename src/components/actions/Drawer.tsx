import * as React from "react";
import { Panel, PanelType } from "@fluentui/react/lib/Panel";
import { DrawerProps } from "@/components/Components.types";

const TYPES = {
  small: PanelType.smallFixedFar,
  medium: PanelType.medium,
  large: PanelType.large,
};

export const Drawer: React.FC<DrawerProps> = ({
  open,
  title,
  onDismiss,
  width = "medium",
  footer,
  children,
}) => (
  <Panel
    isOpen={open}
    headerText={title}
    onDismiss={onDismiss}
    type={TYPES[width]}
    closeButtonAriaLabel="Close panel"
    isFooterAtBottom
    onRenderFooterContent={footer ? () => <div>{footer}</div> : undefined}
  >
    {children}
  </Panel>
);
