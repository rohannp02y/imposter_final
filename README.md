# Imposter - Social Deduction Game

A full-stack social deduction game built with Next.js, Socket.io, PostgreSQL, and Redis.

## Features

- **Real-time Multiplayer** - Play with friends via room codes or public matchmaking
- **Pass & Play** - Local multiplayer on the same device
- **Game Mechanics** - Kill cooldowns, emergency meetings, voting, task system
- **Multiple Maps** - The Skeld, Mira HQ, Polus
- **User System** - Registration, profiles, stats tracking
- **Leaderboards** - ELO-based ranking system
- **Mobile Ready** - Architecture supports React Native conversion

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Socket.io
- **Database**: PostgreSQL (Prisma ORM), Redis
- **Auth**: NextAuth.js
- **State**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd imposter-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

## Game Rules

### Crewmates
- Complete all tasks to win
- Call emergency meetings to vote out suspects
- Report dead bodies

### Imposters
- Eliminate crewmates without getting caught
- Sabotage (coming soon)
- Win by reducing crew to equal or fewer imposters

## Project Structure

```
imposter-app/
├── prisma/           # Database schema
├── src/
│   ├── app/          # Next.js pages and API routes
│   ├── components/   # React components
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Utilities and services
│   ├── store/        # Zustand stores
│   └── types/        # TypeScript types
├── server.ts         # Custom server with Socket.io
└── package.json
```

## Mobile Conversion

This app is designed for easy conversion to React Native:

1. Extract game logic from components into shared hooks
2. Replace web-specific components with React Native equivalents
3. Use the same Socket.io server for real-time communication
4. Keep the same PostgreSQL + Redis backend

## License

MIT
