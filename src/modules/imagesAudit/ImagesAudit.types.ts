import { ImageFile, ImageUsage } from "@/api/Images.types";

export interface ImagesAuditConfig {
  maxPages: number;
  scanListItems: boolean;
  columnNames: string;
  autoDetectColumns: boolean;
  maxItemsPerList: number;
  maxLists: number;
  scanLibraries: boolean;
  maxFilesPerLibrary: number;
  largeImageKb: number;
}

export interface ImagesAuditData {
  files: ImageFile[];
  usages: ImageUsage[];
  scannedSites: string[];
}

export interface ImageFileView extends ImageFile {
  useCount: number;
  duplicateKey: string;
  isDuplicate: boolean;
  /** How sure the match is: same bytes and name, or only one of the two. */
  duplicateConfidence: "certain" | "likely" | "possible" | "none";
  /** Files this one appears to duplicate. */
  duplicateOf: string[];
  isUnused: boolean;
  isOversized: boolean;
  isLegacyFormat: boolean;
}

export interface ImagesTotals {
  files: number;
  storageBytes: number;
  usages: number;
  usedFiles: number;
  unusedFiles: number;
  unusedBytes: number;
  duplicateFiles: number;
  duplicateBytes: number;
  missingAlt: number;
  externalImages: number;
  oversized: number;
  legacyFormats: number;
  averageBytes: number;
  formats: number;
}

export interface ImagesAuditView {
  totals: ImagesTotals;
  filesByFormat: { label: string; value: number }[];
  storageByFormat: { label: string; value: number }[];
  usageByPage: { label: string; value: number }[];
  altSplit: { label: string; value: number }[];
  sizeBuckets: { label: string; value: number }[];
  usageSplit: { label: string; value: number }[];
  files: ImageFileView[];
  duplicates: ImageFileView[];
  unused: ImageFileView[];
}
