// Kitchen Display System page
// Validates: Requirements 5.1

'use client';

import React, { useState } from 'react';
import { KanbanBoard } from '@/components/kds/KanbanBoard';
import { CreateOrderModal } from '@/components/kds/CreateOrderModal';
import { OrderScanner } from '@/components/kds/OrderScanner';
import { CameraScanner } from '@/components/kds/CameraScanner';
import { useOrders } from '@/hooks/useOrders';
import { OrderStatus } from '@/types';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { ErrorBadge } from '@/components/ui/ErrorBadge';
import { Button } from '@/components/ui/Button';
import { useKitchenOSStore } from '@/store';
import { calculatePriorityScore } from '@/lib/calculations';

export default function KitchenDisplay() {
  const { orders, loading, error, updateOrderStatus, addOrder } = useOrders();
  const { manualOverrideMode, setManualOverrideMode } = useKitchenOSStore();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showCameraScanner, setShowCameraScanner] = useState(false);

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

  const handleCreateOrder = async (tableNumber: number, items: Array<{ name: string; quantity: number; prepTime: number }>) => {
    const newOrder = {
      tableNumber,
      items,
      status: 'pending' as OrderStatus,
      priorityScore: 0,
      createdAt: new Date().toISOString(),
      startedAt: null,
      dispatchedAt: null,
      countdownTimer: null,
    };

    // Calculate priority score
    newOrder.priorityScore = calculatePriorityScore(newOrder as any);

    await addOrder(newOrder);
  };

  const handleScan = async (orderId: string, newStatus: OrderStatus) => {
    await handleOrderMove(orderId, newStatus);
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
      <div className="flex items-center justify-between flex-wrap gap-4">
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
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            ➕ New Order
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowScanner(true)}
          >
            ⌨️ Manual Scanner
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowCameraScanner(true)}
          >
            📷 Camera Scanner
          </Button>
          <Button
            variant={manualOverrideMode ? 'danger' : 'secondary'}
            onClick={() => setManualOverrideMode(!manualOverrideMode)}
          >
            {manualOverrideMode ? '🔓 Manual Override ON' : '🔒 Manual Override OFF'}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <KanbanBoard orders={orders} onOrderMove={handleOrderMove} />
      </div>

      {showCreateModal && (
        <CreateOrderModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateOrder}
        />
      )}

      {showScanner && (
        <OrderScanner
          onClose={() => setShowScanner(false)}
          onScan={handleScan}
        />
      )}

      {showCameraScanner && (
        <CameraScanner
          onClose={() => setShowCameraScanner(false)}
          onScan={handleScan}
        />
      )}
    </div>
  );
}
