import { BrokenState, LinkSource, LinkType } from "@/api/Links.types";
import { DOCUMENT_EXTENSIONS } from "@/api/Documents.api";
import { LinkAuditContent } from "@/modules/linkAudit/LinkAudit.content";
import {
  AggregatedLink,
  LinkAuditConfig,
  LinkAuditData,
  LinkAuditView,
  LinkTypeTotals,
  LinkUsage,
  OutgoingLink,
  Reference,
  ReferenceSummary,
  ReferenceTotals,
} from "@/modules/linkAudit/LinkAudit.types";

export const LINK_TYPES: LinkType[] = [
  "thisSite",
  "otherSite",
  "share",
  "legacy",
  "document",
  "external",
  "anchor",
  "contact",
  "script",
  "unknown",
];

const DOCUMENT_EXTENSION = new RegExp(`\\.(${DOCUMENT_EXTENSIONS.join("|")})(\\?|#|$)`, "i");
/** The shapes SharePoint hands out when someone presses Share. */
const SHARE_URL = /(\/:[a-z]:\/[a-z]\/|guestaccess\.aspx|sharing\.aspx|[?&]share=|\/_layouts\/15\/download\.aspx\?share=)/i;
/** A list item behind its form url, which is a real item rather than a page. */
const DISPLAY_FORM = /\/(dispform|editform)\.aspx/i;

export interface ClassifyOptions {
  origin: string;
  /** Server relative path of the site being audited, which separates it from its neighbours. */
  sitePath: string;
  legacyHosts: string[];
}

export function legacyHostsOf(config: LinkAuditConfig): string[] {
  return config.legacyHosts
    .split(/[,;\s]+/)
    .map((host) => host.trim().toLowerCase())
    .filter((host) => host.length > 0);
}

/**
 * A fragment or query never changes which page a link lands on, so both are dropped
 * before matching against the index or requesting the url.
 */
export function stripUrlSuffix(url: string): string {
  const trimmed = `${url ?? ""}`.trim();
  const cut = trimmed.search(/[?#]/);
  return cut > 0 ? trimmed.substring(0, cut) : trimmed;
}

/**
 * A retired entry is a host, a path, or a wildcard pattern where a star stands for
 * any run of characters, so "star slash admin-circulars slash pages slash star"
 * retires a whole section. An entry with no star still matches as a plain
 * substring, which is how hosts were always written.
 */
export function isLegacyUrl(url: string, legacyHosts: string[]): boolean {
  const value = `${url ?? ""}`.toLowerCase();

  return legacyHosts.some((pattern) => {
    const trimmed = pattern.trim().toLowerCase();
    if (!trimmed) return false;
    if (trimmed.indexOf("*") === -1) return value.indexOf(trimmed) !== -1;

    const expression = trimmed
      .split("*")
      .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
      .join(".*");

    return new RegExp(expression).test(value);
  });
}

/** Same tenancy and inside the audited site, rather than a neighbouring one. */
export function isShareUrl(url: string): boolean {
  return SHARE_URL.test(`${url ?? ""}`);
}

/** `/sites/x/Lists/News/DispForm.aspx?ID=12` is item 12, not a page called DispForm. */
export function displayFormTarget(url: string): { path: string; itemId: number } | undefined {
  const value = `${url ?? ""}`;
  if (!DISPLAY_FORM.test(value)) return undefined;

  const id = /[?&]id=(\d+)/i.exec(value);
  if (!id) return undefined;

  const path = stripUrlSuffix(value).replace(DISPLAY_FORM, "").replace(/\/forms$/i, "");
  return { path: path.toLowerCase(), itemId: Number(id[1]) };
}

export function isRelativeUrl(url: string): boolean {
  return `${url ?? ""}`.trim().startsWith("/");
}

export function isThisSiteUrl(url: string, origin: string, sitePath: string): boolean {
  const path = pathOf(url, origin);
  if (path === undefined) return false;

  const site = `${sitePath || "/"}`.toLowerCase().replace(/\/$/, "");
  if (!site || site === "") return true;

  const value = path.toLowerCase();
  return value === site || value.startsWith(`${site}/`);
}

function pathOf(url: string, origin: string): string | undefined {
  const trimmed = `${url ?? ""}`.trim();
  if (trimmed.length === 0) return undefined;
  if (trimmed.startsWith("/")) return trimmed;

  try {
    const parsed = new URL(trimmed);
    return parsed.origin.toLowerCase() === origin.toLowerCase() ? parsed.pathname : undefined;
  } catch {
    return undefined;
  }
}

export function isIntranetUrl(url: string, origin: string): boolean {
  const trimmed = `${url ?? ""}`.trim();
  if (trimmed.length === 0) return false;
  // A server relative url can only ever be this tenancy.
  if (trimmed.startsWith("/")) return true;

  try {
    return new URL(trimmed).origin.toLowerCase() === origin.toLowerCase();
  } catch {
    return false;
  }
}

/**
 * Works out what a link points at, first match wins. Everything downstream, including
 * whether it is worth testing for a 404, hangs off this.
 */
export function classifyLink(link: OutgoingLink, options: ClassifyOptions): LinkType {
  const url = `${link.url ?? ""}`.trim();
  if (url.length === 0) return "unknown";
  if (link.isJS) return "script";
  if (link.isContact) return "contact";
  if (link.isAnchor) return "anchor";
  if (isLegacyUrl(url, options.legacyHosts)) return "legacy";
  // A share link carries a token, not a path, so it can never be matched to an item.
  if (SHARE_URL.test(url)) return "share";
  if (DOCUMENT_EXTENSION.test(url)) return "document";

  if (isIntranetUrl(url, options.origin)) {
    // Both are internal; the split is only about who owns the page at the other end.
    return isThisSiteUrl(url, options.origin, options.sitePath) ? "thisSite" : "otherSite";
  }

  if (link.isExternal) return "external";
  return "unknown";
}

/**
 * Sets the type, flags and a starting broken state on every link. Links that can never
 * be broken settle here; the rest stay unsure until the index resolves them or the
 * broken link stage tests them.
 */
export function classifyReferences(references: Reference[], options: ClassifyOptions): void {
  references.forEach((reference) => {
    (reference.outgoing ?? []).forEach((link) => {
      link.linkType = classifyLink(link, options);
      link.isDisplayForm = displayFormTarget(link.url) !== undefined;
      link.isLegacy = isLegacyUrl(link.url, options.legacyHosts);
      link.isIntranet =
        link.linkType === "document"
          ? isIntranetUrl(link.url, options.origin)
          : link.linkType === "thisSite" || link.linkType === "otherSite";
      link.broken = restingBrokenState(link);
    });

    reference.brokenCount = countBroken(reference);
  });
}

/** The state a link sits at before anything has actually been requested. */
function restingBrokenState(link: OutgoingLink): BrokenState {
  // A retired host is switched off, so every link to it is dead.
  if (link.linkType === "legacy") return "yes";
  // A resolved link matched a real item in the index, so it is known good.
  if (link.targetTitle) return "no";

  switch (link.linkType) {
    case "script":
    case "contact":
    case "anchor":
      // Nothing to request, so nothing to be broken.
      return "no";
    case "external":
    case "share":
      // Cross origin and tokenised urls are opaque, so neither can be proven.
      return "unsure";
    default:
      return link.isIntranet || link.isExternal ? "unsure" : "no";
  }
}

function countBroken(reference: Reference): number {
  return (reference.outgoing ?? []).filter((link) => link.broken === "yes").length;
}

/**
 * Resolves incoming links by building a url lookup and walking each outgoing link
 * once. Comparing every item against every other was O(items squared). Safe to
 * re-run, which the document and broken stages depend on.
 */
export function indexReferences(references: Reference[]): void {
  const byUrl = new Map<string, Reference[]>();

  references.forEach((reference) => {
    reference.incoming = [];
    // Navigation is a link source with no url of its own, so nothing points at it.
    if (!reference.url && !reference.fileUrl) return;

    [reference.url, reference.fileUrl, absoluteOf(reference)].forEach((url) => {
      if (!url) return;

      // SharePoint urls vary in casing between the list and the stored link.
      const key = url.toLowerCase();
      const owners = byUrl.get(key);
      if (!owners) byUrl.set(key, [reference]);
      else if (owners.indexOf(reference) === -1) owners.push(reference);
    });
  });

  // Items also answer to their display form url, which is how most people link to one.
  const byListItem = new Map<string, Reference>();
  references.forEach((reference) => {
    if (!reference.url || !reference.itemId) return;
    const folder = reference.url.substring(0, reference.url.lastIndexOf("/")).toLowerCase();
    if (folder) byListItem.set(`${folder}|${reference.itemId}`, reference);
  });

  const linked = new Map<Reference, Set<string>>();

  references.forEach((source) => {
    (source.outgoing ?? []).forEach((link) => {
      // Try it as written, then again without any fragment or query.
      const form = displayFormTarget(link.url);
      const formTarget = form ? byListItem.get(`${form.path}|${form.itemId}`) : undefined;

      const targets =
        byUrl.get(`${link.url ?? ""}`.toLowerCase()) ??
        byUrl.get(stripUrlSuffix(link.url).toLowerCase()) ??
        (formTarget ? [formTarget] : undefined);

      if (!targets || targets.length === 0) {
        link.targetKey = "";
        link.targetTitle = "";
        link.targetList = "";
        link.targetUrl = "";
        link.targetId = 0;
        return;
      }

      const [first] = targets;
      link.targetKey = first.key;
      link.targetTitle = first.title;
      link.targetList = first.listTitle;
      link.targetUrl = first.url;
      link.targetId = first.itemId;

      targets.forEach((target) => {
        let seen = linked.get(target);
        if (!seen) {
          seen = new Set<string>();
          linked.set(target, seen);
        }

        // Keyed on the link, not just the item, so a page pointing here from both its
        // body and a web part shows as two distinct incoming rows.
        const key = `${source.key}_${link.source}_${link.sourceLabel ?? ""}`;
        if (seen.has(key)) return;

        seen.add(key);
        target.incoming.push(summaryOf(source, link));
      });
    });
  });
}

function absoluteOf(reference: Reference): string {
  if (!reference.url || !reference.siteUrl) return "";

  try {
    return `${new URL(reference.siteUrl).origin}${reference.url}`;
  } catch {
    return "";
  }
}

export function summaryOf(reference: Reference, link?: OutgoingLink): ReferenceSummary {
  return {
    key: reference.key,
    siteUrl: reference.siteUrl,
    listTitle: reference.listTitle,
    title: reference.title,
    url: reference.url,
    itemId: reference.itemId,
    source: link?.source ?? "content",
    sourceLabel: link?.sourceLabel ?? "",
  };
}

/** Every link the broken link stage could actually learn something from. */
export function brokenCheckCandidates(references: Reference[]): string[] {
  const urls = new Set<string>();

  references.forEach((reference) =>
    (reference.outgoing ?? []).forEach((link) => {
      if (link.broken !== "unsure" || !link.isIntranet) return;

      const url = stripUrlSuffix(link.url);
      if (url) urls.add(url);
    })
  );

  return [...urls];
}

/** Writes one request's result back onto every link that used that url. */
export function applyBrokenResults(references: Reference[], results: Map<string, number>): number {
  let broken = 0;

  references.forEach((reference) => {
    (reference.outgoing ?? []).forEach((link) => {
      const status = results.get(stripUrlSuffix(link.url));
      if (status === undefined || status === 0) return;

      link.status = status;
      link.broken = status >= 400 ? "yes" : "no";
      if (link.broken === "yes") broken = broken + 1;
    });

    reference.brokenCount = countBroken(reference);
  });

  return broken;
}

/**
 * Absolute and server relative spellings of the same page have to land on the same
 * key, so the origin is stripped rather than kept.
 */
export function normaliseUrl(url: string, origin: string): string {
  let trimmed = `${url ?? ""}`.trim().toLowerCase();
  if (trimmed.length === 0) return "";

  const host = origin.toLowerCase();
  if (trimmed.startsWith(host)) trimmed = trimmed.substring(host.length);
  // A bare host with nothing after it still refers to the site root.
  if (trimmed.length === 0) return "/";
  if (trimmed.length > 1 && trimmed.endsWith("/")) trimmed = trimmed.slice(0, -1);

  return trimmed;
}

/** Collapses every spelling of the same destination into one row. */
export function aggregateLinks(references: Reference[], origin: string): AggregatedLink[] {
  const byKey = new Map<string, AggregatedLink>();

  references.forEach((reference) =>
    (reference.outgoing ?? []).forEach((link) => {
      const key = normaliseUrl(link.url, origin);
      if (!key) return;

      let entry = byKey.get(key);
      if (!entry) {
        entry = {
          key,
          url: link.url,
          text: link.text ?? "",
          linkType: link.linkType ?? "unknown",
          isIntranet: Boolean(link.isIntranet),
          isLegacy: Boolean(link.isLegacy),
          isExternal: Boolean(link.isExternal),
          isInsecure: Boolean(link.isInsecure),
          broken: link.broken ?? "unsure",
          status: link.status ?? 0,
          targetTitle: link.targetTitle ?? "",
          variants: [],
          sourceLists: [],
          usages: [],
          count: 0,
        };
        byKey.set(key, entry);
      }

      if (link.url && entry.variants.indexOf(link.url) === -1) entry.variants.push(link.url);
      if (reference.listTitle && entry.sourceLists.indexOf(reference.listTitle) === -1) {
        entry.sourceLists.push(reference.listTitle);
      }

      // A resolved or proven state on any one spelling applies to them all.
      if (!entry.targetTitle && link.targetTitle) entry.targetTitle = link.targetTitle;
      if (link.broken === "yes") entry.broken = "yes";
      else if (link.broken === "no" && entry.broken === "unsure") entry.broken = "no";
      if (!entry.status && link.status) entry.status = link.status;
      if (!entry.text && link.text) entry.text = link.text;

      entry.usages.push({ reference: summaryOf(reference, link), link });
      entry.count = entry.count + 1;
    })
  );

  return [...byKey.values()];
}

/** Counts every link by kind, including the ones with no text on them. */
export function summariseLinkTypes(references: Reference[]): LinkTypeTotals {
  const totals: LinkTypeTotals = {
    thisSite: 0,
    otherSite: 0,
    share: 0,
    legacy: 0,
    document: 0,
    external: 0,
    anchor: 0,
    contact: 0,
    script: 0,
    unknown: 0,
    emptyText: 0,
    insecure: 0,
    matched: 0,
    unmapped: 0,
    newTab: 0,
    internal: 0,
    relative: 0,
    absolute: 0,
    displayForm: 0,
    mappable: 0,
  };

  references.forEach((reference) =>
    (reference.outgoing ?? []).forEach((link) => {
      totals[link.linkType ?? "unknown"] = totals[link.linkType ?? "unknown"] + 1;
      if (`${link.text ?? ""}`.trim().length === 0) totals.emptyText = totals.emptyText + 1;
      if (link.isInsecure) totals.insecure = totals.insecure + 1;
      if (link.newTab) totals.newTab = totals.newTab + 1;
      if (link.isIntranet) totals.internal = totals.internal + 1;
      if (link.isDisplayForm) totals.displayForm = totals.displayForm + 1;

      if (isRelativeUrl(link.url)) totals.relative = totals.relative + 1;
      else if (/^https?:\/\//i.test(link.url)) totals.absolute = totals.absolute + 1;

      // Only a link into this site could ever have matched a scanned item, so only
      // those are counted as mapped or unmapped; the rest are simply out of scope.
      if (link.linkType !== "thisSite") return;
      totals.mappable = totals.mappable + 1;
      if (link.targetTitle) totals.matched = totals.matched + 1;
      else totals.unmapped = totals.unmapped + 1;
    })
  );

  return totals;
}

export function summariseReferences(references: Reference[], destinations: number): ReferenceTotals {
  const links = references.flatMap((reference) => reference.outgoing ?? []);
  const documents = references.filter((reference) => reference.kind === "document");

  return {
    items: references.length,
    lists: new Set(references.map((reference) => reference.listTitle).filter(Boolean)).size,
    pages: references.filter((reference) => reference.kind === "page").length,
    listItems: references.filter((reference) => reference.kind === "item").length,
    documents: documents.length,
    pdfs: documents.filter((reference) => reference.extension === "pdf").length,
    docx: documents.filter((reference) => reference.extension === "docx").length,
    scanned: references.filter((reference) => reference.scanned).length,
    documentsRead: references.filter((reference) => reference.documentScanned).length,
    incoming: references.reduce((total, reference) => total + (reference.incoming ?? []).length, 0),
    outgoing: links.length,
    webpart: links.filter((link) => link.source === "webpart").length,
    navigation: links.filter((link) => link.source === "navigation").length,
    documentLinks: links.filter((link) => link.source === "document").length,
    attachments: references.filter((reference) => reference.kind === "attachment").length,
    attachmentLinks: links.filter((link) => link.source === "attachment").length,
    configFiles: references.filter((reference) => reference.kind === "config").length,
    configLinks: links.filter((link) => link.source === "config").length,
    megaMenuLinks: links.filter((link) => link.source === "megamenu").length,
    external: links.filter((link) => link.isExternal).length,
    broken: links.filter((link) => link.broken === "yes").length,
    untested: links.filter((link) => link.broken === "unsure").length,
    destinations,
    orphans: references.filter(
      (reference) => reference.kind !== "navigation" && (reference.incoming ?? []).length === 0
    ).length,
  };
}

export function statusLabel(broken: BrokenState): string {
  if (broken === "yes") return LinkAuditContent.status.yes;
  if (broken === "unsure") return LinkAuditContent.status.unsure;
  return LinkAuditContent.status.no;
}

export function sourceLabel(source: LinkSource): string {
  return LinkAuditContent.sources[source];
}

/** Everything worth flagging on one scanned item, used by the table and the dialog. */
export function flagsFor(reference: Reference): string[] {
  const links = reference.outgoing ?? [];
  const flags: string[] = [];

  if (reference.brokenCount > 0) flags.push(LinkAuditContent.flags.broken);
  if (links.some((link) => link.isLegacy)) flags.push(LinkAuditContent.flags.legacy);
  if (links.some((link) => link.isInsecure)) flags.push(LinkAuditContent.flags.insecure);
  if (links.some((link) => `${link.text ?? ""}`.trim().length === 0)) flags.push(LinkAuditContent.flags.emptyText);
  if (reference.kind !== "navigation" && (reference.incoming ?? []).length === 0) {
    flags.push(LinkAuditContent.flags.orphan);
  }

  return flags;
}

export function brokenUsages(links: AggregatedLink[]): LinkUsage[] {
  return links.filter((link) => link.broken === "yes").flatMap((link) => link.usages);
}

/** Why a link is still unproven, which is the first thing anyone asks of the count. */
export function untestedReason(link: OutgoingLink, checked: boolean): string {
  if (link.broken !== "unsure") return "";
  if (link.linkType === "external") return LinkAuditContent.reasons.external;
  if (link.linkType === "share") return LinkAuditContent.reasons.share;
  if (!checked) return LinkAuditContent.reasons.notChecked;
  if (link.status === 0) return LinkAuditContent.reasons.noAnswer;
  return LinkAuditContent.reasons.unknown;
}

export function untestedUsages(links: AggregatedLink[]): LinkUsage[] {
  return links.filter((link) => link.broken === "unsure").flatMap((link) => link.usages);
}

export function externalUsages(links: AggregatedLink[]): LinkUsage[] {
  return links.filter((link) => link.linkType === "external").flatMap((link) => link.usages);
}

export function sourceUsages(links: AggregatedLink[], source: LinkSource): LinkUsage[] {
  return links.flatMap((link) => link.usages).filter((usage) => usage.link.source === source);
}

export function buildView(data: Partial<LinkAuditData> | undefined, origin: string): LinkAuditView {
  const references = data?.references ?? [];
  const links = aggregateLinks(references, origin);
  const totals = summariseReferences(references, links.length);
  const linkTypes = summariseLinkTypes(references);
  const flat = references.flatMap((reference) => reference.outgoing ?? []);

  return {
    totals,
    linkTypes,
    references,
    links,
    broken: brokenUsages(links),
    byType: LINK_TYPES.map((type) => ({ label: type, value: linkTypes[type] })).filter((point) => point.value > 0),
    external: externalUsages(links),
    megaMenu: sourceUsages(links, "megamenu"),
    checkedUrls: data?.checkedUrls ?? 0,
    untested: untestedUsages(links),
    bySource: (["content", "webpart", "navigation", "document", "attachment", "config", "megamenu"] as LinkSource[])
      .map((source) => ({
        label: sourceLabel(source),
        value: flat.filter((link) => link.source === source).length,
      }))
      .filter((point) => point.value > 0),
    byStatus: [
      { label: LinkAuditContent.status.no, value: flat.filter((link) => link.broken === "no").length },
      { label: LinkAuditContent.status.yes, value: totals.broken },
      { label: LinkAuditContent.status.unsure, value: totals.untested },
    ].filter((point) => point.value > 0),
    brokenByList: countBy(
      references.filter((reference) => reference.brokenCount > 0).map((reference) => reference.listTitle)
    ).slice(0, 12),
    topTargets: topDestinations(links),
  };
}

/**
 * Most linked counts destinations, so a query string or a fragment is noise: three
 * links to the same page with different anchors are three links to one page. Links
 * with nothing to point at, such as a bare fragment, are left out entirely.
 */
function topDestinations(links: AggregatedLink[]): { label: string; value: number }[] {
  const totals = new Map<string, { label: string; value: number }>();

  links.forEach((link) => {
    if (link.linkType === "anchor" || link.linkType === "contact" || link.linkType === "script") return;

    const key = stripUrlSuffix(link.key);
    if (!key || key === "/") return;

    const entry = totals.get(key) ?? { label: link.targetTitle || key, value: 0 };
    // A resolved title beats a url, whichever spelling carried it.
    if (link.targetTitle) entry.label = link.targetTitle;
    entry.value = entry.value + link.count;
    totals.set(key, entry);
  });

  return [...totals.values()].sort((first, second) => second.value - first.value).slice(0, 12);
}

function countBy(values: string[]): { label: string; value: number }[] {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));

  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((first, second) => second.value - first.value);
}
