import * as React from "react";
import { IconButton as FluentIconButton } from "@fluentui/react/lib/Button";
import { TooltipHost } from "@fluentui/react/lib/Tooltip";
import { Tokens } from "@/theme/Tokens";
import { IconButtonProps } from "@/components/Components.types";

export const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  ariaLabel,
  onClick,
  disabled,
  toggled,
  tooltip,
}) => {
  const button = (
    <FluentIconButton
      iconProps={{ iconName }}
      ariaLabel={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      checked={toggled}
      aria-pressed={toggled === undefined ? undefined : toggled}
      styles={{
        root: {
          width: Tokens.hitTarget,
          height: Tokens.hitTarget,
          borderRadius: Tokens.radius.sm,
          color: Tokens.colour.text,
        },
        rootHovered: { background: Tokens.colour.accentSoft },
        rootChecked: { background: Tokens.colour.accentSoft, color: Tokens.colour.accent },
      }}
    />
  );

  return tooltip ? <TooltipHost content={tooltip}>{button}</TooltipHost> : button;
};
