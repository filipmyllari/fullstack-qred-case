import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import {
  mockDashboardData,
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
    const validatedData = DashboardDataSchema.parse(mockDashboardData);
    return c.json(validatedData);
  } catch (error) {
    console.error('Dashboard validation failed:', error);
    return c.json({ error: 'Invalid dashboard data' }, 500);
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
    console.log('GET  /api/dashboard');
    console.log('GET  /api/transactions?limit=20&offset=0');
    console.log('POST /api/card/activate');
  }
);
