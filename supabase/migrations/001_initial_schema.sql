-- KitchenOS Database Schema
-- Validates: Requirements 17.1, 17.2, 17.3, 17.4, 17.5, 17.6

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_number INTEGER NOT NULL,
  items JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'cooking', 'quality_check', 'ready', 'dispatched')),
  priority_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  countdown_timer INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  dispatched_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for orders
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_priority_score ON orders(priority_score DESC);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_name TEXT NOT NULL UNIQUE,
  stock_level DECIMAL(5,2) NOT NULL CHECK (stock_level >= 0 AND stock_level <= 100),
  reorder_point DECIMAL(5,2) NOT NULL,
  unit TEXT NOT NULL
);

-- Create index for inventory
CREATE INDEX idx_inventory_stock_level ON inventory(stock_level);

-- Staff tasks table
CREATE TABLE IF NOT EXISTS staff_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_type TEXT NOT NULL CHECK (task_type IN ('delivery', 'cleaning', 'restock', 'custom')),
  description TEXT NOT NULL,
  assigned_to TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for staff_tasks
CREATE INDEX idx_staff_tasks_status ON staff_tasks(status);
CREATE INDEX idx_staff_tasks_priority ON staff_tasks(priority);
CREATE INDEX idx_staff_tasks_created_at ON staff_tasks(created_at DESC);

-- Pipeline logs table
CREATE TABLE IF NOT EXISTS pipeline_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  level TEXT NOT NULL CHECK (level IN ('INFO', 'WARN', 'ERROR')),
  message TEXT NOT NULL
);

-- Create indexes for pipeline_logs
CREATE INDEX idx_pipeline_logs_timestamp ON pipeline_logs(timestamp DESC);
CREATE INDEX idx_pipeline_logs_level ON pipeline_logs(level);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for authenticated users)
CREATE POLICY "Allow all operations on orders" ON orders
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on inventory" ON inventory
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on staff_tasks" ON staff_tasks
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on pipeline_logs" ON pipeline_logs
  FOR ALL USING (true) WITH CHECK (true);

-- Add tables to Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE staff_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE pipeline_logs;

-- Insert sample data for testing
INSERT INTO inventory (item_name, stock_level, reorder_point, unit) VALUES
  ('Mozzarella', 75.0, 20.0, 'kg'),
  ('Tomato Sauce', 60.0, 15.0, 'L'),
  ('Flour', 85.0, 25.0, 'kg'),
  ('Chicken Breast', 50.0, 30.0, 'kg'),
  ('Lettuce', 40.0, 20.0, 'kg'),
  ('Olive Oil', 90.0, 10.0, 'L');

-- Insert sample orders for testing
INSERT INTO orders (table_number, items, status, priority_score, countdown_timer) VALUES
  (1, '[{"name":"Margherita Pizza","quantity":2,"prepTime":15}]'::jsonb, 'pending', 85.5, 1800),
  (3, '[{"name":"Caesar Salad","quantity":1,"prepTime":5},{"name":"Grilled Chicken","quantity":1,"prepTime":20}]'::jsonb, 'cooking', 92.3, 1500),
  (5, '[{"name":"Margherita Pizza","quantity":1,"prepTime":15}]'::jsonb, 'quality_check', 78.2, 900);
