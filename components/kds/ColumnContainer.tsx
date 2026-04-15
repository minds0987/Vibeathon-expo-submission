// Column container for kanban board
// Validates: Requirements 5.1

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';

export interface ColumnContainerProps {
  id: string;
  title: string;
  count: number;
  children: React.ReactNode;
}

export function ColumnContainer({ id, title, count, children }: ColumnContainerProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-700">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">
          {count}
        </span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-3 p-2 rounded-lg transition-colors ${
              snapshot.isDraggingOver ? 'bg-gray-800/50' : ''
            }`}
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
