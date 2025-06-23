import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';

vi.mock('../services/database.js', () => ({
  db: {
    getDashboardData: vi.fn(),
    updateCardStatus: vi.fn(),
    getPaginatedTransactions: vi.fn(),
    disconnect: vi.fn(),
  },
}));

import { db } from '../services/database.js';

const createTestApp = () => {
  const app = new Hono();

  app.get('/api/health', (c) => {
    return c.json({ status: 'ok', message: 'Backend is running!' });
  });

  app.get('/api/dashboard', async (c) => {
    try {
      const companyId = c.req.query('companyId');
      const dashboardData = await db.getDashboardData(companyId);
      return c.json(dashboardData);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return c.json({ error: 'Company not found' }, 404);
      }
      return c.json({ error: 'Failed to fetch dashboard data' }, 500);
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
      return c.json(
        {
          success,
          message: success
            ? 'Card activated successfully'
            : 'Failed to activate card',
        },
        success ? 200 : 500
      );
    } catch (error) {
      return c.json(
        {
          success: false,
          message: 'Failed to activate card',
        },
        500
      );
    }
  });

  return app;
};

describe('API Endpoints', () => {
  let app: Hono;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createTestApp();
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await app.request('/api/health');

      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.status).toBe('ok');
      expect(data.message).toBe('Backend is running!');
    });
  });

  describe('GET /api/dashboard', () => {
    it('should return dashboard data when company exists', async () => {
      const mockDashboardData = {
        companies: [{ id: '1', name: 'Test Company' }],
        selectedCompany: { id: '1', name: 'Test Company' },
        card: { id: 'card-1', isActive: true },
        spending: { current: 1000, limit: 5000, currency: 'kr' },
        recentTransactions: [],
        transactionSummary: { totalTransactions: 0, remainingCount: 0 },
      };

      (db.getDashboardData as any).mockResolvedValue(mockDashboardData);

      const res = await app.request('/api/dashboard?companyId=1');

      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.selectedCompany.id).toBe('1');
      expect(data.selectedCompany.name).toBe('Test Company');
    });

    it('should return 404 when company not found', async () => {
      (db.getDashboardData as any).mockRejectedValue(
        new Error('Company with id invalid-id not found')
      );

      const res = await app.request('/api/dashboard?companyId=invalid-id');

      expect(res.status).toBe(404);

      const data = await res.json();
      expect(data.error).toBe('Company not found');
    });

    it('should return 500 on database error', async () => {
      (db.getDashboardData as any).mockRejectedValue(
        new Error('Database connection failed')
      );

      const res = await app.request('/api/dashboard');

      expect(res.status).toBe(500);

      const data = await res.json();
      expect(data.error).toBe('Failed to fetch dashboard data');
    });
  });

  describe('POST /api/card/activate', () => {
    it('should activate card successfully', async () => {
      (db.updateCardStatus as any).mockResolvedValue(true);

      const res = await app.request('/api/card/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: 'company-1' }),
      });

      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.message).toBe('Card activated successfully');
      expect(db.updateCardStatus).toHaveBeenCalledWith('company-1', true);
    });

    it('should return 400 when companyId is missing', async () => {
      const res = await app.request('/api/card/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(400);

      const data = await res.json();
      expect(data.error).toBe('Company ID is required');
    });

    it('should return 500 when card activation fails', async () => {
      (db.updateCardStatus as any).mockResolvedValue(false);

      const res = await app.request('/api/card/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: 'company-1' }),
      });

      expect(res.status).toBe(500);

      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.message).toBe('Failed to activate card');
    });
  });
});
