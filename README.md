# KitchenOS

> **Fully autonomous restaurant operations system** powered by AI automation for kitchen management, inventory tracking, and staff coordination.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.103-green?logo=supabase)](https://supabase.com/)
[![Tests](https://img.shields.io/badge/Tests-95%20passing-brightgreen)]()

**Built for**: Vibeathon Expo Submission  
**Repository**: https://github.com/minds0987/Vibeathon-expo-submission

---

## 🎯 Overview

KitchenOS is a production-ready restaurant operations platform that demonstrates AI-powered automation for managing kitchen workflows, inventory, and staff tasks in real-time. The system features a drag-and-drop kitchen display, automated task creation, demand forecasting, and comprehensive pipeline logging.

### Key Features

- 🍳 **Kitchen Display System** - Drag-and-drop Kanban board with real-time order tracking
- 📊 **Command Center** - Live metrics dashboard with pipeline logs and manual override
- 🤖 **AI Hub** - Demand forecasting and automated inventory management
- 👥 **Staff Dispatch** - Automated task creation with round-robin assignment
- ⚡ **Real-time Sync** - Supabase Realtime subscriptions with offline fallback
- 🔄 **State Machine** - Validated order transitions with automation triggers
- 📈 **Performance Optimized** - React.memo, code splitting, and bundle optimization

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and npm
- **Supabase account** (optional - works with mock data)

### Installation

```bash
# Clone the repository
git clone https://github.com/minds0987/Vibeathon-expo-submission.git
cd Vibeathon-expo-submission/kitchenos-next

# Install dependencies
npm install

# Set up environment variables (optional)
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Without Supabase

The app works perfectly with mock data if you don't configure Supabase:

```bash
npm install
npm run dev
```

The system will automatically detect the missing configuration and use offline mode with sample data.

---

## 📦 Available Scripts

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Run tests with UI
```

---

## 🏗️ Project Structure

```
kitchenos-next/
├── app/                      # Next.js App Router pages
│   ├── command-center/       # Metrics dashboard
│   ├── kitchen/              # Kitchen Display System
│   ├── ai-hub/               # Inventory & forecasting
│   ├── staff/                # Staff task management
│   └── layout.tsx            # Root layout
│
├── components/               # React components
│   ├── ui/                   # Reusable UI primitives
│   ├── layout/               # Layout components
│   ├── command-center/       # Command Center components
│   ├── kds/                  # Kitchen Display components
│   ├── ai-hub/               # AI Hub components
│   └── staff-dispatch/       # Staff Dispatch components
│
├── hooks/                    # Custom React hooks
│   ├── useOrders.ts          # Order CRUD operations
│   ├── useInventory.ts       # Inventory management
│   ├── useStaffTasks.ts      # Task management
│   ├── useMetrics.ts         # Derived metrics
│   ├── usePipelineLogs.ts    # Log management
│   └── useRealtime.ts        # Realtime subscriptions
│
├── lib/                      # Business logic
│   ├── stateMachine.ts       # Order state machine
│   ├── automation.ts         # Automation engine
│   ├── calculations.ts       # Priority & metrics
│   ├── ingredientMap.ts      # Menu → inventory mapping
│   ├── supabase.ts           # Supabase client
│   ├── mockData.ts           # Offline mode data
│   └── utils.ts              # Utility functions
│
├── store/                    # Zustand state management
├── types/                    # TypeScript definitions
├── supabase/                 # Database migrations
└── docs/                     # Documentation
```

---

## 🎮 Features

### 1. Kitchen Display System (`/kitchen`)

**Drag-and-drop Kanban board** for managing orders through the cooking pipeline:

- **4 columns**: Pending → Cooking → Quality Check → Ready
- **Priority-based sorting** - Orders automatically sorted by urgency
- **Countdown timers** - Visual warnings when time is running out
- **State validation** - Prevents invalid order transitions
- **Manual override** - Skip states for exceptional cases
- **Real-time updates** - Live synchronization across all devices

**Order cards display**:
- Order ID and table number
- All items with quantities
- Priority score (wait time + order complexity)
- Elapsed time since creation
- Countdown timer for cooking stages

### 2. Command Center (`/command-center`)

**Real-time operations dashboard** with system-wide visibility:

- **Live metrics** (updated every 30 seconds):
  - Total revenue (current day)
  - Active orders count
  - Average wait time
  - Pending tasks count

- **Pipeline log feed**:
  - Auto-scrolling live feed
  - Color-coded by level (INFO/WARN/ERROR)
  - All state transitions and automation events
  - Reverse chronological sorting

- **Manual override toggle**:
  - Enable/disable state machine validation
  - Warning banner when active
  - All manual moves logged

### 3. AI Hub (`/ai-hub`)

**Intelligent inventory management and demand forecasting**:

- **Demand forecasting chart**:
  - Projected vs actual demand by hour
  - Highlights hours exceeding projections
  - Historical pattern analysis
  - Interactive Recharts visualization

- **Inventory management**:
  - Real-time stock level monitoring
  - Color-coded progress bars (green/amber/red)
  - Warning badges for low stock
  - Automatic restock task creation

- **Stock alerts panel**:
  - "At Risk Items" list
  - Items below reorder point
  - Current stock vs threshold

### 4. Staff Dispatch (`/staff`)

**Automated task management system**:

- **Automated task creation**:
  - Delivery tasks (when order ready)
  - Cleaning tasks (after order dispatched)
  - Restock tasks (low inventory)

- **Task management**:
  - Filter by status (pending/in_progress/completed)
  - Filter by priority (high/medium/low)
  - Round-robin assignment logic
  - Priority-based sorting

- **Task types**:
  - Delivery - Deliver order to table
  - Cleaning - Clean and reset table
  - Restock - Replenish inventory
  - Custom - User-defined tasks

---

## 🔧 Technical Architecture

### State Machine

Orders flow through a validated state machine:

```
pending → cooking → quality_check → ready → dispatched
```

**Features**:
- Strict transition validation
- Manual override capability
- Comprehensive logging
- Error handling

### Automation Engine

**Automated actions triggered by state transitions**:

1. **On "quality_check"**: Create delivery task
2. **On "dispatched"**:
   - Decrement inventory based on ingredient map
   - Create cleaning task
   - Check for low stock and create restock tasks

**Idempotency guarantees**:
- Tasks deduplicated by type + description
- Dispatched orders tracked to prevent double deduction
- Restock tasks tracked per inventory item

### Priority Scoring

Orders are prioritized using a dynamic scoring algorithm:

```typescript
priorityScore = (waitTime * 2) + (itemCount * 10)
```

- Recalculated every 30 seconds
- Higher scores = higher priority
- Considers both wait time and order complexity

### Real-time Synchronization

**Multi-layer strategy**:
1. **Primary**: Supabase Realtime subscriptions
2. **Fallback**: Polling every 5 seconds
3. **Offline**: Mock data mode

**Subscribed tables**: orders, inventory, staff_tasks, pipeline_logs

---

## 🗄️ Database Setup

### Supabase Configuration

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the migration**:
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Execute the SQL

3. **Configure environment variables**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Database Schema

**Tables**:
- `orders` - Order tracking with status and priority
- `inventory` - Stock levels and reorder points
- `staff_tasks` - Task assignments and status
- `pipeline_logs` - System event logging

**Features**:
- Row Level Security (RLS) enabled
- Realtime publication configured
- Indexes for performance
- Sample data included

---

## 🧪 Testing

### Test Coverage

- **95 unit tests passing** ✓
- **Property-based tests** with fast-check
- **Integration tests** for automation
- **Component tests** with Vitest

### Run Tests

```bash
# Run all tests once
npm test

# Watch mode
npm run test:watch

# UI mode
npm run test:ui
```

### Test Files

- `lib/stateMachine.test.ts` - State machine validation
- `lib/calculations.test.ts` - Priority and metrics
- `lib/automation.test.ts` - Automation engine
- `lib/mockData.test.ts` - Mock data validation
- `lib/supabase.test.ts` - Database operations
- `store/index.test.ts` - State management
- `types/index.test.ts` - Type definitions

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/minds0987/Vibeathon-expo-submission/tree/main/kitchenos-next)

**Steps**:
1. Click the button above or go to [vercel.com](https://vercel.com)
2. Import the repository
3. Add environment variables in Vercel dashboard (Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key-here`
   - **Important**: Use "Plain Text" type, NOT "Secret" type
   - Apply to: Production, Preview, and Development
4. Deploy automatically

**📖 Detailed deployment guide**: See [DEPLOYMENT.md](DEPLOYMENT.md) for troubleshooting and complete instructions.

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

The app will be available at `http://localhost:3000`

---

## 🎨 Design System

### Colors

- **Primary**: Lime green (#84cc16)
- **Background**: Dark gray (#0a0a0a)
- **Surface**: Gray-900
- **Text**: White/Gray scale
- **Status**: Green/Amber/Red

### Components

- **Button** - primary/secondary/danger variants
- **Card** - Surface with border
- **Badge** - success/warning/danger/info
- **ProgressBar** - Color-coded by percentage
- **SkeletonLoader** - Loading states
- **ErrorBadge** - Inline errors

---

## ⚡ Performance

### Optimizations

- **React.memo** on all list item components
- **useCallback** for callback props
- **useMemo** for expensive computations
- **Code splitting** via Next.js
- **Bundle optimization** in next.config.ts
- **Compression** enabled
- **Tree shaking** for unused code

### Bundle Size

- Production build: **< 500KB gzipped**
- Lazy loading for charts
- Optimized package imports

---

## 📚 Documentation

- **[README.md](README.md)** - This file (getting started)
- **[docs/handoff.md](docs/handoff.md)** - Complete project handoff
- **[docs/structure.md](docs/structure.md)** - File structure details
- **[docs/roadmap.md](docs/roadmap.md)** - Feature roadmap
- **[MIGRATION.md](MIGRATION.md)** - Vite to Next.js migration notes

---

## 🐛 Troubleshooting

### Build Issues

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Supabase Connection

- Verify environment variables in `.env.local`
- Check Supabase project is active
- Verify RLS policies are configured
- App will fallback to mock data if connection fails

### Performance Issues

- Check React DevTools Profiler
- Verify React.memo is applied
- Monitor bundle size with `npm run build`
- Check for unnecessary re-renders

---

## 🛠️ Tech Stack

### Core

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety

### UI & Styling

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[@hello-pangea/dnd](https://github.com/hello-pangea/dnd)** - Drag and drop
- **[Recharts](https://recharts.org/)** - Data visualization
- **[Lucide React](https://lucide.dev/)** - Icon library

### State & Data

- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management
- **[Supabase](https://supabase.com/)** - Backend and database
- **[date-fns](https://date-fns.org/)** - Date utilities

### Testing

- **[Vitest](https://vitest.dev/)** - Unit testing
- **[Testing Library](https://testing-library.com/)** - Component testing
- **[fast-check](https://fast-check.dev/)** - Property-based testing

---

## 📝 License

This project is built for the Vibeathon Expo submission.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)

---

## 📞 Support

For questions or issues:
1. Check documentation in `/docs`
2. Review test files for usage examples
3. Check GitHub issues
4. Review Supabase logs for database errors

---

**Last Updated**: April 15, 2026  
**Status**: Production Ready ✅  
**Version**: 1.0.0
