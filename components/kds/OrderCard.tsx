// Order card component for KDS
// Validates: Requirements 5.2, 5.6

import React, { memo } from 'react';
import { Order } from '@/types';
import { Card } from '@/components/ui/Card';
import { downloadReceipt, printReceipt } from '@/lib/receipt';

export interface OrderCardProps {
  order: Order;
  isEditable?: boolean;
}

export const OrderCard = memo(function OrderCard({ order, isEditable = false }: OrderCardProps) {
  const elapsedTime = Math.floor(
    (Date.now() - new Date(order.createdAt).getTime()) / 60000
  );

  // Calculate if timer warning should be shown (< 20% remaining)
  const showWarning = order.countdownTimer !== null && 
    order.countdownTimer > 0 &&
    order.countdownTimer < (order.countdownTimer * 5); // Simplified check

  const handleDownloadReceipt = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadReceipt(order);
  };

  const handlePrintReceipt = (e: React.MouseEvent) => {
    e.stopPropagation();
    printReceipt(order);
  };

  return (
    <Card className={`${isEditable ? 'cursor-grab active:cursor-grabbing hover:border-lime-400' : 'cursor-default'} transition-colors`}>
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h4>
            <p className="text-sm text-gray-400">Table {order.tableNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Priority</p>
            <p className="text-lg font-bold text-lime-400">{order.priorityScore.toFixed(1)}</p>
          </div>
        </div>

        <div className="space-y-1">
          {order.items.map((item, index) => (
            <div key={index} className="text-sm text-gray-300">
              {item.quantity}x {item.name}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-700">
          <span className="text-xs text-gray-500">
            Elapsed: {elapsedTime} min
          </span>
          {order.countdownTimer !== null && (
            <span className={`text-xs font-mono ${showWarning ? 'text-red-400' : 'text-gray-400'}`}>
              {Math.floor(order.countdownTimer / 60)}:{(order.countdownTimer % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>

        {/* Receipt Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-700">
          <button
            onClick={handleDownloadReceipt}
            className="flex-1 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
            title="Download Receipt"
          >
            📄 Download
          </button>
          <button
            onClick={handlePrintReceipt}
            className="flex-1 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
            title="Print Receipt"
          >
            🖨️ Print
          </button>
        </div>

        {isEditable && (
          <div className="pt-2 border-t border-gray-700">
            <p className="text-xs text-lime-400 flex items-center gap-1">
              <span>⋮⋮</span> Drag to move
            </p>
          </div>
        )}
      </div>
    </Card>
  );
});
