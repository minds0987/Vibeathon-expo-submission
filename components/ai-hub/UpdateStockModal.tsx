'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InventoryItem } from '@/types';

interface UpdateStockModalProps {
  item: InventoryItem;
  onClose: () => void;
  onUpdate: (itemId: string, newStockLevel: number) => Promise<void>;
}

export function UpdateStockModal({ item, onClose, onUpdate }: UpdateStockModalProps) {
  const [stockLevel, setStockLevel] = useState(item.stockLevel);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    if (stockLevel < 0 || stockLevel > 100) {
      setError('Stock level must be between 0 and 100');
      return;
    }

    setUpdating(true);
    setError(null);
    try {
      await onUpdate(item.id, stockLevel);
      onClose();
    } catch (err) {
      console.error('Failed to update stock:', err);
      setError(err instanceof Error ? err.message : 'Failed to update stock');
    } finally {
      setUpdating(false);
    }
  };

  const adjustStock = (amount: number) => {
    const newLevel = Math.max(0, Math.min(100, stockLevel + amount));
    setStockLevel(newLevel);
  };

  const getStockStatus = () => {
    if (stockLevel === 0) return { color: 'text-red-500', label: 'OUT OF STOCK' };
    if (stockLevel < 10) return { color: 'text-red-400', label: 'CRITICAL' };
    if (stockLevel < 30) return { color: 'text-orange-400', label: 'LOW' };
    if (stockLevel < 50) return { color: 'text-yellow-400', label: 'MEDIUM' };
    return { color: 'text-green-400', label: 'GOOD' };
  };

  const status = getStockStatus();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-100">Update Stock</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Item Info */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">{item.itemName}</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Unit: {item.unit}</span>
              <span className="text-gray-400">Reorder at: {item.reorderPoint}%</span>
            </div>
          </div>

          {/* Current Stock Display */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Current Stock Level</p>
            <div className="text-6xl font-bold text-gray-100 mb-2">
              {stockLevel.toFixed(0)}%
            </div>
            <p className={`text-sm font-semibold ${status.color}`}>
              {status.label}
            </p>
          </div>

          {/* Stock Level Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Adjust Stock Level
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={stockLevel}
              onChange={(e) => setStockLevel(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-lime-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Quick Adjust Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quick Adjust
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => adjustStock(-10)}
                className="px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded text-sm font-medium"
              >
                -10%
              </button>
              <button
                onClick={() => adjustStock(-5)}
                className="px-3 py-2 bg-orange-700 hover:bg-orange-600 text-white rounded text-sm font-medium"
              >
                -5%
              </button>
              <button
                onClick={() => adjustStock(5)}
                className="px-3 py-2 bg-green-700 hover:bg-green-600 text-white rounded text-sm font-medium"
              >
                +5%
              </button>
              <button
                onClick={() => adjustStock(10)}
                className="px-3 py-2 bg-lime-700 hover:bg-lime-600 text-white rounded text-sm font-medium"
              >
                +10%
              </button>
            </div>
          </div>

          {/* Manual Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Or Enter Exact Value
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={stockLevel}
              onChange={(e) => setStockLevel(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-lime-400"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
              <p className="text-sm text-red-300">❌ {error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdate}
              className="flex-1"
              disabled={updating || stockLevel === item.stockLevel}
            >
              {updating ? 'Updating...' : 'Update Stock'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
