export interface ImageFile {
  siteUrl: string;
  listTitle: string;
  name: string;
  url: string;
  extension: string;
  sizeBytes: number;
  modified: string;
}

export interface ImageUsage {
  siteUrl: string;
  source: "page" | "item";
  listTitle: string;
  itemId: number;
  title: string;
  pageUrl: string;
  src: string;
  path: string;
  alt: string;
  hasAlt: boolean;
  width: string;
  height: string;
  isExternal: boolean;
}
