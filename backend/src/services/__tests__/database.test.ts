import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DatabaseService } from '../database.js';

vi.mock('../../generated/prisma/index.js', () => {
  const mockPrisma = {
    company: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    spendingLimit: {
      findUnique: vi.fn(),
    },
    invoice: {
      findFirst: vi.fn(),
    },
    transaction: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    card: {
      updateMany: vi.fn(),
    },
    $disconnect: vi.fn(),
  };

  return {
    PrismaClient: vi.fn(() => mockPrisma),
  };
});

import { PrismaClient } from '../../generated/prisma/index.js';

const mockPrisma = new PrismaClient() as any;

describe('DatabaseService', () => {
  let dbService: DatabaseService;

  beforeEach(() => {
    vi.clearAllMocks();
    dbService = new DatabaseService();
  });

  describe('getDashboardData', () => {
    it('should return dashboard data for the first company when no companyId provided', async () => {
      const mockCompanies = [
        { id: '1', name: 'Company A' },
        { id: '2', name: 'Company B' },
      ];

      const mockCompany = {
        id: '1',
        name: 'Company A',
        cards: [
          {
            id: 'card-1',
            isActive: true,
            imageUrl: 'https://example.com/card.jpg',
          },
        ],
        transactions: [
          {
            id: 'tx-1',
            description: 'Test transaction',
            dataPoints: '100 kr',
            date: new Date('2024-01-15'),
          },
        ],
      };

      const mockSpendingLimit = {
        current: 5000,
        limit: 10000,
        currency: 'kr',
      };

      const mockInvoice = {
        isDue: false,
      };

      mockPrisma.company.findMany.mockResolvedValue(mockCompanies);
      mockPrisma.company.findUnique.mockResolvedValue(mockCompany);
      mockPrisma.spendingLimit.findUnique.mockResolvedValue(mockSpendingLimit);
      mockPrisma.invoice.findFirst.mockResolvedValue(mockInvoice);
      mockPrisma.transaction.count.mockResolvedValue(5);

      const result = await dbService.getDashboardData();

      expect(result.companies).toHaveLength(2);
      expect(result.selectedCompany.id).toBe('1');
      expect(result.selectedCompany.name).toBe('Company A');
      expect(result.card.isActive).toBe(true);
      expect(result.spending.current).toBe(5000);
      expect(result.spending.limit).toBe(10000);
      expect(result.spending.currency).toBe('kr');
      expect(result.recentTransactions).toHaveLength(1);
      expect(result.transactionSummary.totalTransactions).toBe(5);
      expect(result.transactionSummary.remainingCount).toBe(4);
    });

    it('should throw error when no companies found', async () => {
      mockPrisma.company.findMany.mockResolvedValue([]);

      await expect(dbService.getDashboardData()).rejects.toThrow(
        'No companies found'
      );
    });
  });
});
