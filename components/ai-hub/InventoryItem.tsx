'use client';

import React, { memo, useState } from 'react';
import InventoryProgressBar from './InventoryProgressBar';
import { Badge } from '@/components/ui/Badge';
import type { InventoryItem as InventoryItemType } from '@/types';
import { UpdateStockModal } from './UpdateStockModal';

interface InventoryItemProps {
  item: InventoryItemType;
  onUpdateStock: (itemId: string, newStockLevel: number) => Promise<void>;
}

const InventoryItem = memo(function InventoryItem({ item, onUpdateStock }: InventoryItemProps) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const isBelowReorderPoint = item.stockLevel < item.reorderPoint;
  const isCriticallyLow = item.stockLevel < 30; // Red indicator for < 30%

  return (
    <>
      <div className={`p-4 border rounded-lg hover:border-gray-600 transition-colors ${
        isCriticallyLow 
          ? 'bg-red-900/20 border-red-700' 
          : 'bg-gray-800 border-gray-700'
      }`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className={`font-semibold ${isCriticallyLow ? 'text-red-200' : 'text-gray-100'}`}>
              {item.itemName}
            </h3>
            <p className={`text-sm ${isCriticallyLow ? 'text-red-300' : 'text-gray-300'}`}>
              {item.stockLevel.toFixed(1)}% / {item.unit}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isBelowReorderPoint && (
              <Badge variant="danger">Low Stock</Badge>
            )}
            <button
              onClick={() => setShowUpdateModal(true)}
              className="px-2 py-1 text-xs bg-lime-700 hover:bg-lime-600 text-white rounded transition-colors"
              title="Update Stock"
            >
              ✏️ Edit
            </button>
          </div>
        </div>
        <InventoryProgressBar stockLevel={item.stockLevel} />
        <p className="text-xs text-gray-400 mt-1">
          Reorder at: {item.reorderPoint}%
        </p>
        {isCriticallyLow && (
          <p className="text-xs text-red-400 mt-2 font-semibold">
            ⚠️ Critical: Below 30% stock level
          </p>
        )}
      </div>

      {showUpdateModal && (
        <UpdateStockModal
          item={item}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={onUpdateStock}
        />
      )}
    </>
  );
});

export default InventoryItem;
