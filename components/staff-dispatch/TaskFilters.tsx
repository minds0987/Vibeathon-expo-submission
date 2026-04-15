// Task filters component
// Validates: Requirements 4.1

'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { StaffTask } from '@/types';

export interface TaskFiltersProps {
  statusFilter: StaffTask['status'] | 'all';
  priorityFilter: StaffTask['priority'] | 'all';
  onStatusFilterChange: (status: StaffTask['status'] | 'all') => void;
  onPriorityFilterChange: (priority: StaffTask['priority'] | 'all') => void;
}

export function TaskFilters({
  statusFilter,
  priorityFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
}: TaskFiltersProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-400 mb-2 block">Status</label>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'primary' : 'secondary'}
            onClick={() => onStatusFilterChange('all')}
            className="text-sm"
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'primary' : 'secondary'}
            onClick={() => onStatusFilterChange('pending')}
            className="text-sm"
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'in_progress' ? 'primary' : 'secondary'}
            onClick={() => onStatusFilterChange('in_progress')}
            className="text-sm"
          >
            In Progress
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'primary' : 'secondary'}
            onClick={() => onStatusFilterChange('completed')}
            className="text-sm"
          >
            Completed
          </Button>
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-2 block">Priority</label>
        <div className="flex gap-2">
          <Button
            variant={priorityFilter === 'all' ? 'primary' : 'secondary'}
            onClick={() => onPriorityFilterChange('all')}
            className="text-sm"
          >
            All
          </Button>
          <Button
            variant={priorityFilter === 'high' ? 'primary' : 'secondary'}
            onClick={() => onPriorityFilterChange('high')}
            className="text-sm"
          >
            High
          </Button>
          <Button
            variant={priorityFilter === 'medium' ? 'primary' : 'secondary'}
            onClick={() => onPriorityFilterChange('medium')}
            className="text-sm"
          >
            Medium
          </Button>
          <Button
            variant={priorityFilter === 'low' ? 'primary' : 'secondary'}
            onClick={() => onPriorityFilterChange('low')}
            className="text-sm"
          >
            Low
          </Button>
        </div>
      </div>
    </div>
  );
}
