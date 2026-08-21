import * as React from "react";
import { Card } from "@/components/layout/Card";
import { TextField } from "@/components/inputs/TextField";
import { TextArea } from "@/components/inputs/TextArea";
import { NumberField } from "@/components/inputs/NumberField";
import { Toggle } from "@/components/inputs/Toggle";
import { Dropdown } from "@/components/inputs/Dropdown";
import { Badge } from "@/components/feedback/Badge";
import { Theme } from "@/theme/Theme.api";
import { ConfigField } from "@/core/report/Report.types";
import { ReportConfigPanelProps } from "@/modules/shared/Shared.types";

export function ReportConfigPanel<TConfig>({
  title,
  definition,
  config,
  onChange,
  disabled,
  bare,
}: ReportConfigPanelProps<TConfig>): React.ReactElement {
  const values = config as unknown as Record<string, unknown>;
  const set = (key: string, value: unknown): void =>
    onChange({ ...values, [key]: value } as unknown as TConfig);

  const applies = definition.configFields.filter(
    (field: ConfigField<TConfig>) => !field.showWhen || field.showWhen(config)
  );

  const groups = applies.reduce<Record<string, ConfigField<TConfig>[]>>((all, field) => {
    const group = field.group ?? "";
    return { ...all, [group]: [...(all[group] ?? []), field] };
  }, {});

  // Scope first, then the names it needs, then how far it goes, then the rest.
  const ORDER = ["", "What to scan", "Columns and paths", "Limits", "Thresholds", "Options"];
  const ordered = Object.keys(groups).sort((first, second) => {
    const left = ORDER.indexOf(first);
    const right = ORDER.indexOf(second);
    return (left === -1 ? ORDER.length : left) - (right === -1 ? ORDER.length : right);
  });

  const row = (field: ConfigField<TConfig>): React.ReactElement => (
    <li
      key={field.key}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 220px)",
        alignItems: "center",
        gap: Theme.tokens.space.md,
        padding: `${Theme.tokens.space.md} 0`,
        borderBottom: `1px solid ${Theme.palette().border}`,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600 }}>{field.label}</div>
        {field.description && (
          <div style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted }}>
            {field.description}
          </div>
        )}
      </div>

      <div style={{ justifySelf: "end", width: "100%" }}>{control(field, values[field.key], set, disabled)}</div>
    </li>
  );

  const list = (
    <div style={{ display: "grid", gap: Theme.tokens.space.md }}>
      {ordered.map((group) => (
        <section key={group || "general"}>
          {group && (
            <h3
              style={{
                margin: `0 0 ${Theme.tokens.space.xs}`,
                fontSize: Theme.tokens.font.sm,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: Theme.palette().textMuted,
              }}
            >
              {group}
            </h3>
          )}

          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>{groups[group].map(row)}</ul>
        </section>
      ))}

      <p style={{ margin: 0, fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted }}>
        {definition.description}
      </p>
    </div>
  );

  if (bare) return list;

  return (
    <Card
      title={title}
      subtitle={definition.description}
      actions={<Badge label={`v${definition.version}`} tone="neutral" showIcon={false} />}
    >
      {list}
    </Card>
  );
}

function control<TConfig>(
  field: ConfigField<TConfig>,
  value: unknown,
  set: (key: string, value: unknown) => void,
  disabled?: boolean
): React.ReactNode {
  if (field.type === "toggle") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Toggle
          label=""
          checked={Boolean(value)}
          onChange={(next) => set(field.key, next)}
          disabled={disabled}
          onText="On"
          offText="Off"
          inlineLabel
        />
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <NumberField
        label=""
        value={Number(value ?? 0)}
        onChange={(next) => set(field.key, next)}
        min={field.min}
        max={field.max}
        step={field.step}
        disabled={disabled}
      />
    );
  }

  if (field.type === "choice") {
    return (
      <Dropdown
        label=""
        options={field.options ?? []}
        selectedKey={String(value ?? "")}
        onChange={(next) => set(field.key, next)}
        disabled={disabled}
      />
    );
  }

  if (field.multiline) {
    return (
      <TextArea
        label=""
        value={String(value ?? "")}
        onChange={(next) => set(field.key, next)}
        rows={3}
        disabled={disabled}
      />
    );
  }

  return (
    <TextField
      label=""
      value={String(value ?? "")}
      required={field.required}
      onChange={(next) => set(field.key, next)}
      disabled={disabled}
    />
  );
}
