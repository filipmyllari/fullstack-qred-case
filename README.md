# Qred Full-Stack Case Study

A mobile dashboard application built with React frontend and Node.js backend, featuring company management, card controls, and transaction tracking.

## Project Structure

```
├── frontend/          # React + TypeScript frontend
├── backend/           # Node.js + Hono API
├── shared/            # Shared TypeScript schemas
└── docker-compose.yml # PostgreSQL database
```

## Quick Start

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Build the shared type package**

   ```bash
   cd shared
   pnpm run build
   ```

3. **Start the database**

   ```bash
   docker-compose up -d
   ```

4. **Run the application**
   ```bash
   pnpm run dev
   ```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:3000`.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, React Query
- **Backend**: Node.js, Hono, Prisma ORM
- **Database**: PostgreSQL
- **Shared**: Zod schemas for type safety

### Shared Package (@qred/shared)

The shared package contains TypeScript type definitions and Zod schemas used by both frontend and backend.

**Available scripts:**

- `pnpm run build` - Compile TypeScript to JavaScript
- `pnpm run dev` - Watch mode compilation for development
- `pnpm run clean` - Remove compiled files

**Note:** The shared package must be built before running the frontend or backend applications as they depend on the compiled types.

## Testing

All packages include test suites:

### Frontend Tests

- Run with: `pnpm --filter=frontend test`

### Backend Tests

- Run with: `pnpm --filter=backend test`

### Shared Package Tests

- Run with: `pnpm --filter=shared test`

### Running All Tests

```bash
pnpm test:run

pnpm test

pnpm test:coverage
```

## Environment Configuration

Create `.env.local` in the frontend directory to customize the API URL:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Create `.env.local` in the backend directory to add the database URL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/qred_dashboard?schema=public"
```
