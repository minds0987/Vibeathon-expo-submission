'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { OrderStatus } from '@/types';

interface OrderScannerProps {
  onClose: () => void;
  onScan: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'quality_check', label: 'Quality Check' },
  { value: 'ready', label: 'Ready' },
  { value: 'dispatched', label: 'Dispatched' },
];

export function OrderScanner({ onClose, onScan }: OrderScannerProps) {
  const [orderId, setOrderId] = useState('');
  const [targetStatus, setTargetStatus] = useState<OrderStatus>('cooking');
  const [scanning, setScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleScan = async () => {
    if (!orderId.trim()) {
      alert('Please enter an order ID');
      return;
    }

    setScanning(true);
    try {
      await onScan(orderId.trim(), targetStatus);
      setOrderId('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('Failed to update order. Please check the order ID and try again.');
    } finally {
      setScanning(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-100">📱 Scan Order</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Order ID or Barcode
              </label>
              <input
                ref={inputRef}
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Scan barcode or enter order ID"
                autoFocus
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-lime-400 font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Use a barcode scanner or type the order ID manually
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Move to Status
              </label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as OrderStatus)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-lime-400"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
              <p className="text-sm text-blue-300">
                <strong>Quick Scan Mode:</strong> Scan an order barcode and press Enter to instantly move it to the selected status.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={scanning}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleScan}
              className="flex-1"
              disabled={scanning || !orderId.trim()}
            >
              {scanning ? 'Processing...' : 'Update Order'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
