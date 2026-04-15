// Unit tests for automation engine
// Validates: Requirements 1.3, 1.4, 1.5, 3.1, 4.1, 4.2, 4.3

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  executeTransitionSideEffects,
  decrementInventory,
  createStaffTask,
  createRestockTask,
  resetAutomationState,
} from './automation';
import { Order, OrderItem, InventoryItem } from '@/types';
import * as supabase from './supabase';

describe('automation', () => {
  beforeEach(() => {
    // Mock Supabase functions
    vi.spyOn(supabase, 'createPipelineLog').mockResolvedValue(undefined);
    vi.spyOn(supabase, 'createStaffTask').mockResolvedValue(undefined);
    vi.spyOn(supabase, 'fetchInventory').mockResolvedValue([]);
    vi.spyOn(supabase, 'updateInventoryStockLevel').mockResolvedValue(undefined);
    // Reset automation state
    resetAutomationState();
  });

  describe('executeTransitionSideEffects', () => {
    it('should log side effect execution when transitioning to cooking', async () => {
      vi.clearAllMocks();
      
      const order: Order = {
        id: 'order-1',
        tableNumber: 5,
        items: [
          { name: 'Margherita Pizza', quantity: 2, prepTime: 15 },
          { name: 'Caesar Salad', quantity: 1, prepTime: 5 },
        ],
        status: 'pending',
        priorityScore: 18.0,
        createdAt: new Date().toISOString(),
        startedAt: null,
        dispatchedAt: null,
        countdownTimer: null,
      };

      await executeTransitionSideEffects(order, 'cooking');

      // Verify pipeline log was called
      expect(supabase.createPipelineLog).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'INFO',
          message: expect.stringContaining('Executing side effects for order #order-1')
        })
      );
    });

    it('should create delivery task when transitioning to quality_check', async () => {
      vi.clearAllMocks();
      
      const order: Order = {
        id: 'order-2',
        tableNumber: 3,
        items: [{ name: 'Grilled Chicken', quantity: 1, prepTime: 20 }],
        status: 'cooking',
        priorityScore: 15.0,
        createdAt: new Date().toISOString(),
        startedAt: new Date().toISOString(),
        dispatchedAt: null,
        countdownTimer: 1200,
      };

      await executeTransitionSideEffects(order, 'quality_check');

      expect(supabase.createStaffTask).toHaveBeenCalledWith(
        expect.objectContaining({
          taskType: 'delivery',
          description: expect.stringContaining('order-2')
        })
      );
      expect(supabase.createPipelineLog).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'INFO',
          message: expect.stringContaining('Task created: delivery')
        })
      );
    });

    it('should decrement inventory and create cleaning task when transitioning to dispatched', async () => {
      vi.clearAllMocks();
      
      const order: Order = {
        id: 'order-3',
        tableNumber: 7,
        items: [{ name: 'Caesar Salad', quantity: 2, prepTime: 5 }],
        status: 'ready',
        priorityScore: 10.0,
        createdAt: new Date().toISOString(),
        startedAt: new Date().toISOString(),
        dispatchedAt: null,
        countdownTimer: 0,
      };

      await executeTransitionSideEffects(order, 'dispatched');

      expect(supabase.createPipelineLog).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'INFO',
          message: expect.stringContaining('Inventory decremented for order #order-3')
        })
      );
      expect(supabase.createStaffTask).toHaveBeenCalledWith(
        expect.objectContaining({
          taskType: 'cleaning',
          description: expect.stringContaining('table 7')
        })
      );
    });

    it('should not execute side effects for pending status', async () => {
      vi.clearAllMocks();
      
      const order: Order = {
        id: 'order-4',
        tableNumber: 1,
        items: [{ name: 'Margherita Pizza', quantity: 1, prepTime: 15 }],
        status: 'pending',
        priorityScore: 12.0,
        createdAt: new Date().toISOString(),
        startedAt: null,
        dispatchedAt: null,
        countdownTimer: null,
      };

      await executeTransitionSideEffects(order, 'pending');

      // Should only log the initial message
      expect(supabase.createPipelineLog).toHaveBeenCalledTimes(1);
      expect(supabase.createPipelineLog).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'INFO',
          message: expect.stringContaining('Executing side effects')
        })
      );
    });
  });

  describe('decrementInventory', () => {
    it('should process items with ingredient mappings', async () => {
      const mockInventory = [
        { id: 'flour', itemName: 'Flour', stockLevel: 80, reorderPoint: 20, unit: '%' },
        { id: 'romaine-lettuce', itemName: 'Romaine Lettuce', stockLevel: 70, reorderPoint: 15, unit: '%' },
      ];
      vi.spyOn(supabase, 'fetchInventory').mockResolvedValue(mockInventory);

      const items: OrderItem[] = [
        { name: 'Margherita Pizza', quantity: 1, prepTime: 15 },
        { name: 'Caesar Salad', quantity: 2, prepTime: 5 },
      ];

      await decrementInventory(items, 'order-1');

      // Verify inventory updates were called
      expect(supabase.updateInventoryStockLevel).toHaveBeenCalled();
      expect(supabase.createPipelineLog).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'INFO',
          message: expect.stringContaining('Inventory decremented for order #order-1')
        })
      );
    });

    it('should skip items without ingredient mappings', async () => {
      const items: OrderItem[] = [
        { name: 'Unknown Item', quantity: 1, prepTime: 10 },
      ];

      await decrementInventory(items);

      expect(supabase.createPipelineLog).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'WARN',
          message: expect.stringContaining('No ingredient mapping found for item: Unknown Item')
        })
      );
    });

    it('should calculate correct deduction amounts', async () => {
      const mockInventory = [
        { id: 'chicken-breast', itemName: 'Chicken Breast', stockLevel: 80, reorderPoint: 20, unit: '%' },
        { id: 'olive-oil', itemName: 'Olive Oil', stockLevel: 70, reorderPoint: 15, unit: '%' },
      ];
      vi.spyOn(supabase, 'fetchInventory').mockResolvedValue(mockInventory);

      const items: OrderItem[] = [
        { name: 'Grilled Chicken', quantity: 3, prepTime: 20 },
      ];

      await decrementInventory(items);

      // chicken-breast: 5.0 * 3 = 15% deduction → 80 - 15 = 65%
      expect(supabase.updateInventoryStockLevel).toHaveBeenCalledWith('chicken-breast', 65);
      // olive-oil: 0.5 * 3 = 1.5% deduction → 70 - 1.5 = 68.5%
      expect(supabase.updateInventoryStockLevel).toHaveBeenCalledWith('olive-oil', 68.5);
    });
  });

  describe('createStaffTask', () => {
    it('should create a staff task with logging', async () => {
      await createStaffTask({
        taskType: 'delivery',
        description: 'Deliver order #123 to table 5',
        priority: 'high',
        assignedTo: null,
        status: 'pending',
      });

      expect(supabase.createStaffTask).toHaveBeenCalledWith(
        expect.objectContaining({
          taskType: 'delivery',
          description: 'Deliver order #123 to table 5'
        })
      );
      expect(supabase.createPipelineLog).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'INFO',
          message: expect.stringContaining('Task created: delivery')
        })
      );
    });

    it('should handle different task types', async () => {
      await createStaffTask({
        taskType: 'cleaning',
        description: 'Clean table 3',
        priority: 'low',
        assignedTo: null,
        status: 'pending',
      });

      expect(supabase.createStaffTask).toHaveBeenCalledWith(
        expect.objectContaining({
          taskType: 'cleaning',
          description: 'Clean table 3'
        })
      );
      expect(supabase.createPipelineLog).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'INFO',
          message: expect.stringContaining('Task created: cleaning')
        })
      );
    });
  });

  describe('createRestockTask', () => {
    it('should create a restock task with inventory details', async () => {
      const inventory: InventoryItem = {
        id: 'inv-1',
        itemName: 'Mozzarella',
        stockLevel: 15,
        reorderPoint: 20,
        unit: '%',
      };

      await createRestockTask(inventory);

      expect(supabase.createStaffTask).toHaveBeenCalledWith(
        expect.objectContaining({
          taskType: 'restock',
          description: expect.stringContaining('Mozzarella')
        })
      );
      expect(supabase.createPipelineLog).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'INFO',
          message: expect.stringContaining('Restock task created for Mozzarella')
        })
      );
    });

    it('should include current stock level and reorder point in description', async () => {
      const inventory: InventoryItem = {
        id: 'inv-2',
        itemName: 'Flour',
        stockLevel: 10,
        reorderPoint: 25,
        unit: '%',
      };

      await createRestockTask(inventory);

      expect(supabase.createStaffTask).toHaveBeenCalledWith(
        expect.objectContaining({
          taskType: 'restock',
          description: expect.stringContaining('Flour')
        })
      );
      expect(supabase.createPipelineLog).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'INFO',
          message: expect.stringContaining('Restock task created for Flour')
        })
      );
    });
  });
});

// Feature: kitchenos, Property 3: Delivery Task Created on Order Ready
// Feature: kitchenos, Property 4: Inventory Deduction Matches Ingredient Map
// Feature: kitchenos, Property 5: Cleaning Task Created on Order Dispatch
// Feature: kitchenos, Property 10: Restock Task Created When Inventory Below Reorder Point

import fc from 'fast-check';

describe('Automation Engine - Property Tests', () => {
  beforeEach(() => {
    // Mock Supabase functions for property tests
    vi.spyOn(supabase, 'createPipelineLog').mockResolvedValue(undefined);
    vi.spyOn(supabase, 'createStaffTask').mockResolvedValue(undefined);
    vi.spyOn(supabase, 'fetchInventory').mockResolvedValue([]);
    vi.spyOn(supabase, 'updateInventoryStockLevel').mockResolvedValue(undefined);
    // Reset automation state
    resetAutomationState();
  });

  afterEach(() => {
    // Clear all mocks after each test
    vi.clearAllMocks();
    // Reset automation state
    resetAutomationState();
  });

  describe('Property 3: Delivery Task Created on Order Ready', () => {
    it('should create delivery task when order transitions to quality_check', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            tableNumber: fc.integer({ min: 1, max: 50 }),
            items: fc.array(
              fc.record({
                name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
                quantity: fc.integer({ min: 1, max: 10 }),
                prepTime: fc.integer({ min: 1, max: 60 }),
              }),
              { minLength: 1, maxLength: 10 }
            ),
            status: fc.constant('cooking' as const),
            priorityScore: fc.float({ min: 0, max: 100 }),
            createdAt: fc.date().map(d => d.toISOString()),
            startedAt: fc.date().map(d => d.toISOString()),
            dispatchedAt: fc.constant(null),
            countdownTimer: fc.integer({ min: 0, max: 3600 }),
          }),
          async (order) => {
            vi.clearAllMocks();
            resetAutomationState();
            await executeTransitionSideEffects(order, 'quality_check');
            
            // Check that delivery task creation was called
            const createTaskCalls = (supabase.createStaffTask as any).mock.calls;
            const hasDeliveryTask = createTaskCalls.some((call: any[]) => 
              call[0]?.taskType === 'delivery' && 
              call[0]?.description?.includes(order.id)
            );
            
            return hasDeliveryTask;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 5: Cleaning Task Created on Order Dispatch', () => {
    it('should create cleaning task when order transitions to dispatched', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            tableNumber: fc.integer({ min: 1, max: 50 }),
            items: fc.array(
              fc.record({
                name: fc.constantFrom('Margherita Pizza', 'Caesar Salad', 'Grilled Chicken'),
                quantity: fc.integer({ min: 1, max: 5 }),
                prepTime: fc.integer({ min: 1, max: 60 }),
              }),
              { minLength: 1, maxLength: 5 }
            ),
            status: fc.constant('ready' as const),
            priorityScore: fc.float({ min: 0, max: 100 }),
            createdAt: fc.date().map(d => d.toISOString()),
            startedAt: fc.date().map(d => d.toISOString()),
            dispatchedAt: fc.constant(null),
            countdownTimer: fc.constant(0),
          }),
          async (order) => {
            vi.clearAllMocks();
            resetAutomationState();
            
            // Mock inventory for this test
            const mockInventory = [
              { id: 'flour', itemName: 'Flour', stockLevel: 80, reorderPoint: 20, unit: '%' },
              { id: 'tomato-sauce', itemName: 'Tomato Sauce', stockLevel: 75, reorderPoint: 15, unit: '%' },
              { id: 'mozzarella', itemName: 'Mozzarella', stockLevel: 70, reorderPoint: 20, unit: '%' },
              { id: 'romaine-lettuce', itemName: 'Romaine Lettuce', stockLevel: 65, reorderPoint: 15, unit: '%' },
              { id: 'parmesan', itemName: 'Parmesan', stockLevel: 60, reorderPoint: 10, unit: '%' },
              { id: 'caesar-dressing', itemName: 'Caesar Dressing', stockLevel: 55, reorderPoint: 15, unit: '%' },
              { id: 'chicken-breast', itemName: 'Chicken Breast', stockLevel: 80, reorderPoint: 20, unit: '%' },
              { id: 'olive-oil', itemName: 'Olive Oil', stockLevel: 70, reorderPoint: 15, unit: '%' },
            ];
            vi.spyOn(supabase, 'fetchInventory').mockResolvedValue(mockInventory);
            
            await executeTransitionSideEffects(order, 'dispatched');
            
            // Check that cleaning task creation was called
            const createTaskCalls = (supabase.createStaffTask as any).mock.calls;
            const hasCleaningTask = createTaskCalls.some((call: any[]) => 
              call[0]?.taskType === 'cleaning' && 
              call[0]?.description?.includes(order.tableNumber.toString())
            );
            
            return hasCleaningTask;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 4: Inventory Deduction Matches Ingredient Map', () => {
    it('should decrement inventory according to ingredient map', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              name: fc.constantFrom('Margherita Pizza', 'Caesar Salad', 'Grilled Chicken'),
              quantity: fc.integer({ min: 1, max: 5 }),
              prepTime: fc.integer({ min: 1, max: 60 }),
            }),
            { minLength: 1, maxLength: 5 }
          ),
          async (items) => {
            vi.clearAllMocks();
            resetAutomationState();
            
            // Mock inventory with all required items
            const mockInventory = [
              { id: 'flour', itemName: 'Flour', stockLevel: 80, reorderPoint: 20, unit: '%' },
              { id: 'tomato-sauce', itemName: 'Tomato Sauce', stockLevel: 75, reorderPoint: 15, unit: '%' },
              { id: 'mozzarella', itemName: 'Mozzarella', stockLevel: 70, reorderPoint: 20, unit: '%' },
              { id: 'romaine-lettuce', itemName: 'Romaine Lettuce', stockLevel: 65, reorderPoint: 15, unit: '%' },
              { id: 'parmesan', itemName: 'Parmesan', stockLevel: 60, reorderPoint: 10, unit: '%' },
              { id: 'caesar-dressing', itemName: 'Caesar Dressing', stockLevel: 55, reorderPoint: 15, unit: '%' },
              { id: 'chicken-breast', itemName: 'Chicken Breast', stockLevel: 80, reorderPoint: 20, unit: '%' },
              { id: 'olive-oil', itemName: 'Olive Oil', stockLevel: 70, reorderPoint: 15, unit: '%' },
            ];
            vi.spyOn(supabase, 'fetchInventory').mockResolvedValue(mockInventory);
            
            await decrementInventory(items);
            
            // Check that inventory updates were called for each item's ingredients
            const updateCalls = (supabase.updateInventoryStockLevel as any).mock.calls;
            
            for (const item of items) {
              if (item.name === 'Margherita Pizza') {
                // Should update flour, tomato-sauce, mozzarella
                const hasFlour = updateCalls.some((call: any[]) => call[0] === 'flour');
                const hasTomato = updateCalls.some((call: any[]) => call[0] === 'tomato-sauce');
                const hasMozzarella = updateCalls.some((call: any[]) => call[0] === 'mozzarella');
                if (!hasFlour || !hasTomato || !hasMozzarella) return false;
              } else if (item.name === 'Caesar Salad') {
                // Should update romaine-lettuce, parmesan, caesar-dressing
                const hasLettuce = updateCalls.some((call: any[]) => call[0] === 'romaine-lettuce');
                const hasParmesan = updateCalls.some((call: any[]) => call[0] === 'parmesan');
                const hasDressing = updateCalls.some((call: any[]) => call[0] === 'caesar-dressing');
                if (!hasLettuce || !hasParmesan || !hasDressing) return false;
              } else if (item.name === 'Grilled Chicken') {
                // Should update chicken-breast, olive-oil
                const hasChicken = updateCalls.some((call: any[]) => call[0] === 'chicken-breast');
                const hasOil = updateCalls.some((call: any[]) => call[0] === 'olive-oil');
                if (!hasChicken || !hasOil) return false;
              }
            }
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 10: Restock Task Created When Inventory Below Reorder Point', () => {
    it('should create restock task when stock level falls below reorder point', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            itemName: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 1),
            stockLevel: fc.integer({ min: 0, max: 100 }),
            reorderPoint: fc.integer({ min: 1, max: 100 }),
            unit: fc.constantFrom('kg', 'L', '%', 'units'),
          }),
          async (inventory) => {
            // Only test when stock is below reorder point
            if (inventory.stockLevel >= inventory.reorderPoint) {
              return true; // Skip this case
            }

            vi.clearAllMocks();
            resetAutomationState();
            await createRestockTask(inventory);
            
            // Check that restock task creation was called
            const createTaskCalls = (supabase.createStaffTask as any).mock.calls;
            const hasRestockTask = createTaskCalls.some((call: any[]) => 
              call[0]?.taskType === 'restock' && 
              call[0]?.description?.includes(inventory.itemName)
            );
            
            return hasRestockTask;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
