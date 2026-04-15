# KitchenOS - Project Structure

## Directory Overview

```
kitchenos-next/
├── app/                          # Next.js App Router pages
│   ├── command-center/           # Command Center dashboard
│   │   └── page.tsx             # Metrics, logs, manual override
│   ├── kitchen/                  # Kitchen Display System
│   │   └── page.tsx             # Kanban board for orders
│   ├── ai-hub/                   # AI Hub for inventory & forecasting
│   │   └── page.tsx             # Demand chart, inventory, alerts
│   ├── staff/                    # Staff Dispatch system
│   │   └── page.tsx             # Task management
│   ├── layout.tsx                # Root layout with AppShell
│   ├── page.tsx                  # Home page (redirects to command-center)
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── ui/                       # Reusable UI primitives
│   │   ├── Badge.tsx            # Status badges (success/warning/danger/info)
│   │   ├── Button.tsx           # Button component (primary/secondary/danger)
│   │   ├── Card.tsx             # Card surface component
│   │   ├── ErrorBadge.tsx       # Inline error display
│   │   ├── ProgressBar.tsx      # Color-coded progress bar
│   │   └── SkeletonLoader.tsx   # Loading state placeholder
│   │
│   ├── layout/                   # Layout components
│   │   ├── AppShell.tsx         # Main layout wrapper
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   └── TopBar.tsx           # Top bar with status
│   │
│   ├── command-center/           # Command Center components
│   │   ├── LogEntry.tsx         # Single log entry (React.memo)
│   │   ├── ManualOverrideToggle.tsx  # Override mode toggle
│   │   ├── MetricCard.tsx       # Single metric display
│   │   ├── MetricsGrid.tsx      # Grid of 4 metrics
│   │   └── PipelineLogFeed.tsx  # Scrollable log feed
│   │
│   ├── kds/                      # Kitchen Display System components
│   │   ├── ColumnContainer.tsx  # Droppable kanban column
│   │   ├── KanbanBoard.tsx      # Drag-and-drop board
│   │   └── OrderCard.tsx        # Single order card (React.memo)
│   │
│   ├── ai-hub/                   # AI Hub components
│   │   ├── DemandChart.tsx      # Demand forecasting chart
│   │   ├── InventoryItem.tsx    # Single inventory item (React.memo)
│   │   ├── InventoryList.tsx    # Grid of inventory items
│   │   ├── InventoryProgressBar.tsx  # Stock level progress bar
│   │   └── StockAlerts.tsx      # At-risk items panel
│   │
│   └── staff-dispatch/           # Staff Dispatch components
│       ├── TaskCard.tsx         # Single task card (React.memo)
│       ├── TaskFilters.tsx      # Filter controls
│       ├── TaskList.tsx         # List of tasks
│       └── TaskStatusBadge.tsx  # Task status badge
│
├── hooks/                        # Custom React hooks
│   ├── useInventory.ts          # Inventory CRUD operations
│   ├── useMetrics.ts            # Derived metrics calculation
│   ├── useOrders.ts             # Order CRUD operations
│   ├── usePipelineLogs.ts       # Log management
│   ├── useRealtime.ts           # Supabase Realtime subscriptions
│   └── useStaffTasks.ts         # Task management
│
├── lib/                          # Business logic & utilities
│   ├── automation.ts            # Automation engine (side effects)
│   ├── automation.test.ts       # Automation tests
│   ├── calculations.ts          # Priority score & metrics
│   ├── calculations.test.ts     # Calculation tests
│   ├── ingredientMap.ts         # Menu item → inventory mapping
│   ├── mockData.ts              # Mock data for offline mode
│   ├── mockData.test.ts         # Mock data tests
│   ├── stateMachine.ts          # Order state machine
│   ├── stateMachine.test.ts     # State machine tests
│   ├── supabase.ts              # Supabase client wrapper
│   ├── supabase.test.ts         # Supabase tests
│   └── utils.ts                 # Utility functions
│
├── store/                        # State management
│   ├── index.ts                 # Zustand store
│   ├── index.test.ts            # Store tests
│   └── example-usage.tsx        # Usage examples
│
├── types/                        # TypeScript type definitions
│   ├── index.ts                 # Core types & interfaces
│   └── index.test.ts            # Type tests
│
├── supabase/                     # Database migrations
│   └── migrations/
│       └── 001_initial_schema.sql  # Initial database schema
│
├── docs/                         # Documentation
│   ├── handoff.md               # Project handoff document
│   ├── roadmap.md               # Feature roadmap
│   └── structure.md             # This file
│
├── public/                       # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── test/                         # Test configuration
│   └── setup.ts                 # Vitest setup
│
├── .env.local                    # Environment variables (not in git)
├── .gitignore                    # Git ignore rules
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies & scripts
├── postcss.config.mjs            # PostCSS configuration
├── README.md                     # Getting started guide
├── PROJECT_SUMMARY.md            # Complete project summary
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── vercel.json                   # Vercel deployment config
└── vitest.config.ts              # Vitest test configuration
```

---

## File Purposes

### App Router Pages

**app/command-center/page.tsx**
- Command Center dashboard
- Displays metrics, logs, and manual override toggle
- Composes MetricsGrid, PipelineLogFeed, ManualOverrideToggle

**app/kitchen/page.tsx**
- Kitchen Display System
- Drag-and-drop kanban board for orders
- Composes KanbanBoard component

**app/ai-hub/page.tsx**
- AI Hub for inventory and forecasting
- Demand chart, inventory list, stock alerts
- Composes DemandChart, InventoryList, StockAlerts

**app/staff/page.tsx**
- Staff Dispatch system
- Task management with filters
- Composes TaskFilters, TaskList

**app/layout.tsx**
- Root layout wrapper
- Includes AppShell with Sidebar and TopBar
- Applies global styles

**app/page.tsx**
- Home page
- Redirects to /command-center

---

### UI Components

**components/ui/Badge.tsx**
- Reusable badge component
- Variants: success, warning, danger, info
- Used for status indicators

**components/ui/Button.tsx**
- Reusable button component
- Variants: primary, secondary, danger
- Includes hover states and accessibility

**components/ui/Card.tsx**
- Card surface component
- Consistent border and padding
- Used for all card-based layouts

**components/ui/ErrorBadge.tsx**
- Inline error display
- Shows error messages with icon
- Used in loading/error states

**components/ui/ProgressBar.tsx**
- Color-coded progress bar
- Green (>50%), Amber (20-50%), Red (<20%)
- Used for stock levels

**components/ui/SkeletonLoader.tsx**
- Loading state placeholder
- Animated skeleton effect
- Used while data is loading

---

### Layout Components

**components/layout/AppShell.tsx**
- Main layout wrapper
- Composes Sidebar, TopBar, and page content
- Consistent layout across all pages

**components/layout/Sidebar.tsx**
- Navigation sidebar
- Links to all 4 modules
- Highlights active module

**components/layout/TopBar.tsx**
- Top bar with system status
- Shows current time, offline badge
- Manual override warning banner

---

### Feature Components

**Command Center**:
- **LogEntry.tsx**: Single log entry (React.memo)
- **ManualOverrideToggle.tsx**: Toggle for manual override mode
- **MetricCard.tsx**: Single metric display with currency formatting
- **MetricsGrid.tsx**: Grid of 4 metrics (revenue, orders, wait time, tasks)
- **PipelineLogFeed.tsx**: Scrollable log feed with auto-scroll

**Kitchen Display System**:
- **ColumnContainer.tsx**: Droppable kanban column
- **KanbanBoard.tsx**: Drag-and-drop board with state validation
- **OrderCard.tsx**: Single order card (React.memo, priority, timer)

**AI Hub**:
- **DemandChart.tsx**: Demand forecasting with Recharts
- **InventoryItem.tsx**: Single inventory item (React.memo)
- **InventoryList.tsx**: Grid of inventory items
- **InventoryProgressBar.tsx**: Color-coded stock level bar
- **StockAlerts.tsx**: At-risk items panel

**Staff Dispatch**:
- **TaskCard.tsx**: Single task card (React.memo)
- **TaskFilters.tsx**: Filter controls for status/priority
- **TaskList.tsx**: List of tasks with sorting
- **TaskStatusBadge.tsx**: Task status badge

---

### Custom Hooks

**hooks/useInventory.ts**
- Fetches inventory from Supabase or mock data
- Provides updateStockLevel, addInventoryItem functions
- Returns loading, error, data states

**hooks/useMetrics.ts**
- Calculates derived metrics from orders and tasks
- Uses useMemo for performance
- Filters to current day only

**hooks/useOrders.ts**
- Fetches orders from Supabase or mock data
- Provides updateOrderStatus, addOrder, deleteOrder functions
- Recalculates priority scores every 30 seconds

**hooks/usePipelineLogs.ts**
- Fetches logs from Supabase or mock data
- Provides createLog function
- Returns loading, error, data states

**hooks/useRealtime.ts**
- Sets up Supabase Realtime subscriptions
- Falls back to polling if Realtime unavailable
- Detects offline mode

**hooks/useStaffTasks.ts**
- Fetches tasks from Supabase or mock data
- Provides createTask, updateTaskStatus, assignTask functions
- Implements round-robin assignment

---

### Business Logic

**lib/automation.ts**
- Automation engine for order pipeline
- Executes side effects on state transitions
- Creates tasks, decrements inventory
- Idempotent operations

**lib/calculations.ts**
- Priority score calculation
- Countdown timer calculation
- Metrics calculations (revenue, wait time)

**lib/ingredientMap.ts**
- Maps menu items to inventory ingredients
- Defines quantity deductions per item

**lib/mockData.ts**
- Mock data for offline mode
- Sample orders, inventory, tasks, logs

**lib/stateMachine.ts**
- Order state machine
- Validates transitions
- Handles manual override

**lib/supabase.ts**
- Supabase client wrapper
- Typed query helpers
- Error handling with fallback

**lib/utils.ts**
- Utility functions
- Current day filtering
- Currency formatting
- Duration formatting

---

### State Management

**store/index.ts**
- Zustand store for global state
- Manual override mode
- Offline mode status
- Selected module

**store/example-usage.tsx**
- Usage examples for the store
- Demonstrates how to use actions

---

### Type Definitions

**types/index.ts**
- Core TypeScript interfaces
- Order, OrderItem, OrderStatus
- InventoryItem, StaffTask, PipelineLog
- DemandForecast

---

### Database

**supabase/migrations/001_initial_schema.sql**
- Initial database schema
- Creates orders, inventory, staff_tasks, pipeline_logs tables
- Sets up indexes, RLS policies, Realtime publication
- Includes sample data

---

### Configuration Files

**next.config.ts**
- Next.js configuration
- Compression, code splitting
- Package import optimization

**tailwind.config.ts**
- Tailwind CSS configuration
- Custom colors, fonts, spacing
- Design system tokens

**tsconfig.json**
- TypeScript configuration
- Strict mode enabled
- Path aliases (@/*)

**vitest.config.ts**
- Vitest test configuration
- Test environment setup
- Coverage settings

**vercel.json**
- Vercel deployment configuration
- Build command, output directory
- Environment variable references

**eslint.config.mjs**
- ESLint configuration
- Code linting rules

**postcss.config.mjs**
- PostCSS configuration
- Tailwind CSS processing

---

### Documentation

**README.md**
- Getting started guide
- Installation instructions
- Available scripts
- Deployment guide

**PROJECT_SUMMARY.md**
- Complete project summary
- Feature showcase
- Technical architecture
- Success metrics

**docs/handoff.md**
- Project handoff document
- Current status
- Feature details
- Troubleshooting

**docs/roadmap.md**
- Feature roadmap
- Technical decisions
- Future enhancements

**docs/structure.md**
- This file
- Project structure
- File purposes

---

## Key Patterns

### Component Organization
- **UI primitives** in `components/ui/`
- **Layout components** in `components/layout/`
- **Feature components** in `components/{feature}/`

### Code Organization
- **Business logic** in `lib/`
- **Data fetching** in `hooks/`
- **State management** in `store/`
- **Type definitions** in `types/`

### Testing Organization
- **Test files** co-located with source files
- **Test setup** in `test/setup.ts`
- **Property tests** using fast-check

### Performance Patterns
- **React.memo** on list item components
- **useCallback** for callback props
- **useMemo** for expensive computations
- **Code splitting** via Next.js

---

## Import Aliases

**Configured in tsconfig.json**:
```typescript
@/components/* → components/*
@/hooks/* → hooks/*
@/lib/* → lib/*
@/store/* → store/*
@/types/* → types/*
```

**Example**:
```typescript
import { useOrders } from '@/hooks/useOrders';
import { Order } from '@/types';
import { calculatePriorityScore } from '@/lib/calculations';
```

---

## File Naming Conventions

- **Components**: PascalCase (e.g., `OrderCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useOrders.ts`)
- **Utilities**: camelCase (e.g., `stateMachine.ts`)
- **Tests**: Same name with `.test.ts` suffix
- **Types**: camelCase (e.g., `index.ts`)

---

## Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (2 spaces, single quotes)
- **Linting**: ESLint with Next.js rules
- **Comments**: JSDoc for public APIs
- **Exports**: Named exports preferred

---

**Last Updated**: April 15, 2026  
**Total Files**: 72  
**Total Lines**: ~15,000+
