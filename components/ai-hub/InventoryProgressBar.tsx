'use client';

import React from 'react';

interface InventoryProgressBarProps {
  stockLevel: number;
  className?: string;
}

export default function InventoryProgressBar({ stockLevel, className = '' }: InventoryProgressBarProps) {
  // Color coding based on percentage thresholds
  const getColorClass = () => {
    if (stockLevel > 50) return 'bg-green-500';
    if (stockLevel >= 20) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div
        className={`h-2.5 rounded-full transition-all duration-300 ${getColorClass()}`}
        style={{ width: `${Math.min(100, Math.max(0, stockLevel))}%` }}
      />
    </div>
  );
}
