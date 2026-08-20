import { CatalogueEntry, WebPartInstance } from "@/api/WebParts.types";
import {
  WebPartAuditData,
  WebPartAuditView,
  WebPartTypeSummary,
} from "@/modules/webPartAudit/WebPartAudit.types";

export function buildView(data: Partial<WebPartAuditData> | undefined): WebPartAuditView {
  const instances = data?.instances ?? [];
  const pages = data?.pages ?? [];
  const catalogue = data?.catalogue ?? [];
  const types = summariseTypes(instances, catalogue);

  const pagesWithContent = pages.filter((page) => page.webPartCount > 0).length;
  const used = new Set(types.map((type) => type.webPartId));

  return {
    totals: {
      pages: pages.length,
      pagesWithContent,
      emptyPages: pages.length - pagesWithContent,
      instances: instances.length,
      types: types.length,
      outOfBox: types.filter((type) => type.isOutOfBox).length,
      thirdParty: types.filter((type) => type.isThirdParty).length,
      textBlocks: instances.filter((instance) => instance.kind === "text").length,
      instancesStock: instances.filter((instance) => instance.kind !== "webPart").length,
      instancesThirdParty: instances.filter((instance) => instance.kind === "webPart" && instance.isThirdParty).length,
      instancesOutOfBox: instances.filter(
        (instance) => instance.kind === "webPart" && !instance.isThirdParty
      ).length,
      averagePerPage: pages.length === 0 ? 0 : Math.round((instances.length / pages.length) * 10) / 10,
    },
    types,
    catalogueOnly: catalogue
      .filter((entry) => !used.has(entry.id))
      .map((entry) => ({ id: entry.id, title: entry.title, group: entry.group, iconName: entry.iconName }))
      .sort((a, b) => a.title.localeCompare(b.title)),
    topTypes: types.slice(0, 10).map((type) => ({ label: type.name, value: type.instances })),
    busiestPages: [...pages].sort((a, b) => b.webPartCount - a.webPartCount).slice(0, 10),
    layoutSplit: countBy(pages.map((page) => page.pageLayout || "Unknown")),
  };
}

export function summariseTypes(
  instances: WebPartInstance[],
  catalogue: CatalogueEntry[]
): WebPartTypeSummary[] {
  const entries = new Map(catalogue.map((entry) => [entry.id, entry]));
  const grouped = new Map<string, WebPartInstance[]>();

  instances.forEach((instance) => {
    const key = instance.webPartId || instance.name;
    grouped.set(key, [...(grouped.get(key) ?? []), instance]);
  });

  return [...grouped.entries()]
    .map(([key, group]) => {
      const first = group[0];
      const entry = entries.get(first.webPartId);
      const propertyKeys = [...new Set(group.flatMap((instance) => instance.propertyKeys))].sort();

      return {
        key,
        name: entry?.title || first.name,
        webPartId: first.webPartId,
        instances: group.length,
        pages: new Set(group.map((instance) => `${instance.siteUrl}-${instance.pageId}`)).size,
        isOutOfBox: first.isOutOfBox || Boolean(entry?.isInternal),
        isThirdParty: first.isThirdParty,
        propertyKeys,
        commonPropertyKeys: propertyKeys.filter((property) =>
          group.every((instance) => instance.propertyKeys.indexOf(property) !== -1)
        ),
        sharedValues: sharedValues(group, propertyKeys),
        iconName: entry?.iconName ?? "",
        iconUrl: entry?.iconUrl ?? "",
        description: entry?.description ?? "",
        group: entry?.group ?? "",
        inCatalogue: Boolean(entry),
      };
    })
    .sort((a, b) => b.instances - a.instances);
}

/** Keys every instance carries with the same value: the shared configuration. */
function sharedValues(
  group: WebPartInstance[],
  propertyKeys: string[]
): { key: string; value: string }[] {
  if (group.length < 2) return [];

  return propertyKeys
    .map((key) => {
      const values = group.map((instance) => stringify(instance.properties[key]));
      const unique = new Set(values);
      return unique.size === 1 && values[0] !== "" ? { key, value: values[0] } : undefined;
    })
    .filter((entry): entry is { key: string; value: string } => entry !== undefined)
    .slice(0, 12);
}

export interface PropertyUsage {
  key: string;
  present: number;
  percent: number;
  topValues: { value: string; count: number }[];
}

export function propertyUsage(instances: WebPartInstance[]): PropertyUsage[] {
  const keys = [...new Set(instances.flatMap((instance) => instance.propertyKeys))];

  return keys
    .map((key) => {
      const withKey = instances.filter((instance) => instance.propertyKeys.indexOf(key) !== -1);
      const counts = new Map<string, number>();

      withKey.forEach((instance) => {
        const value = stringify(instance.properties[key]);
        if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
      });

      return {
        key,
        present: withKey.length,
        percent: instances.length === 0 ? 0 : Math.round((withKey.length / instances.length) * 100),
        topValues: [...counts.entries()]
          .map(([value, count]) => ({ value, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
      };
    })
    .sort((a, b) => b.present - a.present);
}

export function instancesOfType(instances: WebPartInstance[], key: string): WebPartInstance[] {
  return instances.filter((instance) => (instance.webPartId || instance.name) === key);
}

function stringify(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "object") return JSON.stringify(value).slice(0, 120);
  return String(value).slice(0, 120);
}

function countBy(values: string[]): { key: string; label: string; value: number }[] {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));

  return [...counts.entries()]
    .map(([label, value]) => ({ key: label, label, value }))
    .sort((a, b) => b.value - a.value);
}

/** Fluent charts key on the label, so repeated names have to be made unique. */
export function dedupeLabels(points: { label: string; value: number }[]): { label: string; value: number }[] {
  const seen = new Map<string, number>();

  return points.map((point) => {
    const count = (seen.get(point.label) ?? 0) + 1;
    seen.set(point.label, count);
    return count === 1 ? point : { ...point, label: `${point.label} (${count})` };
  });
}
