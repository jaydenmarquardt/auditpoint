import * as React from "react";
import { PreviewDialog } from "@/components/actions/PreviewDialog";
import { Button } from "@/components/actions/Button";
import { Badge } from "@/components/feedback/Badge";
import { Theme } from "@/theme/Theme.api";
import { WebPartInstance } from "@/api/WebParts.types";
import { WebPartPageSummary } from "@/modules/webPartAudit/WebPartAudit.types";
import { WebPartAuditContent } from "@/modules/webPartAudit/WebPartAudit.content";
import { formatDate, formatNumber } from "@/utils/Format.util";
import { absoluteFromServerRelative } from "@/utils/Url.util";

export interface PageDialogProps {
  page?: WebPartPageSummary;
  instances: WebPartInstance[];
  onDismiss: () => void;
}

export const PageDialog: React.FC<PageDialogProps> = ({ page, instances, onDismiss }) => {
  const [openInstance, setOpenInstance] = React.useState<string | undefined>(undefined);
  if (!page) return null;

  const onPage = instances
    .filter((instance) => instance.pageId === page.pageId && instance.siteUrl === page.siteUrl)
    .sort((a, b) => a.layer - b.layer || a.section - b.section || a.column - b.column);

  const sections = new Map<number, WebPartInstance[]>();
  onPage.forEach((instance) => sections.set(instance.section, [...(sections.get(instance.section) ?? []), instance]));

  return (
    <PreviewDialog
      open={Boolean(page)}
      onDismiss={onDismiss}
      title={page.title}
      description={page.url}
      facts={[
        { label: WebPartAuditContent.columns.count, value: formatNumber(page.webPartCount) },
        { label: WebPartAuditContent.columns.sections, value: formatNumber(page.sections) },
        { label: WebPartAuditContent.columns.layout, value: page.pageLayout || "Unknown" },
        { label: WebPartAuditContent.columns.modified, value: formatDate(page.modified) },
      ]}
      actions={
        <>
          <Button
            label={WebPartAuditContent.dialog.openPage}
            iconName="OpenInNewWindow"
            href={absoluteFromServerRelative(page.url, page.siteUrl)}
          />
          <Button label={WebPartAuditContent.dialog.close} variant="primary" onClick={onDismiss} />
        </>
      }
      sections={[...sections.entries()].map(([section, list]) => ({
        key: String(section),
        title: `${WebPartAuditContent.columns.section} ${section + 1}`,
        content: (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: Theme.tokens.space.sm }}>
            {list.map((instance) => (
              <li
                key={instance.instanceId}
                style={{
                  border: `1px solid ${Theme.palette().border}`,
                  borderRadius: Theme.tokens.radius.sm,
                  padding: Theme.tokens.space.sm,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: Theme.tokens.space.sm, flexWrap: "wrap" }}>
                  <strong>{instance.name}</strong>
                  {instance.title && <Badge label={instance.title} tone="neutral" showIcon={false} />}
                  <Badge
                    label={
                      instance.layer === 1
                        ? WebPartAuditContent.titleArea
                        : `${instance.section + 1}.${instance.column + 1}`
                    }
                    tone="info"
                    showIcon={false}
                  />
                  <span style={{ flex: "1 1 auto" }} />
                  <Button
                    label={
                      openInstance === instance.instanceId
                        ? WebPartAuditContent.dialog.hideProperties
                        : `${instance.propertyKeys.length} ${WebPartAuditContent.viewProperties.toLowerCase()}`
                    }
                    variant="subtle"
                    onClick={() =>
                      setOpenInstance(openInstance === instance.instanceId ? undefined : instance.instanceId)
                    }
                  />
                </div>

                {openInstance === instance.instanceId && (
                  <pre
                    style={{
                      margin: `${Theme.tokens.space.sm} 0 0`,
                      padding: Theme.tokens.space.sm,
                      background: Theme.palette().surfaceAlt,
                      borderRadius: Theme.tokens.radius.sm,
                      fontSize: Theme.tokens.font.sm,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      maxHeight: 260,
                      overflowY: "auto",
                    }}
                  >
                    {JSON.stringify(instance.properties, null, 2)}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        ),
      }))}
    />
  );
};
