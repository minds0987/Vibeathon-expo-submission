'use client';

import React, { memo } from 'react';
import InventoryProgressBar from './InventoryProgressBar';
import { Badge } from '@/components/ui/Badge';
import type { InventoryItem as InventoryItemType } from '@/types';

interface InventoryItemProps {
  item: InventoryItemType;
}

const InventoryItem = memo(function InventoryItem({ item }: InventoryItemProps) {
  const isBelowReorderPoint = item.stockLevel < item.reorderPoint;

  return (
    <div className="p-4 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors bg-gray-800">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-100">{item.itemName}</h3>
          <p className="text-sm text-gray-300">
            {item.stockLevel.toFixed(1)}% / {item.unit}
          </p>
        </div>
        {isBelowReorderPoint && (
          <Badge variant="danger">Low Stock</Badge>
        )}
      </div>
      <InventoryProgressBar stockLevel={item.stockLevel} />
      <p className="text-xs text-gray-400 mt-1">
        Reorder at: {item.reorderPoint}%
      </p>
    </div>
  );
});

export default InventoryItem;
