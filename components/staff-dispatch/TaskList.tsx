// Task list component
// Validates: Requirements 4.1

import React from 'react';
import { TaskCard } from './TaskCard';
import { StaffTask } from '@/types';

export interface TaskListProps {
  tasks: StaffTask[];
}

export function TaskList({ tasks }: TaskListProps) {
  // Sort by priority (high > medium > low)
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedTasks = [...tasks].sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  if (sortedTasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No tasks found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
