'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface OrderItem {
  name: string;
  quantity: number;
  prepTime: number;
}

interface CreateOrderModalProps {
  onClose: () => void;
  onSubmit: (tableNumber: number, items: OrderItem[]) => Promise<void>;
}

const MENU_ITEMS = [
  { name: 'Ribeye Steak', prepTime: 25 },
  { name: 'Grilled Chicken', prepTime: 15 },
  { name: 'Salmon Fillet', prepTime: 18 },
  { name: 'Pasta Carbonara', prepTime: 12 },
  { name: 'Caesar Salad', prepTime: 8 },
  { name: 'Burger', prepTime: 10 },
  { name: 'Pizza Margherita', prepTime: 15 },
  { name: 'Fish and Chips', prepTime: 18 },
  { name: 'French Fries', prepTime: 5 },
  { name: 'Garlic Bread', prepTime: 5 },
];

export function CreateOrderModal({ onClose, onSubmit }: CreateOrderModalProps) {
  const [tableNumber, setTableNumber] = useState<number>(1);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = (menuItem: typeof MENU_ITEMS[0]) => {
    const existing = selectedItems.find(item => item.name === menuItem.name);
    if (existing) {
      setSelectedItems(selectedItems.map(item =>
        item.name === menuItem.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedItems([...selectedItems, { ...menuItem, quantity: 1 }]);
    }
  };

  const removeItem = (name: string) => {
    setSelectedItems(selectedItems.filter(item => item.name !== name));
  };

  const updateQuantity = (name: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(name);
    } else {
      setSelectedItems(selectedItems.map(item =>
        item.name === name ? { ...item, quantity } : item
      ));
    }
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      setError('Please add at least one item');
      return;
    }

    if (tableNumber < 1) {
      setError('Please enter a valid table number');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(tableNumber, selectedItems);
      onClose();
    } catch (error) {
      console.error('Failed to create order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-100">Create New Order</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Table Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Table Number
            </label>
            <input
              type="number"
              min="1"
              value={tableNumber}
              onChange={(e) => setTableNumber(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-lime-400"
            />
          </div>

          {/* Menu Items */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Items
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.name}
                  onClick={() => addItem(item)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-lime-400 hover:text-lime-400 transition-colors text-left"
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.prepTime} min</div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Items */}
          {selectedItems.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Order Items ({selectedItems.length})
              </label>
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-100">{item.name}</div>
                      <div className="text-xs text-gray-500">Prep time: {item.prepTime} min</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.name, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-gray-100">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.name, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.name)}
                        className="text-red-400 hover:text-red-300 ml-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
              <p className="text-sm text-red-300">
                ❌ {error}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              className="flex-1"
              disabled={submitting || selectedItems.length === 0}
            >
              {submitting ? 'Creating...' : `Create Order (${selectedItems.length} items)`}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
