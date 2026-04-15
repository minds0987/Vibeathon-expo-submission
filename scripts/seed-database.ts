// Script to seed Supabase database with mock data
// Run with: npx tsx scripts/seed-database.ts

import { createClient } from '@supabase/supabase-js';
import { mockOrders, mockInventory, mockStaffTasks, mockPipelineLogs } from '../lib/mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await supabase.from('orders').delete().neq('id', '');
    await supabase.from('inventory').delete().neq('id', '');
    await supabase.from('staff_tasks').delete().neq('id', '');
    await supabase.from('pipeline_logs').delete().neq('id', '');
    console.log('✅ Cleared existing data\n');

    // Seed orders
    console.log('📦 Seeding orders...');
    const ordersToInsert = mockOrders.map(order => ({
      id: order.id,
      table_number: order.tableNumber,
      items: order.items,
      status: order.status,
      priority_score: order.priorityScore,
      created_at: order.createdAt,
      started_at: order.startedAt,
      dispatched_at: order.dispatchedAt,
      countdown_timer: order.countdownTimer,
    }));

    const { error: ordersError } = await supabase
      .from('orders')
      .insert(ordersToInsert);

    if (ordersError) throw ordersError;
    console.log(`✅ Seeded ${mockOrders.length} orders\n`);

    // Seed inventory
    console.log('📦 Seeding inventory...');
    const inventoryToInsert = mockInventory.map(item => ({
      id: item.id,
      item_name: item.itemName,
      stock_level: item.stockLevel,
      reorder_point: item.reorderPoint,
      unit: item.unit,
    }));

    const { error: inventoryError } = await supabase
      .from('inventory')
      .insert(inventoryToInsert);

    if (inventoryError) throw inventoryError;
    console.log(`✅ Seeded ${mockInventory.length} inventory items\n`);

    // Seed staff tasks
    console.log('📦 Seeding staff tasks...');
    const tasksToInsert = mockStaffTasks.map(task => ({
      id: task.id,
      task_type: task.taskType,
      description: task.description,
      assigned_to: task.assignedTo,
      status: task.status,
      priority: task.priority,
      created_at: task.createdAt,
    }));

    const { error: tasksError } = await supabase
      .from('staff_tasks')
      .insert(tasksToInsert);

    if (tasksError) throw tasksError;
    console.log(`✅ Seeded ${mockStaffTasks.length} staff tasks\n`);

    // Seed pipeline logs
    console.log('📦 Seeding pipeline logs...');
    const logsToInsert = mockPipelineLogs.map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      level: log.level,
      message: log.message,
    }));

    const { error: logsError } = await supabase
      .from('pipeline_logs')
      .insert(logsToInsert);

    if (logsError) throw logsError;
    console.log(`✅ Seeded ${mockPipelineLogs.length} pipeline logs\n`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Orders: ${mockOrders.length}`);
    console.log(`   - Inventory: ${mockInventory.length}`);
    console.log(`   - Staff Tasks: ${mockStaffTasks.length}`);
    console.log(`   - Pipeline Logs: ${mockPipelineLogs.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
