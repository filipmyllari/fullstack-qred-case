# Backend - Node.js API with Prisma

A robust Node.js backend built with Hono, Prisma ORM, and PostgreSQL.

## Development

```bash
pnpm install
pnpm run dev
```

The API will be available at `http://localhost:3000`.

## Database Setup

1. **Start PostgreSQL** (using Docker):

   ```bash
   docker-compose up -d
   ```

2. **Run migrations**:

   ```bash
   pnpm run db:migrate
   ```

3. **Seed database**:
   ```bash
   pnpm run db:seed
   ```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing with mocked Prisma Client for unit tests.

### Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Generate coverage report
pnpm test:coverage
```
