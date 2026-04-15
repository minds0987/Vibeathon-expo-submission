// Metrics grid component
// Validates: Requirements 11.1, 11.2, 11.3, 11.4

'use client';

import React from 'react';
import { MetricCard } from './MetricCard';
import { useMetrics } from '@/hooks/useMetrics';
import { Order, StaffTask } from '@/types';

export interface MetricsGridProps {
  orders: Order[];
  tasks: StaffTask[];
}

export function MetricsGrid({ orders, tasks }: MetricsGridProps) {
  const metrics = useMetrics(orders, tasks);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Total Revenue"
        value={metrics.totalRevenue}
        formatAsCurrency
      />
      <MetricCard
        label="Active Orders"
        value={metrics.activeOrders}
      />
      <MetricCard
        label="Avg Wait Time"
        value={metrics.averageWaitTime.toFixed(1)}
        unit="min"
      />
      <MetricCard
        label="Pending Tasks"
        value={metrics.pendingTasks}
      />
    </div>
  );
}
