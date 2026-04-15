// App shell layout component
// Validates: Requirements 14.5

'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BackgroundTexture } from './BackgroundTexture';
import { ThemeProvider } from './ThemeProvider';

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <ThemeProvider>
      <BackgroundTexture />
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          
          <main className="flex-1 overflow-auto p-6 relative z-10">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
