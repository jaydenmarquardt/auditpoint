import { getSp, getSiteRelativeUrl } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { getSettings } from "@/api/Settings.api";
import { joinPath } from "@/utils/Url.util";
import { PermissionKind } from "@pnp/sp/security";
import {
  ReportEnvelope,
  ReportFolderAccess,
  ReportIndexEntry,
  ReportLocation,
  ReportRunStatus,
  ReportSummary,
} from "@/api/Reports.types";
import { toErrorMessage } from "@/utils/Guard.util";

export function reportLocation(overrides: Partial<ReportLocation> = {}): ReportLocation {
  const settings = getSettings();
  return {
    library: overrides.library ?? settings.reportLibrary,
    folder: overrides.folder ?? settings.reportFolder,
    webUrl: overrides.webUrl,
  };
}

export function reportFolderUrl(location: ReportLocation = reportLocation()): string {
  const siteRelative = location.webUrl ? new URL(location.webUrl).pathname : getSiteRelativeUrl();
  return joinPath(siteRelative, location.library, location.folder);
}

async function folderAccess(location: ReportLocation): Promise<ReportFolderAccess> {
  const url = reportFolderUrl(location);
  const sp = getSp(location.webUrl);

  const [canView, canEdit] = await Promise.all([
    permission(location, PermissionKind.ViewListItems),
    permission(location, PermissionKind.EditListItems),
  ]);

  try {
    await throttled(() => sp.web.getFolderByServerRelativePath(url).select("Exists")(), {
      label: "Reports.check",
      priority: true,
      retries: 0,
    });
    return { url, exists: true, canView, canEdit };
  } catch (error) {
    return { url, exists: false, canView, canEdit, error: toErrorMessage(error) };
  }
}

async function permission(location: ReportLocation, kind: PermissionKind): Promise<boolean> {
  try {
    return await throttled(() => getSp(location.webUrl).web.currentUserHasPermissions(kind), {
      label: "Reports.permission",
      priority: true,
      retries: 0,
    });
  } catch {
    return false;
  }
}

const INDEX_FILE = "index.json";
/**
 * A run checkpoints after every stage, so a file still claiming to be running long
 * after its last write was abandoned when its page closed. Anything fresher might
 * genuinely be running, possibly for somebody else, so it is left alone.
 */
const ABANDONED_AFTER_MS = 5 * 60 * 1000;

export function runStatusOf(status: ReportRunStatus, updatedIso: string): ReportRunStatus {
  if (status !== "running") return status;

  const updated = new Date(updatedIso).getTime();
  if (!Number.isFinite(updated)) return status;

  return Date.now() - updated > ABANDONED_AFTER_MS ? "interrupted" : status;
}

export function Reports(location: ReportLocation = reportLocation()): {
  folderUrl(): string;
  checkFolder(): Promise<ReportFolderAccess>;
  ensureFolder(): Promise<ReportFolderAccess>;
  list(): Promise<ReportSummary[]>;
  index(): Promise<ReportIndexEntry[]>;
  read<TData, TConfig = Record<string, unknown>>(serverRelativeUrl: string): Promise<ReportEnvelope<TData, TConfig>>;
  save<TData, TConfig = Record<string, unknown>>(envelope: ReportEnvelope<TData, TConfig>): Promise<ReportSummary>;
  remove(serverRelativeUrl: string): Promise<void>;
} {
  const folder = (): string => reportFolderUrl(location);
  const sp = (): ReturnType<typeof getSp> => getSp(location.webUrl);

  return {
    folderUrl(): string {
      return folder();
    },

    checkFolder(): Promise<ReportFolderAccess> {
      return folderAccess(location);
    },

    async ensureFolder(): Promise<ReportFolderAccess> {
      try {
        await throttled(() => sp().web.folders.addUsingPath(folder(), true), { label: "Reports.ensure" });
      } catch (error) {
        return { ...(await folderAccess(location)), error: toErrorMessage(error) };
      }

      return folderAccess(location);
    },

    async index(): Promise<ReportIndexEntry[]> {
      try {
        const text = await throttled(
          () => sp().web.getFileByServerRelativePath(`${folder()}/${INDEX_FILE}`).getText(),
          { label: "Reports.index", priority: true, retries: 0 }
        );
        return (JSON.parse(text) as ReportIndexEntry[]).map((entry) => ({
          ...entry,
          status: runStatusOf(entry.status, entry.updatedIso),
        }));
      } catch {
        return [];
      }
    },

    async list(): Promise<ReportSummary[]> {
      const [entries, files] = await Promise.all([
        this.index(),
        throttled(
          () =>
            sp()
              .web.getFolderByServerRelativePath(folder())
              .files.select("Name", "ServerRelativeUrl", "TimeLastModified", "Length")(),
          { label: "Reports.list" }
        ) as Promise<FileRow[]>,
      ]);

      const byName = new Map(entries.map((entry) => [entry.fileName, entry]));

      return files
        .filter((file) => file.Name.endsWith(".json") && file.Name !== INDEX_FILE)
        .map((file) => {
          const entry = byName.get(file.Name);

          return {
            id: entry?.id ?? file.Name.replace(/\.json$/i, ""),
            name: file.Name,
            kind: entry?.kind ?? file.Name.split("__")[0],
            title: entry?.title ?? "",
            status: entry ? runStatusOf(entry.status, entry.updatedIso) : "complete",
            serverRelativeUrl: file.ServerRelativeUrl,
            modified: entry?.updatedIso ?? file.TimeLastModified,
            sizeBytes: Number(file.Length ?? 0),
            createdBy: entry?.createdBy ?? "",
            createdByLogin: entry?.createdByLogin ?? "",
          };
        })
        .sort((a, b) => b.modified.localeCompare(a.modified));
    },

    async read<TData, TConfig>(serverRelativeUrl: string): Promise<ReportEnvelope<TData, TConfig>> {
      const text = await throttled(
        () => sp().web.getFileByServerRelativePath(serverRelativeUrl).getText(),
        { label: "Reports.read", priority: true }
      );

      const envelope = JSON.parse(text) as ReportEnvelope<TData, TConfig>;
      return { ...envelope, status: runStatusOf(envelope.status, envelope.updatedIso) };
    },

    async save<TData, TConfig>(envelope: ReportEnvelope<TData, TConfig>): Promise<ReportSummary> {
      await this.ensureFolder();

      const fileName = `${envelope.kind}__${envelope.id}.json`;
      const body = new Blob([JSON.stringify(envelope)], { type: "application/json" });

      const result = await throttled(
        () =>
          sp()
            .web.getFolderByServerRelativePath(folder())
            .files.addUsingPath(fileName, body, { Overwrite: true }),
        { label: "Reports.save" }
      );

      await writeIndex(location, folder, sp, toIndexEntry(envelope, fileName));

      return {
        id: envelope.id,
        name: fileName,
        kind: envelope.kind,
        title: envelope.title,
        status: envelope.status,
        serverRelativeUrl: result.ServerRelativeUrl,
        modified: envelope.updatedIso,
        sizeBytes: 0,
        createdBy: envelope.createdBy,
        createdByLogin: envelope.createdByLogin ?? "",
      };
    },

    async remove(serverRelativeUrl: string): Promise<void> {
      await throttled(() => sp().web.getFileByServerRelativePath(serverRelativeUrl).recycle(), {
        label: "Reports.remove",
      });

      const fileName = serverRelativeUrl.split("/").pop() ?? "";
      const entries = (await this.index()).filter((entry) => entry.fileName !== fileName);
      await writeIndexFile(folder, sp, entries);
    },
  };
}

function toIndexEntry<TData, TConfig>(
  envelope: ReportEnvelope<TData, TConfig>,
  fileName: string
): ReportIndexEntry {
  return {
    id: envelope.id,
    kind: envelope.kind,
    title: envelope.title,
    version: envelope.version,
    status: envelope.status,
    createdIso: envelope.createdIso,
    updatedIso: envelope.updatedIso,
    createdBy: envelope.createdBy,
    createdByLogin: envelope.createdByLogin ?? "",
    sites: envelope.sites,
    issues: envelope.issues.length,
    stages: envelope.stages.map((stage) => ({ key: stage.key, label: stage.label, status: stage.status })),
    fileName,
  };
}

/** One small index file keeps status and owner readable without opening every report. */
async function writeIndex(
  location: ReportLocation,
  folder: () => string,
  sp: () => ReturnType<typeof getSp>,
  entry: ReportIndexEntry
): Promise<void> {
  const existing = await Reports(location).index();
  const entries = [entry, ...existing.filter((candidate) => candidate.id !== entry.id)];
  await writeIndexFile(folder, sp, entries);
}

async function writeIndexFile(
  folder: () => string,
  sp: () => ReturnType<typeof getSp>,
  entries: ReportIndexEntry[]
): Promise<void> {
  const body = new Blob([JSON.stringify(entries)], { type: "application/json" });

  await throttled(
    () => sp().web.getFolderByServerRelativePath(folder()).files.addUsingPath(INDEX_FILE, body, { Overwrite: true }),
    { label: "Reports.index.write" }
  ).catch(() => undefined);
}

interface FileRow {
  Name: string;
  ServerRelativeUrl: string;
  TimeLastModified: string;
  Length?: string | number;
  Author?: { Title?: string; LoginName?: string };
}


