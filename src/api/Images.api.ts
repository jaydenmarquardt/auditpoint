import { getSp } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { SiteList } from "@/api/Lists.types";
import { ImageFile, ImageUsage } from "@/api/Images.types";

export const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "tiff", "tif", "ico", "avif"];

interface FileRow {
  Id: number;
  FileLeafRef?: string;
  FileRef?: string;
  Modified?: string;
  File?: { Length?: string | number };
}

export function ImageFiles(webUrl?: string): {
  inLibrary(list: SiteList, max: number): Promise<ImageFile[]>;
  fromHtml(html: string, context: Omit<ImageUsage, "src" | "path" | "alt" | "hasAlt" | "width" | "height" | "isExternal">): ImageUsage[];
} {
  const site = webUrl ?? "";

  return {
    async inLibrary(list: SiteList, max: number): Promise<ImageFile[]> {
      const rows = (await throttled(
        () =>
          getSp(webUrl)
            .web.lists.getById(list.id)
            .items.select("Id", "FileLeafRef", "FileRef", "Modified", "File/Length")
            .expand("File")
            .top(max)(),
        { label: "Images.inLibrary" }
      )) as FileRow[];

      return rows
        .map((row) => ({
          siteUrl: site,
          listTitle: list.title,
          name: String(row.FileLeafRef ?? ""),
          url: String(row.FileRef ?? ""),
          extension: extensionOf(String(row.FileLeafRef ?? "")),
          sizeBytes: Number(row.File?.Length ?? 0),
          modified: String(row.Modified ?? ""),
        }))
        .filter((file) => IMAGE_EXTENSIONS.indexOf(file.extension) !== -1);
    },

    /** Reads the img tags out of stored HTML, keeping alt text and sizing hints. */
    fromHtml(html, context): ImageUsage[] {
      if (!html || html.trim().length === 0) return [];

      const document = new DOMParser().parseFromString(html, "text/html");

      return Array.from(document.querySelectorAll("img")).map((image) => {
        const src = (image.getAttribute("src") ?? "").trim();
        const alt = (image.getAttribute("alt") ?? "").trim();

        return {
          ...context,
          src,
          path: normalisePath(src),
          alt,
          hasAlt: alt.length > 0,
          width: image.getAttribute("width") ?? "",
          height: image.getAttribute("height") ?? "",
          isExternal: isExternal(src, site),
        };
      });
    },
  };
}

export function normalisePath(src: string): string {
  if (!src) return "";

  try {
    const url = /^https?:\/\//i.test(src) ? new URL(src) : new URL(src, "https://placeholder.local");
    return decodeURIComponent(url.pathname).toLowerCase();
  } catch {
    return src.split("?")[0].toLowerCase();
  }
}

function isExternal(src: string, siteUrl: string): boolean {
  if (!/^https?:\/\//i.test(src)) return false;

  try {
    return new URL(src).host.toLowerCase() !== new URL(siteUrl || window.location.href).host.toLowerCase();
  } catch {
    return false;
  }
}

function extensionOf(fileName: string): string {
  const match = /\.([a-z0-9]{1,6})$/i.exec(fileName);
  return match ? match[1].toLowerCase() : "";
}
