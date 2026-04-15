'use client';

import React from 'react';
import DemandChart from '@/components/ai-hub/DemandChart';
import InventoryList from '@/components/ai-hub/InventoryList';
import StockAlerts from '@/components/ai-hub/StockAlerts';

export default function AIHub() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Hub</h1>
        <p className="text-gray-600 mt-1">
          Demand forecasting and inventory management
        </p>
      </div>

      {/* Stock Alerts */}
      <StockAlerts />

      {/* Demand Chart */}
      <DemandChart />

      {/* Inventory List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Inventory Status
        </h2>
        <InventoryList />
      </div>
    </div>
  );
}
