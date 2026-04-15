'use client';

import React from 'react';
import DemandChart from '@/components/ai-hub/DemandChart';
import InventoryList from '@/components/ai-hub/InventoryList';
import StockAlerts from '@/components/ai-hub/StockAlerts';
import { Button } from '@/components/ui/Button';
import { useInventory } from '@/hooks/useInventory';
import { exportBuyListToPDF } from '@/lib/pdfExport';

export default function AIHub() {
  const { inventory } = useInventory();

  const handleDownloadBuyList = () => {
    if (inventory) {
      exportBuyListToPDF(inventory);
    }
  };

  const handlePrintBuyList = () => {
    if (inventory) {
      exportBuyListToPDF(inventory);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">AI Hub</h1>
        <p className="text-gray-300 mt-1">
          Demand forecasting and inventory management
        </p>
      </div>

      {/* Stock Alerts */}
      <StockAlerts />

      {/* Demand Chart */}
      <DemandChart />

      {/* Inventory List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-100">
            Inventory Status
          </h2>
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleDownloadBuyList}
            >
              📋 Export Buy List (PDF)
            </Button>
          </div>
        </div>
        <InventoryList />
      </div>
    </div>
  );
}
