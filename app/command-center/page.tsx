// Command Center page
// Validates: Requirements 11.1, 8.1, 9.1

'use client';

import React from 'react';
import { MetricsGrid } from '@/components/command-center/MetricsGrid';
import { PipelineLogFeed } from '@/components/command-center/PipelineLogFeed';
import { ManualOverrideToggle } from '@/components/command-center/ManualOverrideToggle';
import { useOrders } from '@/hooks/useOrders';
import { useStaffTasks } from '@/hooks/useStaffTasks';
import { usePipelineLogs } from '@/hooks/usePipelineLogs';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { ErrorBadge } from '@/components/ui/ErrorBadge';

export default function CommandCenter() {
  const { orders, loading: ordersLoading, error: ordersError } = useOrders();
  const { tasks, loading: tasksLoading, error: tasksError } = useStaffTasks();
  const { logs, loading: logsLoading, error: logsError } = usePipelineLogs();

  if (ordersLoading || tasksLoading || logsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Command Center</h1>
        <SkeletonLoader count={5} />
      </div>
    );
  }

  if (ordersError || tasksError || logsError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Command Center</h1>
        <ErrorBadge message={ordersError || tasksError || logsError || 'Unknown error'} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Command Center</h1>
      
      <MetricsGrid orders={orders} tasks={tasks} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PipelineLogFeed logs={logs} />
        </div>
        
        <div>
          <ManualOverrideToggle />
        </div>
      </div>
    </div>
  );
}
