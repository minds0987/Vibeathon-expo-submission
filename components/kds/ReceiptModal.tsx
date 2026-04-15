'use client';

import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Order } from '@/types';
import { generateReceipt, downloadReceipt, printReceipt } from '@/lib/receipt';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

export function ReceiptModal({ order, onClose }: ReceiptModalProps) {
  const barcodeRef = useRef<HTMLCanvasElement>(null);
  const receipt = generateReceipt(order);

  useEffect(() => {
    // Generate barcode using canvas
    if (barcodeRef.current) {
      const canvas = barcodeRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Simple barcode visualization
        const barWidth = 3;
        const barHeight = 60;
        const orderId = order.id;
        
        canvas.width = orderId.length * barWidth * 3;
        canvas.height = barHeight + 30;
        
        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw bars
        ctx.fillStyle = '#000000';
        orderId.split('').forEach((char, index) => {
          const code = char.charCodeAt(0);
          const x = index * barWidth * 3;
          
          // Alternate pattern based on character code
          if (code % 2 === 0) {
            ctx.fillRect(x, 0, barWidth, barHeight);
            ctx.fillRect(x + barWidth * 2, 0, barWidth, barHeight);
          } else {
            ctx.fillRect(x + barWidth, 0, barWidth, barHeight);
          }
        });
        
        // Draw order ID text below barcode
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(orderId, canvas.width / 2, barHeight + 20);
      }
    }
  }, [order.id]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-100">Order Receipt</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Barcode Display */}
          <div className="bg-white p-4 rounded-lg flex flex-col items-center">
            <canvas ref={barcodeRef} className="mb-2" />
            <p className="text-xs text-gray-600 text-center">
              Scan this barcode with the Kitchen Display Scanner
            </p>
          </div>

          {/* Receipt Content */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
              {receipt}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              variant="secondary"
              onClick={() => downloadReceipt(order)}
              className="flex-1"
            >
              📄 Download
            </Button>
            <Button
              variant="primary"
              onClick={() => printReceipt(order)}
              className="flex-1"
            >
              🖨️ Print
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
