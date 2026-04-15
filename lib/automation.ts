// Automation engine for order pipeline side effects
// Validates: Requirements 1.3, 1.4, 1.5, 3.1, 4.1, 4.2, 4.3, 3.4, 3.6, 3.7, 4.7

import { Order, OrderStatus, OrderItem, InventoryItem, StaffTask } from '@/types';
import { INGREDIENT_DEDUCTION_MAP } from '@/lib/ingredientMap';
import {
  createStaffTask as createStaffTaskDB,
  updateInventoryStockLevel,
  fetchInventory,
  createPipelineLog,
} from './supabase';

// Track created tasks to prevent duplicates (idempotency)
const createdTasks = new Map<string, string>();

// Track dispatched orders to prevent double inventory deduction
const dispatchedOrders = new Set<string>();

// Track restock tasks by inventory item
const restockTasks = new Map<string, string>();

/**
 * Reset internal state (for testing purposes)
 */
export function resetAutomationState(): void {
  createdTasks.clear();
  dispatchedOrders.clear();
  restockTasks.clear();
}

/**
 * Executes side effects when an order transitions to a new status
 * Validates: Requirements 1.3, 1.4, 1.5
 */
export async function executeTransitionSideEffects(
  order: Order,
  newStatus: OrderStatus
): Promise<void> {
  try {
    await createPipelineLog({
      level: 'INFO',
      message: `Executing side effects for order #${order.id} transitioning to ${newStatus}`,
    });

    switch (newStatus) {
      case 'quality_check':
        // Auto-create delivery task
        await createStaffTask({
          taskType: 'delivery',
          description: `Deliver order #${order.id} to table ${order.tableNumber}`,
          priority: 'high',
          assignedTo: null,
          status: 'pending',
        });
        break;

      case 'dispatched':
        // Check if already dispatched (idempotency)
        if (dispatchedOrders.has(order.id)) {
          await createPipelineLog({
            level: 'INFO',
            message: `Order #${order.id} already dispatched, skipping inventory deduction`,
          });
          return;
        }

        // Decrement inventory
        await decrementInventory(order.items, order.id);
        dispatchedOrders.add(order.id);

        // Auto-create cleaning task
        await createStaffTask({
          taskType: 'cleaning',
          description: `Clean and reset table ${order.tableNumber}`,
          priority: 'low',
          assignedTo: null,
          status: 'pending',
        });
        break;

      default:
        // No side effects for other transitions
        break;
    }
  } catch (error) {
    const errorMsg = `Failed to execute side effects for order #${order.id}: ${error}`;
    await createPipelineLog({
      level: 'ERROR',
      message: `[KitchenOS][Automation] ${errorMsg}`,
    });
    throw new Error(errorMsg);
  }
}

/**
 * Decrements inventory based on order items and creates restock tasks if needed
 * Validates: Requirements 3.1, 3.6, 3.7, 4.1
 */
export async function decrementInventory(items: OrderItem[], orderId?: string): Promise<void> {
  try {
    const inventory = await fetchInventory();

    for (const item of items) {
      const deductions = INGREDIENT_DEDUCTION_MAP[item.name];
      if (!deductions) {
        await createPipelineLog({
          level: 'WARN',
          message: `No ingredient mapping found for item: ${item.name}`,
        });
        continue;
      }

      for (const { ingredientId, quantityPerItem } of deductions) {
        const inventoryItem = inventory.find((inv) => inv.id === ingredientId);

        if (inventoryItem) {
          const totalDeduction = quantityPerItem * item.quantity;
          
          // Clamp stock level to 0 (prevent negative values)
          const newStockLevel = Math.max(0, inventoryItem.stockLevel - totalDeduction);

          // Log warning if stock reaches 0%
          if (newStockLevel === 0 && inventoryItem.stockLevel > 0) {
            await createPipelineLog({
              level: 'WARN',
              message: `Stock level for ${inventoryItem.itemName} reached 0%`,
            });
          }

          await updateInventoryStockLevel(inventoryItem.id, newStockLevel);

          // Check if restock needed
          if (newStockLevel < inventoryItem.reorderPoint) {
            await createRestockTask(inventoryItem);
          }
        }
      }
    }

    if (orderId) {
      await createPipelineLog({
        level: 'INFO',
        message: `Inventory decremented for order #${orderId}`,
      });
    }
  } catch (error) {
    const errorMsg = `Failed to decrement inventory: ${error}`;
    await createPipelineLog({
      level: 'ERROR',
      message: `[KitchenOS][Automation] ${errorMsg}`,
    });
    throw new Error(errorMsg);
  }
}

/**
 * Creates a new staff task with idempotency
 * Validates: Requirements 3.4, 4.2, 4.3, 4.7
 */
export async function createStaffTask(
  task: Omit<StaffTask, 'id' | 'createdAt'>
): Promise<void> {
  try {
    // Create unique identifier for task (idempotency)
    const taskKey = `${task.taskType}-${task.description}`;

    // Check if task already exists
    if (createdTasks.has(taskKey)) {
      await createPipelineLog({
        level: 'INFO',
        message: `Task already exists: ${task.description}`,
      });
      return;
    }

    await createStaffTaskDB(task);
    createdTasks.set(taskKey, new Date().toISOString());

    await createPipelineLog({
      level: 'INFO',
      message: `Task created: ${task.taskType} - ${task.description}`,
    });
  } catch (error) {
    const errorMsg = `Failed to create staff task: ${error}`;
    await createPipelineLog({
      level: 'ERROR',
      message: `[KitchenOS][Automation] ${errorMsg}`,
    });
    throw new Error(errorMsg);
  }
}

/**
 * Creates a restock task when inventory falls below reorder point
 * Validates: Requirements 3.4, 4.1, 4.2, 4.7
 */
export async function createRestockTask(inventory: InventoryItem): Promise<void> {
  try {
    // Check if restock task already exists for this item (idempotency)
    if (restockTasks.has(inventory.id)) {
      return;
    }

    await createStaffTask({
      taskType: 'restock',
      description: `Restock ${inventory.itemName} (current: ${inventory.stockLevel.toFixed(1)}%, reorder at: ${inventory.reorderPoint}%)`,
      assignedTo: null,
      status: 'pending',
      priority: 'high',
    });

    restockTasks.set(inventory.id, new Date().toISOString());

    await createPipelineLog({
      level: 'INFO',
      message: `Restock task created for ${inventory.itemName}`,
    });
  } catch (error) {
    const errorMsg = `Failed to create restock task: ${error}`;
    await createPipelineLog({
      level: 'ERROR',
      message: `[KitchenOS][Automation] ${errorMsg}`,
    });
    throw new Error(errorMsg);
  }
}
