// Top bar with system status and controls
// Validates: Requirements 14.3, 9.5, 12.4

'use client';

import React, { useState, useEffect } from 'react';
import { useKitchenOSStore } from '@/store';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from './ThemeToggle';

export function TopBar() {
  const { isOfflineMode, manualOverrideMode } = useKitchenOSStore();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{currentTime}</span>
          
          {isOfflineMode && (
            <Badge variant="warning">OFFLINE MODE</Badge>
          )}
          
          {manualOverrideMode && (
            <Badge variant="danger">MANUAL OVERRIDE ACTIVE</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">System Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
