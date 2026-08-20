import * as React from "react";
import { Dialog, DialogFooter, DialogType } from "@fluentui/react/lib/Dialog";
import { ModalProps } from "@/components/Components.types";

const WIDTHS = { small: 420, medium: 560, large: 760 };

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  description,
  onDismiss,
  footer,
  children,
  width = "medium",
}) => (
  <Dialog
    hidden={!open}
    onDismiss={onDismiss}
    minWidth={WIDTHS[width]}
    maxWidth={WIDTHS[width]}
    dialogContentProps={{ type: DialogType.normal, title, subText: description }}
    modalProps={{ isBlocking: true }}
  >
    {children}
    {footer ? <DialogFooter>{footer}</DialogFooter> : undefined}
  </Dialog>
);
