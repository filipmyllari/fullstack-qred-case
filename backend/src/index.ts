import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { mockDashboardData } from './data/mockData.js';
import { DashboardDataSchema } from './schemas.js';

const app = new Hono();

// Add CORS middleware for development
app.use(
  '*',
  cors({
    origin: 'http://localhost:5173', // Vite dev server default port
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

// Main dashboard endpoint for the mobile app with Zod validation
app.get('/api/dashboard', (c) => {
  try {
    // Validate the data before sending (ensures API contract)
    const validatedData = DashboardDataSchema.parse(mockDashboardData);
    return c.json(validatedData);
  } catch (error) {
    console.error('Data validation failed:', error);
    return c.json({ error: 'Invalid dashboard data' }, 500);
  }
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
