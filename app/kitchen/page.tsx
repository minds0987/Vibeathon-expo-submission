// Kitchen Display System page
// Validates: Requirements 5.1

'use client';

import React, { useState } from 'react';
import { KanbanBoard } from '@/components/kds/KanbanBoard';
import { useOrders } from '@/hooks/useOrders';
import { OrderStatus } from '@/types';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { ErrorBadge } from '@/components/ui/ErrorBadge';
import { Button } from '@/components/ui/Button';
import { useKitchenOSStore } from '@/store';

export default function KitchenDisplay() {
  const { orders, loading, error, updateOrderStatus } = useOrders();
  const { manualOverrideMode, setManualOverrideMode } = useKitchenOSStore();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleOrderMove = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);
      
      console.log(`[KitchenDisplay] Moving order ${orderId} to ${newStatus}`);
      await updateOrderStatus(orderId, newStatus);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      console.log(`[KitchenDisplay] Successfully moved order ${orderId} to ${newStatus}`);
    } catch (err) {
      console.error('[KitchenDisplay] Failed to update order status:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes');
      setTimeout(() => setSaveError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Kitchen Display</h1>
        <SkeletonLoader count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Kitchen Display</h1>
        <ErrorBadge message={error} />
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Kitchen Display</h1>
          {saving && (
            <span className="text-sm text-blue-400 animate-pulse">💾 Saving...</span>
          )}
          {saveSuccess && (
            <span className="text-sm text-green-400">✅ Saved to database</span>
          )}
          {saveError && (
            <span className="text-sm text-red-400">❌ {saveError}</span>
          )}
        </div>
        <Button
          variant={manualOverrideMode ? 'danger' : 'secondary'}
          onClick={() => setManualOverrideMode(!manualOverrideMode)}
        >
          {manualOverrideMode ? '🔓 Manual Override ON' : '🔒 Manual Override OFF'}
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <KanbanBoard orders={orders} onOrderMove={handleOrderMove} />
      </div>
    </div>
  );
}
