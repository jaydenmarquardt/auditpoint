import { getSp } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { ListKind, ListScan, SiteList } from "@/api/Lists.types";
import { toErrorMessage } from "@/utils/Guard.util";

interface ListRow {
  Id: string;
  Title: string;
  Description: string;
  BaseTemplate: number;
  BaseType: number;
  ItemCount: number;
  Hidden: boolean;
  Created: string;
  LastItemModifiedDate: string;
  EnableVersioning: boolean;
  MajorVersionLimit: number;
  ContentTypesEnabled: boolean;
  HasUniqueRoleAssignments: boolean;
  NoCrawl: boolean;
  DefaultViewUrl: string;
  RootFolder?: { ServerRelativeUrl?: string };
}

const TEMPLATE_NAMES: Record<number, string> = {
  100: "Custom list",
  101: "Document library",
  102: "Survey",
  103: "Links",
  104: "Announcements",
  105: "Contacts",
  106: "Calendar",
  107: "Tasks",
  108: "Discussion board",
  109: "Picture library",
  110: "Data sources",
  111: "Site template gallery",
  112: "User information",
  113: "Web part gallery",
  114: "List template gallery",
  115: "Form library",
  116: "Master page gallery",
  117: "No code workflows",
  118: "Workflow process",
  119: "Site pages",
  120: "Custom grid",
  121: "Solution gallery",
  122: "No code public workflows",
  123: "Theme gallery",
  124: "Data connection library",
  125: "Workflow history",
  126: "Project tasks",
  130: "Data connection library",
  140: "Workflow history",
  150: "Project tasks",
  170: "Promoted links",
  171: "Tasks",
  175: "Maintenance logs",
  333: "Design gallery",
  338: "App data catalog",
  398: "Sharing links",
  420: "Composed looks",
  544: "Sharing links",
  550: "Access request list",
  600: "External list",
  700: "Assets",
  850: "Publishing pages",
  1100: "Issue tracking",
  3100: "Access apps",
  3415: "Web template extensions",
  10102: "Site notebook",
};

const SELECT = [
  "Id",
  "Title",
  "Description",
  "BaseTemplate",
  "BaseType",
  "ItemCount",
  "Hidden",
  "Created",
  "LastItemModifiedDate",
  "EnableVersioning",
  "MajorVersionLimit",
  "ContentTypesEnabled",
  "HasUniqueRoleAssignments",
  "NoCrawl",
  "DefaultViewUrl",
  "RootFolder/ServerRelativeUrl",
];

const PAGE_SIZE = 2000;

export function SiteLists(webUrl?: string): {
  getAll(includeHidden: boolean): Promise<SiteList[]>;
  withStorage(list: SiteList): Promise<SiteList>;
  contentTypes(list: SiteList): Promise<string[]>;
  contentTypesBulk(lists: SiteList[]): Promise<Map<string, string[]>>;
  scanItems(list: SiteList, maxItems: number): Promise<ListScan>;
  settingsUrl(list: SiteList): string;
  advancedSettingsUrl(list: SiteList): string;
  permissionsUrl(list: SiteList): string;
} {
  return {
    async getAll(includeHidden: boolean): Promise<SiteList[]> {
      const rows = (await throttled(
        () => getSp(webUrl).web.lists.select(...SELECT).expand("RootFolder")(),
        { label: "SiteLists.getAll" }
      )) as ListRow[];

      return rows.filter((row) => includeHidden || !row.Hidden).map(toSiteList);
    },

    async withStorage(list: SiteList): Promise<SiteList> {
      if (!list.serverRelativeUrl) return list;

      // StorageMetrics is its own endpoint; $expand on the folder silently
      // returns nothing on many tenants.
      try {
        const metrics = await throttled(
          () => getSp(webUrl).web.getFolderByServerRelativePath(list.serverRelativeUrl).storageMetrics(),
          { label: "SiteLists.storage" }
        );

        return {
          ...list,
          storageBytes: Number(metrics.TotalSize ?? 0),
          fileCount: Number(metrics.TotalFileCount ?? 0),
        };
      } catch (error) {
        return { ...list, metricsError: toErrorMessage(error) };
      }
    },

    async contentTypes(list: SiteList): Promise<string[]> {
      const types = (await throttled(
        () => getSp(webUrl).web.lists.getById(list.id).contentTypes.select("Name", "Hidden")(),
        { label: "SiteLists.contentTypes" }
      )) as { Name: string; Hidden?: boolean }[];

      return types.filter((type) => !type.Hidden).map((type) => type.Name);
    },

    /** One batched request for every list, rather than one call each. */
    async contentTypesBulk(lists: SiteList[]): Promise<Map<string, string[]>> {
      const result = new Map<string, string[]>();
      if (lists.length === 0) return result;

      const [batch, execute] = getSp(webUrl).batched();

      lists.forEach((list) => {
        batch.web.lists
          .getById(list.id)
          .contentTypes.select("Name", "Hidden")()
          .then((types: { Name: string; Hidden?: boolean }[]) => {
            result.set(
              list.id,
              types.filter((type) => !type.Hidden).map((type) => type.Name)
            );
          })
          .catch(() => result.set(list.id, []));
      });

      await throttled(() => execute(), { label: "SiteLists.contentTypesBulk" });
      return result;
    },

    /** StorageMetrics is unavailable on many tenants, so sizes come from the items. */
    async scanItems(list: SiteList, maxItems: number): Promise<ListScan> {
      const scan: ListScan = { items: 0, folders: 0, files: 0, bytes: 0, truncated: false, extensions: {} };

      // File size only exists on library items, and only through the File object.
      const isLibrary = list.kind === "library" || list.baseTemplate === 101 || list.baseTemplate === 700;

      const base = getSp(webUrl).web.lists.getById(list.id).items;
      const items = (
        isLibrary
          ? base.select("Id", "FSObjType", "FileLeafRef", "File/Length").expand("File")
          : base.select("Id", "FSObjType", "FileLeafRef")
      ).top(Math.min(PAGE_SIZE, Math.max(1, maxItems)));

      for await (const page of items) {
        for (const row of page as ItemRow[]) {
          if (scan.items >= maxItems) {
            scan.truncated = true;
            return scan;
          }

          scan.items = scan.items + 1;

          if (Number(row.FSObjType) === 1) {
            scan.folders = scan.folders + 1;
            continue;
          }

          scan.files = scan.files + 1;
          scan.bytes = scan.bytes + Number(row.File?.Length ?? 0);

          const extension = extensionOf(String(row.FileLeafRef ?? ""));
          if (extension) {
            const current = scan.extensions[extension] ?? { count: 0, bytes: 0 };
            scan.extensions[extension] = {
              count: current.count + 1,
              bytes: current.bytes + Number(row.File?.Length ?? 0),
            };
          }
        }
      }

      return scan;
    },

    settingsUrl(list: SiteList): string {
      return layout(webUrl, "listedit.aspx", list.id);
    },

    /** Advanced settings is where the search indexing switch lives. */
    advancedSettingsUrl(list: SiteList): string {
      return layout(webUrl, "advsetng.aspx", list.id);
    },

    permissionsUrl(list: SiteList): string {
      return layout(webUrl, "user.aspx", list.id);
    },
  };
}

function layout(webUrl: string | undefined, page: string, listId: string): string {
  const site = (webUrl ?? "").replace(/\/$/, "");
  return `${site}/_layouts/15/${page}?List=${encodeURIComponent(`{${listId}}`)}`;
}

interface ItemRow {
  Id: number;
  FSObjType?: number | string;
  FileLeafRef?: string;
  File?: { Length?: string | number };
}

function extensionOf(fileName: string): string {
  const match = /\.([a-z0-9]{1,8})$/i.exec(fileName);
  return match ? match[1].toLowerCase() : "";
}

function toSiteList(row: ListRow): SiteList {
  return {
    id: row.Id,
    title: row.Title,
    description: row.Description ?? "",
    kind: kindOf(row),
    baseTemplate: row.BaseTemplate,
    templateName: TEMPLATE_NAMES[row.BaseTemplate] ?? (row.BaseType === 1 ? "Other library" : "Other list"),
    itemCount: row.ItemCount ?? 0,
    hidden: Boolean(row.Hidden),
    created: row.Created,
    lastItemModified: row.LastItemModifiedDate,
    serverRelativeUrl: row.RootFolder?.ServerRelativeUrl ?? "",
    defaultViewUrl: row.DefaultViewUrl ?? "",
    versioningEnabled: Boolean(row.EnableVersioning),
    majorVersionLimit: row.MajorVersionLimit ?? 0,
    contentTypesEnabled: Boolean(row.ContentTypesEnabled),
    hasUniquePermissions: Boolean(row.HasUniqueRoleAssignments),
    noCrawl: Boolean(row.NoCrawl),
  };
}

function kindOf(row: ListRow): ListKind {
  if (row.Hidden) return "system";
  return row.BaseType === 1 ? "library" : "list";
}
