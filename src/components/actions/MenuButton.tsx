import * as React from "react";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { IContextualMenuItem } from "@fluentui/react/lib/ContextualMenu";
import { Tokens } from "@/theme/Tokens";
import { MenuButtonProps } from "@/components/Components.types";

/** Secondary actions folded behind one control, so a toolbar stays readable. */
export const MenuButton: React.FC<MenuButtonProps> = ({ label, iconName = "More", items, disabled }) => (
  <DefaultButton
    text={label}
    iconProps={{ iconName }}
    disabled={disabled}
    menuProps={{
      items: items.map(
        (item): IContextualMenuItem => ({
          key: item.key,
          text: item.label,
          iconProps: item.iconName ? { iconName: item.iconName } : undefined,
          disabled: item.disabled,
          onClick: () => item.onClick(),
        })
      ),
    }}
    styles={{ root: { minHeight: Tokens.hitTarget, borderRadius: Tokens.radius.sm } }}
  />
);
