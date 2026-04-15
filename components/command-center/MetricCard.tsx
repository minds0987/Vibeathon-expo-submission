// Metric card component
// Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.6

import React from 'react';
import { Card } from '@/components/ui/Card';

export interface MetricCardProps {
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  formatAsCurrency?: boolean;
}

export function MetricCard({ label, value, unit, trend, formatAsCurrency }: MetricCardProps) {
  const formattedValue = formatAsCurrency && typeof value === 'number'
    ? `$${value.toFixed(2)}`
    : value;

  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '';
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : '';

  return (
    <Card>
      <div className="space-y-2">
        <p className="text-sm text-gray-400">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-white">
            {formattedValue}
            {unit && <span className="text-lg text-gray-400 ml-1">{unit}</span>}
          </p>
          {trend && (
            <span className={`text-sm ${trendColor}`}>
              {trendIcon}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
