// Manual override toggle component
// Validates: Requirements 9.1, 9.2, 9.3, 9.4

'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useKitchenOSStore } from '@/store';

export function ManualOverrideToggle() {
  const { manualOverrideMode, setManualOverrideMode } = useKitchenOSStore();

  return (
    <Card>
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">Manual Override Mode</h3>
          <p className="text-sm text-gray-400 mt-1">
            {manualOverrideMode 
              ? 'State machine validation is disabled. You can move orders to any state.'
              : 'State machine validation is active. Orders follow sequential transitions.'}
          </p>
        </div>
        
        <Button
          variant={manualOverrideMode ? 'danger' : 'secondary'}
          onClick={() => setManualOverrideMode(!manualOverrideMode)}
          className="w-full"
        >
          {manualOverrideMode ? 'Disable Manual Override' : 'Enable Manual Override'}
        </Button>
        
        {manualOverrideMode && (
          <div className="bg-red-500/10 border border-red-500 rounded p-3">
            <p className="text-xs text-red-400">
              ⚠️ Warning: Manual override is active. All state transitions will be logged.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
