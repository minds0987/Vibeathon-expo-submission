# Supabase Setup Guide for KitchenOS

This guide will walk you through setting up Supabase for your KitchenOS application.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in the project details:
   - **Organization**: Select or create one
   - **Name**: `kitchenos` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose the region closest to you
5. Click **"Create new project"**
6. Wait ~2 minutes for the project to be provisioned

## Step 2: Get Your API Credentials

1. Once your project is ready, click the **"Project Settings"** icon (gear icon) in the left sidebar
2. Click **"API"** in the settings menu
3. You'll see two important values:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   
   **API Keys:**
   - `anon` `public` - This is your **anon key** (safe for frontend use)
   - `service_role` `secret` - Keep this secret! (not needed for this app)

4. Copy both the **Project URL** and **anon public** key

## Step 3: Update Environment Variables

### For Local Development

Update `kitchenos-next/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add these two variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon public key
4. Make sure they're available for all environments (Production, Preview, Development)

## Step 4: Create Database Tables

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy the entire contents of `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. You should see a success message

### What This Creates

The schema creates 4 tables:
- **orders** - Customer orders with status tracking
- **inventory** - Inventory items with stock levels
- **staff_tasks** - Staff task assignments
- **pipeline_logs** - System logs for monitoring

It also creates:
- Indexes for faster queries
- Triggers for automatic timestamp updates
- Row Level Security policies (allows all operations by default)

## Step 5: (Optional) Add Sample Data

If you want to populate your database with sample data for testing:

1. Open `supabase-schema.sql`
2. Scroll to the **SEED DATA** section (near the bottom)
3. Uncomment the INSERT statements (remove the `/*` and `*/`)
4. Run the modified SQL in the Supabase SQL Editor

This will add:
- 3 sample orders
- 12 inventory items
- 4 staff tasks
- 5 pipeline logs

## Step 6: Verify Setup

Run these verification queries in the SQL Editor:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('orders', 'inventory', 'staff_tasks', 'pipeline_logs');

-- Check row counts
SELECT 
  (SELECT COUNT(*) FROM orders) as orders_count,
  (SELECT COUNT(*) FROM inventory) as inventory_count,
  (SELECT COUNT(*) FROM staff_tasks) as staff_tasks_count,
  (SELECT COUNT(*) FROM pipeline_logs) as pipeline_logs_count;
```

You should see all 4 tables listed and row counts (0 if you didn't add seed data).

## Step 7: Test Your Connection

1. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

2. Open your browser console (F12)
3. You should NOT see any warnings about "Supabase not configured"
4. The app should now be using real database data instead of mock data

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure your `.env.local` file has the correct values
- Restart your development server after updating `.env.local`
- Check that the file is in the `kitchenos-next` directory

### "Failed to fetch orders" error
- Verify your Supabase project is running (check the dashboard)
- Check that the tables were created successfully
- Verify your API credentials are correct
- Check the browser console for detailed error messages

### Tables not created
- Make sure you ran the entire `supabase-schema.sql` file
- Check for any error messages in the SQL Editor
- Verify you have the UUID extension enabled

### Data not showing up
- If you didn't add seed data, the tables will be empty
- The app will work but won't show any orders/inventory/tasks
- You can either:
  - Add seed data using the SQL in the schema file
  - Use the app to create new data through the UI

## Next Steps

Once Supabase is set up:

1. **Deploy to Vercel** - Your app will now use the real database
2. **Enable Realtime** (optional) - For live updates across clients
3. **Set up Authentication** (optional) - If you want user login
4. **Configure RLS Policies** - Adjust Row Level Security based on your needs

## Database Schema Reference

### Orders Table
- `id` - Unique order identifier
- `table_number` - Table number for the order
- `items` - JSON array of order items
- `status` - Order status (pending, cooking, quality_check, ready, dispatched)
- `priority_score` - Calculated priority score
- `created_at` - When the order was created
- `started_at` - When cooking started
- `dispatched_at` - When order was dispatched
- `countdown_timer` - Seconds remaining for cooking

### Inventory Table
- `id` - Unique inventory item identifier
- `item_name` - Name of the inventory item
- `stock_level` - Current stock level (0-100%)
- `reorder_point` - Threshold for reordering (0-100%)
- `unit` - Unit of measurement
- `updated_at` - Last update timestamp

### Staff Tasks Table
- `id` - Unique task identifier
- `task_type` - Type of task (delivery, cleaning, restock, custom)
- `description` - Task description
- `assigned_to` - Staff member assigned
- `status` - Task status (pending, in_progress, completed)
- `priority` - Task priority (high, medium, low)
- `created_at` - When task was created
- `completed_at` - When task was completed

### Pipeline Logs Table
- `id` - Unique log identifier
- `timestamp` - When the log was created
- `level` - Log level (INFO, WARN, ERROR)
- `message` - Log message

## Support

If you encounter any issues:
1. Check the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
2. Review the browser console for error messages
3. Check the Supabase project logs in the dashboard
