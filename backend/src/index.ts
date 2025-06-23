import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import {
  mockDashboardData,
  getDashboardData,
  getPaginatedTransactions,
} from './data/mockData.js';
import {
  DashboardDataSchema,
  PaginatedTransactionsSchema,
  CardActivationResponseSchema,
} from './schemas.js';

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

app.get('/api/dashboard', (c) => {
  try {
    const companyId = c.req.query('companyId') || '1';
    const dashboardData = getDashboardData(companyId);
    const validatedData = DashboardDataSchema.parse(dashboardData);
    return c.json(validatedData);
  } catch (error) {
    console.error('Dashboard validation failed:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return c.json({ error: 'Company not found' }, 404);
    }
    return c.json({ error: 'Invalid dashboard data' }, 500);
  }
});

app.post('/api/company/select', async (c) => {
  try {
    const body = await c.req.json();
    const { companyId } = body;

    if (!companyId) {
      return c.json({ error: 'Company ID is required' }, 400);
    }

    const dashboardData = getDashboardData(companyId);
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

app.get('/api/transactions', (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = parseInt(c.req.query('offset') || '0');

    const paginatedData = getPaginatedTransactions(limit, offset);
    const validatedData = PaginatedTransactionsSchema.parse(paginatedData);

    return c.json(validatedData);
  } catch (error) {
    console.error('Transactions validation failed:', error);
    return c.json({ error: 'Invalid transactions data' }, 500);
  }
});

app.post('/api/card/activate', async (c) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    const response = {
      success: true,
      message: 'Card activated successfully',
    };

    const validatedResponse = CardActivationResponseSchema.parse(response);
    return c.json(validatedResponse);
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

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log('API Endpoints:');
    console.log('GET  /api/dashboard?companyId=1');
    console.log('POST /api/company/select');
    console.log('GET  /api/transactions?limit=20&offset=0');
    console.log('POST /api/card/activate');
  }
);
