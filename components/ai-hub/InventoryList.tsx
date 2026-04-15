'use client';

import React from 'react';
import InventoryItem from './InventoryItem';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { ErrorBadge } from '@/components/ui/ErrorBadge';
import { useInventory } from '@/hooks/useInventory';

export default function InventoryList() {
  const { inventory, loading, error } = useInventory();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <SkeletonLoader key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorBadge message={error} />;
  }

  if (!inventory || inventory.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No inventory items found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {inventory.map((item) => (
        <InventoryItem key={item.id} item={item} />
      ))}
    </div>
  );
}
