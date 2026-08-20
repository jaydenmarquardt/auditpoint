import { getSp } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { CatalogueEntry } from "@/api/WebParts.types";

interface ManifestEntry {
  preconfiguredEntries?: {
    title?: { default?: string };
    description?: { default?: string };
    officeFabricIconFontName?: string;
    iconImageUrl?: string;
    group?: { default?: string };
    groupId?: string;
  }[];
  alias?: string;
  version?: string;
  isInternal?: boolean;
}

/** Component manifests installed on the web, used to name and icon each web part. */
export function WebPartCatalogue(webUrl?: string): {
  getAll(): Promise<CatalogueEntry[]>;
} {
  return {
    async getAll(): Promise<CatalogueEntry[]> {
      const components = await throttled(() => getSp(webUrl).web.getClientsideWebParts(), {
        label: "WebPartCatalogue.getAll",
      });

      return components.map((component) => {
        const manifest = parse(component.Manifest);
        const entry = manifest?.preconfiguredEntries?.[0];

        return {
          id: String(component.Id ?? "").replace(/[{}]/g, "").toLowerCase(),
          name: component.Name ?? "",
          title: entry?.title?.default ?? component.Name ?? "",
          description: entry?.description?.default ?? "",
          iconName: entry?.officeFabricIconFontName ?? "",
          iconUrl: entry?.iconImageUrl ?? "",
          group: entry?.group?.default ?? "",
          alias: manifest?.alias ?? "",
          version: manifest?.version ?? "",
          componentType: Number(component.ComponentType ?? 0),
          status: Number(component.Status ?? 0),
          isInternal: Boolean(manifest?.isInternal),
        };
      });
    },
  };
}

function parse(manifest: string | undefined): ManifestEntry | undefined {
  if (!manifest) return undefined;
  try {
    return JSON.parse(manifest) as ManifestEntry;
  } catch {
    return undefined;
  }
}
