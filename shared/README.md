# @qred/shared

This package contains shared TypeScript types and Zod validation schemas used across the frontend and backend applications.

## Overview

The shared package provides:

- **Zod schemas** for data validation and type safety
- **TypeScript types** inferred from the schemas
- **Runtime validation** for API requests and responses

## Schemas

### Core Data Models

- **CompanySchema** - Company information
- **SpendingInfoSchema** - Spending limits and current usage
- **TransactionSchema** - Transaction details
- **CardSchema** - Credit card information
- **TransactionSummarySchema** - Transaction count summaries

### API Response Models

- **DashboardDataSchema** - Complete dashboard data structure
- **PaginatedTransactionsSchema** - Paginated transaction lists
- **CardActivationResponseSchema** - Card activation/deactivation responses

## Testing

### Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with coverage report
pnpm test:coverage
```

## Development

```bash
# Build the package
pnpm build

# Watch mode for development
pnpm dev

# Clean build artifacts
pnpm clean
```
