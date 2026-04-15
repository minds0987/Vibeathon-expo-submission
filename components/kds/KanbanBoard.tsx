// Kanban board for kitchen display
// Validates: Requirements 5.1, 5.3, 5.4, 5.5, 2.3

'use client';

import React, { useCallback, useMemo } from 'react';
import { DragDropContext, Draggable, DropResult } from '@hello-pangea/dnd';
import { ColumnContainer } from './ColumnContainer';
import { OrderCard } from './OrderCard';
import { Order, OrderStatus } from '@/types';
import { useKitchenOSStore } from '@/store';
import { canTransition } from '@/lib/stateMachine';

export interface KanbanBoardProps {
  orders: Order[];
  onOrderMove: (orderId: string, newStatus: OrderStatus) => void;
}

const COLUMNS: { id: OrderStatus; title: string }[] = [
  { id: 'pending', title: 'Pending' },
  { id: 'cooking', title: 'Cooking' },
  { id: 'quality_check', title: 'Quality Check' },
  { id: 'ready', title: 'Ready' },
];

export function KanbanBoard({ orders, onOrderMove }: KanbanBoardProps) {
  const { manualOverrideMode } = useKitchenOSStore();

  // Sort pending orders by priority score (descending) - memoized
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      if (a.status === 'pending' && b.status === 'pending') {
        return b.priorityScore - a.priorityScore;
      }
      return 0;
    });
  }, [orders]);

  const handleDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const order = orders.find(o => o.id === draggableId);
    if (!order) return;

    const newStatus = destination.droppableId as OrderStatus;

    // Validate transition unless in manual override mode
    if (!manualOverrideMode && !canTransition(order.status, newStatus)) {
      console.warn(`Invalid transition: ${order.status} -> ${newStatus}`);
      return;
    }

    onOrderMove(draggableId, newStatus);
  }, [orders, manualOverrideMode, onOrderMove]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-4 gap-4 h-full">
        {COLUMNS.map((column) => {
          const columnOrders = sortedOrders.filter(o => o.status === column.id);
          
          return (
            <ColumnContainer
              key={column.id}
              id={column.id}
              title={column.title}
              count={columnOrders.length}
            >
              {columnOrders.map((order, index) => (
                <Draggable key={order.id} draggableId={order.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <OrderCard order={order} />
                    </div>
                  )}
                </Draggable>
              ))}
            </ColumnContainer>
          );
        })}
      </div>
    </DragDropContext>
  );
}
