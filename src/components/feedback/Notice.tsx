import * as React from "react";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { NoticeProps, NoticeTone } from "@/components/Components.types";



const TYPES: Record<NoticeTone, MessageBarType> = {
  info: MessageBarType.info,
  success: MessageBarType.success,
  warning: MessageBarType.warning,
  error: MessageBarType.error,
};

export const Notice: React.FC<NoticeProps> = ({ tone = "info", message, onDismiss, actions }) => (
  <MessageBar
    messageBarType={TYPES[tone]}
    onDismiss={onDismiss}
    actions={actions ? <div>{actions}</div> : undefined}
    isMultiline={false}
    dismissButtonAriaLabel="Dismiss message"
  >
    {message}
  </MessageBar>
);
