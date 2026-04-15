// Kitchen Display System page
// Validates: Requirements 5.1

'use client';

import React from 'react';
import { KanbanBoard } from '@/components/kds/KanbanBoard';
import { useOrders } from '@/hooks/useOrders';
import { OrderStatus } from '@/types';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { ErrorBadge } from '@/components/ui/ErrorBadge';

export default function KitchenDisplay() {
  const { orders, loading, error, updateOrderStatus } = useOrders();

  const handleOrderMove = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error('Failed to update order status:', err);
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
      <h1 className="text-3xl font-bold">Kitchen Display</h1>
      
      <div className="flex-1 overflow-hidden">
        <KanbanBoard orders={orders} onOrderMove={handleOrderMove} />
      </div>
    </div>
  );
}
