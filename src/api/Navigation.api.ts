import "@pnp/sp/navigation";
import { getSp } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { NavigationLink } from "@/api/Links.types";

interface NavNode {
  Id: number;
  Title?: string;
  Url?: string;
  Children?: NavNode[];
}

/** Menus are shallow in practice, so the walk stops rather than chasing a loop. */
const MAX_DEPTH = 4;

export function SiteNavigation(webUrl?: string): {
  links(): Promise<NavigationLink[]>;
} {
  return {
    /**
     * Navigation is a link source with no page of its own, so it is scanned like any
     * other content and folded in as one synthetic reference.
     */
    async links(): Promise<NavigationLink[]> {
      const [quickLaunch, topNav] = await Promise.all([
        nodes(webUrl, "quicklaunch"),
        nodes(webUrl, "topNavigationBar"),
      ]);

      return [...flatten(quickLaunch, "Quick launch", []), ...flatten(topNav, "Top navigation", [])];
    },
  };
}

async function nodes(webUrl: string | undefined, menu: "quicklaunch" | "topNavigationBar"): Promise<NavNode[]> {
  try {
    return (await throttled(
      () => getSp(webUrl).web.navigation[menu].expand("Children")(),
      { label: `Navigation.${menu}` }
    )) as NavNode[];
  } catch {
    // A site with navigation switched off is not a scan failure.
    return [];
  }
}

function flatten(list: NavNode[], menu: string, trail: string[], depth = 0): NavigationLink[] {
  if (depth >= MAX_DEPTH) return [];

  return list.flatMap((node) => {
    const title = node.Title ?? "Untitled";
    const path = [...trail, title];
    const self: NavigationLink[] = node.Url
      ? [{ url: node.Url, text: title, path: path.join(" > "), menu }]
      : [];

    return [...self, ...flatten(node.Children ?? [], menu, path, depth + 1)];
  });
}
