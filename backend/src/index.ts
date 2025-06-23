import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { db } from './services/database.js';
import {
  DashboardDataSchema,
  PaginatedTransactionsSchema,
  CardActivationResponseSchema,
} from '@qred/shared';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: 'http://localhost:5173',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// API routes
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', message: 'Backend is running!' });
});

app.get('/api/dashboard', async (c) => {
  try {
    const companyId = c.req.query('companyId');
    const dashboardData = await db.getDashboardData(companyId);
    const validatedData = DashboardDataSchema.parse(dashboardData);
    return c.json(validatedData);
  } catch (error) {
    console.error('Dashboard request failed:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return c.json({ error: 'Company not found' }, 404);
    }
    return c.json({ error: 'Failed to fetch dashboard data' }, 500);
  }
});

app.post('/api/company/select', async (c) => {
  try {
    const body = await c.req.json();
    const { companyId } = body;

    if (!companyId) {
      return c.json({ error: 'Company ID is required' }, 400);
    }

    const dashboardData = await db.getDashboardData(companyId);
    const validatedData = DashboardDataSchema.parse(dashboardData);

    return c.json(validatedData);
  } catch (error) {
    console.error('Company selection failed:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return c.json({ error: 'Company not found' }, 404);
    }
    return c.json({ error: 'Failed to select company' }, 500);
  }
});

app.get('/api/transactions', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = parseInt(c.req.query('offset') || '0');
    const companyId = c.req.query('companyId');

    if (!companyId) {
      return c.json({ error: 'Company ID is required' }, 400);
    }

    const paginatedData = await db.getPaginatedTransactions(
      companyId,
      limit,
      offset
    );
    const validatedData = PaginatedTransactionsSchema.parse(paginatedData);

    return c.json(validatedData);
  } catch (error) {
    console.error('Transactions request failed:', error);
    return c.json({ error: 'Failed to fetch transactions' }, 500);
  }
});

app.post('/api/card/activate', async (c) => {
  try {
    const body = await c.req.json();
    const { companyId } = body;

    if (!companyId) {
      return c.json({ error: 'Company ID is required' }, 400);
    }

    const success = await db.updateCardStatus(companyId, true);

    const response = {
      success,
      message: success
        ? 'Card activated successfully'
        : 'Failed to activate card',
    };

    const validatedResponse = CardActivationResponseSchema.parse(response);
    return c.json(validatedResponse, success ? 200 : 500);
  } catch (error) {
    console.error('Card activation failed:', error);
    return c.json(
      {
        success: false,
        message: 'Failed to activate card',
      },
      500
    );
  }
});

app.post('/api/card/deactivate', async (c) => {
  try {
    const body = await c.req.json();
    const { companyId } = body;

    if (!companyId) {
      return c.json({ error: 'Company ID is required' }, 400);
    }

    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    const success = await db.updateCardStatus(companyId, false);

    const response = {
      success,
      message: success
        ? 'Card deactivated successfully'
        : 'Failed to deactivate card',
    };

    const validatedResponse = CardActivationResponseSchema.parse(response);
    return c.json(validatedResponse, success ? 200 : 500);
  } catch (error) {
    console.error('Card deactivation failed:', error);
    return c.json(
      {
        success: false,
        message: 'Failed to deactivate card',
      },
      500
    );
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await db.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await db.disconnect();
  process.exit(0);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log('API Endpoints:');
    console.log('GET  /api/dashboard?companyId=<id>');
    console.log('POST /api/company/select');
    console.log('GET  /api/transactions?companyId=<id>&limit=20&offset=0');
    console.log('POST /api/card/activate (supports isActive: true/false)');
    console.log('POST /api/card/deactivate (supports isActive: true/false)');
    console.log('Database: PostgreSQL with Prisma ORM');
  }
);
