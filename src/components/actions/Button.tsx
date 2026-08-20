import * as React from "react";
import { DefaultButton, PrimaryButton, IButtonProps } from "@fluentui/react/lib/Button";
import { Tokens } from "@/theme/Tokens";
import { ButtonProps } from "@/components/Components.types";



export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = "default",
  iconName,
  disabled,
  busy,
  ariaLabel,
  type = "button",
  href,
  newTab,
  title,
}) => {
  const shared: IButtonProps = {
    text: label,
    onClick,
    iconProps: iconName ? { iconName } : undefined,
    disabled: disabled || busy,
    ariaLabel: ariaLabel ?? label,
    title: title ?? ariaLabel ?? label,
    href,
    target: href && newTab ? "_blank" : undefined,
    rel: href && newTab ? "noopener noreferrer" : undefined,
    type,
    styles: {
      root: {
        minHeight: Tokens.hitTarget,
        borderRadius: Tokens.radius.sm,
        paddingInline: Tokens.space.md,
      },
    },
  };

  if (variant === "primary") return <PrimaryButton {...shared} />;

  if (variant === "danger") {
    return (
      <PrimaryButton
        {...shared}
        styles={{
          root: {
            ...(shared.styles as { root: object }).root,
            backgroundColor: Tokens.colour.danger,
            borderColor: Tokens.colour.danger,
          },
          rootHovered: { backgroundColor: "#8e1e18", borderColor: "#8e1e18" },
        }}
      />
    );
  }

  if (variant === "subtle") {
    return (
      <DefaultButton
        {...shared}
        styles={{
          root: {
            ...(shared.styles as { root: object }).root,
            border: "none",
            background: "transparent",
          },
          rootHovered: { background: Tokens.colour.accentSoft },
        }}
      />
    );
  }

  return <DefaultButton {...shared} />;
};
