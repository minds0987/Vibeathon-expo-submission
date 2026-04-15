'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { ErrorBadge } from '@/components/ui/ErrorBadge';
import { useInventory } from '@/hooks/useInventory';

export default function StockAlerts() {
  const { inventory, loading, error } = useInventory();

  if (loading) {
    return <SkeletonLoader className="h-48" />;
  }

  if (error) {
    return <ErrorBadge message={error} />;
  }

  // Filter items below reorder point
  const atRiskItems = inventory?.filter(
    (item) => item.stockLevel < item.reorderPoint
  ) || [];

  if (atRiskItems.length === 0) {
    return (
      <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Badge variant="success">All Good</Badge>
          <span className="text-sm text-green-300">
            All inventory levels are healthy
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="danger">Alert</Badge>
        <h3 className="font-semibold text-red-200">
          At Risk Items ({atRiskItems.length})
        </h3>
      </div>
      <ul className="space-y-2">
        {atRiskItems.map((item) => (
          <li key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-red-300">{item.itemName}</span>
            <span className="text-red-400 font-medium">
              {item.stockLevel.toFixed(1)}% (Reorder at {item.reorderPoint}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
