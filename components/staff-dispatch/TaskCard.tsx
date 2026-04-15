// Task card component
// Validates: Requirements 4.1

import React from 'react';
import { Card } from '@/components/ui/Card';
import { TaskStatusBadge } from './TaskStatusBadge';
import { StaffTask } from '@/types';

export interface TaskCardProps {
  task: StaffTask;
}

export function TaskCard({ task }: TaskCardProps) {
  const priorityColor = {
    high: 'text-red-400',
    medium: 'text-amber-400',
    low: 'text-gray-400',
  };

  return (
    <Card>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                {task.taskType}
              </span>
              <span className={`text-xs font-semibold ${priorityColor[task.priority]}`}>
                {task.priority.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-300">{task.description}</p>
          </div>
          <TaskStatusBadge status={task.status} />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {task.assignedTo ? `Assigned to: ${task.assignedTo}` : 'Unassigned'}
          </span>
          <span>{new Date(task.createdAt).toLocaleTimeString()}</span>
        </div>
      </div>
    </Card>
  );
}
