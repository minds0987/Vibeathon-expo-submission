# KitchenOS - Autonomous Restaurant Operations System

An AI-powered restaurant management system built with Next.js 16, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Kitchen Display System (KDS)**: Real-time order tracking with drag-and-drop kanban board
- **Command Center**: Live metrics dashboard with revenue, active orders, wait times, and task monitoring
- **AI Hub**: Demand forecasting and intelligent inventory management
- **Staff Dispatch**: Automated task assignment with round-robin distribution
- **Real-time Sync**: Supabase Realtime subscriptions with offline fallback
- **State Machine**: Strict order pipeline with validation and manual override mode
- **Automation Engine**: Automatic inventory deduction, task creation, and restock alerts

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Drag & Drop**: @hello-pangea/dnd
- **Charts**: Recharts
- **Testing**: Vitest + fast-check (property-based testing)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (optional - works with mock data)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: The app works with mock data if Supabase is not configured.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Vitest

## Project Structure

```
kitchenos-next/
├── app/                    # Next.js app router pages
│   ├── command-center/     # Command center dashboard
│   ├── kitchen/            # Kitchen display system
│   ├── ai-hub/             # AI forecasting & inventory
│   └── staff/              # Staff dispatch
├── components/             # React components
│   ├── ui/                 # Reusable UI primitives
│   ├── layout/             # Layout components
│   ├── command-center/     # Command center components
│   ├── kds/                # Kitchen display components
│   ├── ai-hub/             # AI hub components
│   └── staff-dispatch/     # Staff dispatch components
├── hooks/                  # Custom React hooks
├── lib/                    # Business logic
│   ├── stateMachine.ts     # Order state machine
│   ├── automation.ts       # Automation engine
│   ├── calculations.ts     # Metrics calculations
│   ├── supabase.ts         # Supabase client
│   └── mockData.ts         # Mock data for offline mode
├── store/                  # Zustand state management
├── types/                  # TypeScript type definitions
└── docs/                   # Documentation
```

## Key Concepts

### Order State Machine

Orders flow through a strict state machine:
```
pending → cooking → quality_check → ready → dispatched
```

Manual override mode allows skipping states for exceptional cases.

### Automation Engine

Automatically triggers side effects on state transitions:
- **ready**: Creates delivery task
- **dispatched**: Decrements inventory, creates cleaning task
- **Low inventory**: Creates restock task

### Priority Scoring

Orders are prioritized based on:
- Wait time (elapsed since creation)
- Order size (number of items)
- Recalculated every 30 seconds

### Idempotency

All automation actions are idempotent:
- Tasks are deduplicated by type + description
- Inventory deduction tracked per order
- Restock tasks tracked per inventory item

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Or deploy via CLI
npm i -g vercel
vercel
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Documentation

- [Project Structure](./docs/structure.md)
- [Handoff Guide](./docs/handoff.md)
- [Roadmap](./docs/roadmap.md)

## License

MIT

## Contributing

This project was built for the Vibeathon Expo submission.
