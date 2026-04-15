// Script to clear all data from Supabase database
// Run with: npm run clear

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clearDatabase() {
  console.log('🗑️  Clearing Supabase database...\n');
  console.log(`📍 Database: ${supabaseUrl}\n`);

  try {
    // Get counts before deletion
    const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    const { count: inventoryCount } = await supabase.from('inventory').select('*', { count: 'exact', head: true });
    const { count: tasksCount } = await supabase.from('staff_tasks').select('*', { count: 'exact', head: true });
    const { count: logsCount } = await supabase.from('pipeline_logs').select('*', { count: 'exact', head: true });

    console.log('📊 Current data:');
    console.log(`   - Orders: ${ordersCount || 0}`);
    console.log(`   - Inventory: ${inventoryCount || 0}`);
    console.log(`   - Staff Tasks: ${tasksCount || 0}`);
    console.log(`   - Pipeline Logs: ${logsCount || 0}\n`);

    if ((ordersCount || 0) + (inventoryCount || 0) + (tasksCount || 0) + (logsCount || 0) === 0) {
      console.log('✅ Database is already empty!');
      return;
    }

    // Clear all tables
    console.log('🗑️  Deleting all data...');
    
    const { error: ordersError } = await supabase.from('orders').delete().neq('id', '');
    if (ordersError) throw new Error(`Orders: ${ordersError.message}`);
    console.log('   ✅ Cleared orders');

    const { error: inventoryError } = await supabase.from('inventory').delete().neq('id', '');
    if (inventoryError) throw new Error(`Inventory: ${inventoryError.message}`);
    console.log('   ✅ Cleared inventory');

    const { error: tasksError } = await supabase.from('staff_tasks').delete().neq('id', '');
    if (tasksError) throw new Error(`Staff tasks: ${tasksError.message}`);
    console.log('   ✅ Cleared staff tasks');

    const { error: logsError } = await supabase.from('pipeline_logs').delete().neq('id', '');
    if (logsError) throw new Error(`Pipeline logs: ${logsError.message}`);
    console.log('   ✅ Cleared pipeline logs');

    console.log('\n🎉 Database cleared successfully!');
    console.log('\n💡 To seed with fresh data, run: npm run seed');

  } catch (error) {
    console.error('\n❌ Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase();
