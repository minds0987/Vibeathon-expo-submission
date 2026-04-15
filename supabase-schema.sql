-- KitchenOS Supabase Database Schema
-- This schema creates all tables needed for the KitchenOS application
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ORDERS TABLE
-- Stores customer orders with status tracking and timing information
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT ('order-' || uuid_generate_v4()::text),
  table_number INTEGER NOT NULL,
  items JSONB NOT NULL, -- Array of {name, quantity, prepTime}
  status TEXT NOT NULL CHECK (status IN ('pending', 'cooking', 'quality_check', 'ready', 'dispatched')),
  priority_score DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  dispatched_at TIMESTAMPTZ,
  countdown_timer INTEGER, -- seconds remaining
  CONSTRAINT valid_table_number CHECK (table_number > 0),
  CONSTRAINT valid_priority_score CHECK (priority_score >= 0)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_priority_score ON orders(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ============================================================================
-- INVENTORY TABLE
-- Tracks inventory items with stock levels and reorder points
-- ============================================================================
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY DEFAULT ('inv-' || uuid_generate_v4()::text),
  item_name TEXT NOT NULL UNIQUE,
  stock_level INTEGER NOT NULL DEFAULT 100 CHECK (stock_level >= 0 AND stock_level <= 100),
  reorder_point INTEGER NOT NULL CHECK (reorder_point >= 0 AND reorder_point <= 100),
  unit TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_inventory_stock_level ON inventory(stock_level);
CREATE INDEX IF NOT EXISTS idx_inventory_item_name ON inventory(item_name);

-- ============================================================================
-- STAFF_TASKS TABLE
-- Manages staff task assignments and tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff_tasks (
  id TEXT PRIMARY KEY DEFAULT ('task-' || uuid_generate_v4()::text),
  task_type TEXT NOT NULL CHECK (task_type IN ('delivery', 'cleaning', 'restock', 'custom')),
  description TEXT NOT NULL,
  assigned_to TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_staff_tasks_status ON staff_tasks(status);
CREATE INDEX IF NOT EXISTS idx_staff_tasks_priority ON staff_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_staff_tasks_assigned_to ON staff_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_staff_tasks_created_at ON staff_tasks(created_at DESC);

-- ============================================================================
-- PIPELINE_LOGS TABLE
-- System logs for monitoring and debugging
-- ============================================================================
CREATE TABLE IF NOT EXISTS pipeline_logs (
  id TEXT PRIMARY KEY DEFAULT ('log-' || uuid_generate_v4()::text),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  level TEXT NOT NULL CHECK (level IN ('INFO', 'WARN', 'ERROR')),
  message TEXT NOT NULL
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_pipeline_logs_timestamp ON pipeline_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_pipeline_logs_level ON pipeline_logs(level);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update inventory updated_at timestamp
CREATE OR REPLACE FUNCTION update_inventory_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update inventory timestamp
DROP TRIGGER IF EXISTS trigger_update_inventory_timestamp ON inventory;
CREATE TRIGGER trigger_update_inventory_timestamp
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_timestamp();

-- Function to auto-complete staff tasks
CREATE OR REPLACE FUNCTION auto_complete_staff_task()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set completed_at timestamp
DROP TRIGGER IF EXISTS trigger_auto_complete_staff_task ON staff_tasks;
CREATE TRIGGER trigger_auto_complete_staff_task
  BEFORE UPDATE ON staff_tasks
  FOR EACH ROW
  EXECUTE FUNCTION auto_complete_staff_task();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS for all tables (optional - adjust based on your auth needs)
-- ============================================================================

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_logs ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for authenticated users
-- Adjust these policies based on your authentication requirements

CREATE POLICY "Allow all operations on orders" ON orders
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on inventory" ON inventory
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on staff_tasks" ON staff_tasks
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on pipeline_logs" ON pipeline_logs
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- SEED DATA (Optional - uncomment to populate with sample data)
-- ============================================================================

-- Uncomment the following lines to insert sample data for testing

/*
-- Sample Orders
INSERT INTO orders (id, table_number, items, status, priority_score, created_at) VALUES
  ('order-001', 5, '[{"name":"Ribeye Steak","quantity":2,"prepTime":25},{"name":"Lobster Tail","quantity":1,"prepTime":20}]'::jsonb, 'pending', 42.5, NOW() - INTERVAL '15 minutes'),
  ('order-002', 3, '[{"name":"Caesar Salad","quantity":2,"prepTime":8},{"name":"Grilled Chicken","quantity":2,"prepTime":15}]'::jsonb, 'pending', 18.2, NOW() - INTERVAL '5 minutes'),
  ('order-003', 8, '[{"name":"French Fries","quantity":1,"prepTime":5},{"name":"Soda","quantity":2,"prepTime":1}]'::jsonb, 'pending', 3.6, NOW() - INTERVAL '1 minute');

-- Sample Inventory
INSERT INTO inventory (id, item_name, stock_level, reorder_point, unit) VALUES
  ('inv-001', 'Chicken Breast', 85, 30, 'kg'),
  ('inv-002', 'Pasta', 72, 25, 'kg'),
  ('inv-003', 'Olive Oil', 65, 20, 'L'),
  ('inv-004', 'Ground Beef', 45, 30, 'kg'),
  ('inv-005', 'Tomatoes', 38, 25, 'kg'),
  ('inv-006', 'Lettuce', 22, 15, 'heads'),
  ('inv-007', 'Salmon Fillet', 18, 25, 'kg'),
  ('inv-008', 'Butter', 12, 20, 'kg'),
  ('inv-009', 'Eggs', 15, 30, 'dozen'),
  ('inv-010', 'Milk', 8, 25, 'L'),
  ('inv-011', 'Flour', 5, 20, 'kg'),
  ('inv-012', 'Heavy Cream', 0, 15, 'L');

-- Sample Staff Tasks
INSERT INTO staff_tasks (id, task_type, description, assigned_to, status, priority, created_at) VALUES
  ('task-001', 'delivery', 'Deliver order to table 15', 'Sarah Johnson', 'pending', 'high', NOW() - INTERVAL '2 minutes'),
  ('task-002', 'delivery', 'Deliver order to table 2', 'Mike Chen', 'in_progress', 'high', NOW() - INTERVAL '5 minutes'),
  ('task-003', 'restock', 'Restock Eggs - current level 15%', 'Alex Rodriguez', 'pending', 'medium', NOW() - INTERVAL '10 minutes'),
  ('task-004', 'cleaning', 'Clean and reset table 9', 'Sarah Johnson', 'pending', 'low', NOW() - INTERVAL '5 minutes');

-- Sample Pipeline Logs
INSERT INTO pipeline_logs (id, timestamp, level, message) VALUES
  ('log-001', NOW() - INTERVAL '1 minute', 'INFO', 'Order transitioned to ready status'),
  ('log-002', NOW() - INTERVAL '2 minutes', 'INFO', 'Staff task created: Deliver order to table 15'),
  ('log-003', NOW() - INTERVAL '5 minutes', 'WARN', 'Inventory item Heavy Cream reached 0% stock level'),
  ('log-004', NOW() - INTERVAL '8 minutes', 'WARN', 'Inventory item Eggs below reorder point'),
  ('log-005', NOW() - INTERVAL '15 minutes', 'ERROR', 'Failed to fetch orders: Connection timeout');
*/

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these to verify your tables were created successfully
-- ============================================================================

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('orders', 'inventory', 'staff_tasks', 'pipeline_logs');

-- Check row counts (should be 0 if seed data is commented out)
SELECT 
  (SELECT COUNT(*) FROM orders) as orders_count,
  (SELECT COUNT(*) FROM inventory) as inventory_count,
  (SELECT COUNT(*) FROM staff_tasks) as staff_tasks_count,
  (SELECT COUNT(*) FROM pipeline_logs) as pipeline_logs_count;
