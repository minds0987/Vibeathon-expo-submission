// Log entry component
// Validates: Requirements 8.2, 8.4

import React, { memo } from 'react';
import { PipelineLog } from '@/types';
import { Badge } from '@/components/ui/Badge';

export interface LogEntryProps {
  log: PipelineLog;
}

const LogEntry = memo(function LogEntry({ log }: LogEntryProps) {
  const levelVariant = {
    INFO: 'info' as const,
    WARN: 'warning' as const,
    ERROR: 'danger' as const,
  };

  const timestamp = new Date(log.timestamp).toLocaleTimeString();

  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-800 last:border-0">
      <span className="text-xs text-gray-500 font-mono w-20 flex-shrink-0">
        {timestamp}
      </span>
      <Badge variant={levelVariant[log.level]} className="flex-shrink-0">
        {log.level}
      </Badge>
      <p className="text-sm text-gray-300 flex-1">{log.message}</p>
    </div>
  );
});

export default LogEntry;

