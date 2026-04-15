// Pipeline log feed component
// Validates: Requirements 8.1, 8.3, 8.7

'use client';

import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { LogEntry } from './LogEntry';
import { PipelineLog } from '@/types';

export interface PipelineLogFeedProps {
  logs: PipelineLog[];
}

export function PipelineLogFeed({ logs }: PipelineLogFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);

  // Sort logs in reverse chronological order (newest first)
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Auto-scroll to top when new log is added
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [logs.length]);

  return (
    <Card className="h-96">
      <h3 className="text-lg font-semibold mb-4">Pipeline Logs</h3>
      <div 
        ref={feedRef}
        className="overflow-y-auto h-80 space-y-1"
      >
        {sortedLogs.length === 0 ? (
          <p className="text-gray-500 text-sm">No logs yet</p>
        ) : (
          sortedLogs.map((log) => (
            <LogEntry key={log.id} log={log} />
          ))
        )}
      </div>
    </Card>
  );
}
