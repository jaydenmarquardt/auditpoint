import * as React from "react";
import { Drawer } from "@/components/actions/Drawer";
import { Button } from "@/components/actions/Button";
import { Badge } from "@/components/feedback/Badge";
import { Theme } from "@/theme/Theme.api";
import { ErrorDrawerProps } from "@/components/Components.types";

export const ErrorDrawer: React.FC<ErrorDrawerProps> = ({
  open,
  title,
  message,
  context,
  onDismiss,
  onRetry,
  retryLabel = "Retry",
}) => {
  const [copied, setCopied] = React.useState(false);
  const payload = `${title}\n${message}\n${(context ?? []).map((row) => `${row.label}: ${row.value}`).join("\n")}`;

  return (
    <Drawer
      open={open}
      title={title}
      onDismiss={onDismiss}
      footer={
        <div style={{ display: "flex", gap: Theme.tokens.space.sm }}>
          {onRetry && <Button label={retryLabel} variant="primary" iconName="Refresh" onClick={onRetry} />}
          <Button
            label={copied ? "Copied" : "Copy detail"}
            iconName="Copy"
            onClick={() => {
              void navigator.clipboard.writeText(payload);
              setCopied(true);
            }}
          />
        </div>
      }
    >
      <div style={{ display: "grid", gap: Theme.tokens.space.md }}>
        <Badge label="Failed" tone="danger" />

        <pre
          style={{
            margin: 0,
            padding: Theme.tokens.space.md,
            background: Theme.tone("danger").bg,
            border: `1px solid ${Theme.tone("danger").border}`,
            borderRadius: Theme.tokens.radius.sm,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: Theme.tokens.font.sm,
          }}
        >
          {message}
        </pre>

        {context && context.length > 0 && (
          <dl style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: Theme.tokens.space.xs, margin: 0 }}>
            {context.map((row) => (
              <React.Fragment key={row.label}>
                <dt style={{ color: Theme.palette().textMuted }}>{row.label}</dt>
                <dd style={{ margin: 0, wordBreak: "break-word" }}>{row.value}</dd>
              </React.Fragment>
            ))}
          </dl>
        )}
      </div>
    </Drawer>
  );
};
