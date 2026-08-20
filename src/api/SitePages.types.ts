export interface SitePage {
  id: number;
  title: string;
  fileName: string;
  serverRelativeUrl: string;
  modified: string;
  created: string;
  modifiedBy: string;
  pageLayout: string;
  promotedState: number;
}

export interface SitePageRow {
  Id: number;
  Title: string;
  FileLeafRef: string;
  FileRef: string;
  Modified: string;
  Created: string;
  PageLayoutType: string;
  PromotedState?: number;
  Editor?: { Title?: string };
}
