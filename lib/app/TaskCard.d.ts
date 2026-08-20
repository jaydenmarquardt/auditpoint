import * as React from "react";
import { QueueTask } from "../core/queue/Queue.types";
export interface TaskCardProps {
    task: QueueTask;
    onViewError: (task: QueueTask) => void;
    compact?: boolean;
}
export declare const TaskCard: React.FC<TaskCardProps>;
//# sourceMappingURL=TaskCard.d.ts.map