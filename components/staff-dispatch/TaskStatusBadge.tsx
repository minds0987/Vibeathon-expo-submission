// Task status badge component
// Validates: Requirements 4.1

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { StaffTask } from '@/types';

export interface TaskStatusBadgeProps {
  status: StaffTask['status'];
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const variantMap: Record<StaffTask['status'], 'info' | 'warning' | 'success'> = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
  };

  return (
    <Badge variant={variantMap[status]}>
      {status.replace('_', ' ').toUpperCase()}
    </Badge>
  );
}
