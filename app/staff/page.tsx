// Staff Dispatch page
// Validates: Requirements 4.1

'use client';

import React, { useState } from 'react';
import { TaskFilters } from '@/components/staff-dispatch/TaskFilters';
import { TaskList } from '@/components/staff-dispatch/TaskList';
import { useStaffTasks } from '@/hooks/useStaffTasks';
import { StaffTask } from '@/types';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { ErrorBadge } from '@/components/ui/ErrorBadge';

export default function StaffDispatch() {
  const { tasks, loading, error } = useStaffTasks();
  const [statusFilter, setStatusFilter] = useState<StaffTask['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<StaffTask['priority'] | 'all'>('all');

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Staff Dispatch</h1>
        <SkeletonLoader count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Staff Dispatch</h1>
        <ErrorBadge message={error} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Staff Dispatch</h1>
      
      <TaskFilters
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onStatusFilterChange={setStatusFilter}
        onPriorityFilterChange={setPriorityFilter}
      />
      
      <TaskList tasks={filteredTasks} />
    </div>
  );
}
