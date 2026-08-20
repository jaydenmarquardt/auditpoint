import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { ImagesAuditContent } from "@/modules/imagesAudit/ImagesAudit.content";
import { ImageFileView } from "@/modules/imagesAudit/ImagesAudit.types";
import { fileColumns } from "@/modules/imagesAudit/ImagesAudit.columns";

export const FilesTab: React.FC<{
  files: ImageFileView[];
  emptyTitle?: string;
  emptyDescription?: string;
}> = ({ files, emptyTitle, emptyDescription }) => {
  if (files.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? ImagesAuditContent.empty.title}
        description={emptyDescription ?? ImagesAuditContent.empty.description}
        iconName={emptyTitle ? "CheckMark" : "Photo2"}
      />
    );
  }

  return (
    <Table
      ariaLabel={ImagesAuditContent.tabs.files}
      rows={files}
      columns={fileColumns}
      getRowKey={(file) => file.url}
      initialSortKey="size"
      initialSortDescending
      searchValue={(file) => `${file.name} ${file.url} ${file.listTitle}`}
      searchLabel={ImagesAuditContent.search.files}
    />
  );
};
