'use client';

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useOrders } from '@/hooks/useOrders';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { ErrorBadge } from '@/components/ui/ErrorBadge';

export default function DemandChart() {
  const { orders, loading, error } = useOrders();

  // Calculate demand data by hour
  const demandData = useMemo(() => {
    if (!orders) return [];

    const hourlyData: Record<number, { projected: number; actual: number }> = {};

    // Initialize 24 hours
    for (let hour = 0; hour < 24; hour++) {
      hourlyData[hour] = { projected: 0, actual: 0 };
    }

    // Calculate projected demand (historical average - simplified)
    // In production, this would use historical data
    const baseProjection = [2, 1, 1, 1, 2, 3, 5, 8, 10, 12, 15, 18, 20, 18, 15, 12, 10, 15, 20, 25, 22, 18, 12, 5];
    baseProjection.forEach((count, hour) => {
      hourlyData[hour].projected = count;
    });

    // Calculate actual demand from current day orders
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const hour = orderDate.getHours();
      hourlyData[hour].actual += 1;
    });

    // Convert to array format for Recharts
    return Object.entries(hourlyData).map(([hour, data]) => ({
      hour: `${hour.padStart(2, '0')}:00`,
      hourNum: parseInt(hour),
      projected: data.projected,
      actual: data.actual,
      isHighDemand: data.actual > data.projected * 1.2,
    }));
  }, [orders]);

  if (loading) {
    return <SkeletonLoader className="h-80" />;
  }

  if (error) {
    return <ErrorBadge message={error} />;
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Demand Forecast vs Actual
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={demandData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 12 }}
            interval={2}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="projected"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Projected"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#10b981"
            strokeWidth={2}
            name="Actual"
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              if (payload.isHighDemand) {
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="#ef4444"
                    stroke="#dc2626"
                    strokeWidth={2}
                  />
                );
              }
              return <circle cx={cx} cy={cy} r={3} fill="#10b981" />;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-600">High demand ({">"} 120% projected)</span>
        </div>
      </div>
    </div>
  );
}
