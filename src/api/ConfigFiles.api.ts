import { getSp } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { LinkPlacement } from "@/api/Links.types";
import { LinkScanner } from "@/api/Links.api";

/** Depth guard: a config file is a tree, and a malformed one can be a deep tree. */
const MAX_DEPTH = 12;
const URL_VALUE = /^(https?:\/\/|\/[^/\s])/i;

interface MegaMenuItem {
  id?: string;
  title?: string;
  href?: string;
  newTab?: boolean;
  children?: MegaMenuItem[];
}

export function ConfigFiles(webUrl?: string): {
  read(serverRelativeUrl: string): Promise<unknown>;
  links(json: unknown, fileName: string): LinkPlacement[];
  megaMenuLinks(json: unknown, fileName: string): LinkPlacement[];
} {
  const scanner = LinkScanner(webUrl);

  return {
    /** Configuration lives in the site, so it is read like any other file. */
    async read(serverRelativeUrl: string): Promise<unknown> {
      const text = await throttled(
        () => getSp(webUrl).web.getFileByServerRelativePath(serverRelativeUrl).getText(),
        { label: "ConfigFiles.read" }
      );

      return JSON.parse(text);
    },

    /**
     * Walks the whole document for url shaped strings. Config files hold links in
     * property names nobody agrees on, so the value decides, not the key, and the
     * key path becomes the label so an editor can find it again.
     */
    links(json: unknown, fileName: string): LinkPlacement[] {
      const found = new Map<string, LinkPlacement>();

      const visit = (value: unknown, path: string[], depth: number): void => {
        if (depth > MAX_DEPTH || value === null || value === undefined) return;

        if (typeof value === "string") {
          const text = value.trim();
          if (!URL_VALUE.test(text)) return;

          const label = `${fileName}: ${path.join(".")}`;
          found.set(`${text}|${label}`, scanner.fromUrl(text, "", { source: "config", sourceLabel: label }));
          return;
        }

        if (Array.isArray(value)) {
          value.forEach((entry, index) => visit(entry, [...path, `[${index}]`], depth + 1));
          return;
        }

        if (typeof value === "object") {
          Object.keys(value as Record<string, unknown>).forEach((key) =>
            visit((value as Record<string, unknown>)[key], [...path, key], depth + 1)
          );
        }
      };

      visit(json, [], 0);
      return [...found.values()];
    },

    /**
     * The mega menu is a link source with no page of its own, so its nodes are read
     * as one flat list, each labelled with the trail through the menu that reaches it.
     */
    megaMenuLinks(json: unknown, fileName: string): LinkPlacement[] {
      const root = (json as { megamenu?: { items?: MegaMenuItem[] } })?.megamenu?.items;
      if (!Array.isArray(root)) return [];

      const walk = (items: MegaMenuItem[], trail: string[], depth: number): LinkPlacement[] => {
        if (depth > MAX_DEPTH) return [];

        return items.flatMap((item) => {
          const path = [...trail, item.title || "Untitled"];
          const self = item.href
            ? [
                scanner.fromUrl(
                  item.href,
                  item.title ?? "",
                  { source: "megamenu", sourceLabel: `${fileName}: ${path.join(" > ")}` },
                  Boolean(item.newTab)
                ),
              ]
            : [];

          return [...self, ...walk(item.children ?? [], path, depth + 1)];
        });
      };

      return walk(root, [], 0);
    },
  };
}

export function splitPaths(raw: string): string[] {
  return raw
    .split(/[,;\n]+/)
    .map((path) => path.trim())
    .filter((path) => path.length > 0);
}
