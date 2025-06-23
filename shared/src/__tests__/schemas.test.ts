import { describe, it, expect } from 'vitest';
import {
  CompanySchema,
  SpendingInfoSchema,
  TransactionSchema,
  CardSchema,
  TransactionSummarySchema,
  DashboardDataSchema,
  PaginatedTransactionsSchema,
  CardActivationResponseSchema,
} from '../schemas.js';

describe('Schema Validation Tests', () => {
  describe('CompanySchema', () => {
    it('should validate a valid company object', () => {
      const validCompany = {
        id: 'company-1',
        name: 'Test Company',
      };

      const result = CompanySchema.safeParse(validCompany);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validCompany);
      }
    });

    it('should reject company with missing required fields', () => {
      const invalidCompany = { id: 'company-1' };

      const result = CompanySchema.safeParse(invalidCompany);
      expect(result.success).toBe(false);
    });

    it('should reject company with invalid field types', () => {
      const invalidCompany = {
        id: 123,
        name: 'Test Company',
      };

      const result = CompanySchema.safeParse(invalidCompany);
      expect(result.success).toBe(false);
    });
  });

  describe('SpendingInfoSchema', () => {
    it('should validate a valid spending info object', () => {
      const validSpending = {
        current: 5000,
        limit: 10000,
        currency: 'kr',
      };

      const result = SpendingInfoSchema.safeParse(validSpending);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validSpending);
      }
    });

    it('should reject spending info with non-numeric values', () => {
      const invalidSpending = {
        current: '5000',
        limit: 10000,
        currency: 'kr',
      };

      const result = SpendingInfoSchema.safeParse(invalidSpending);
      expect(result.success).toBe(false);
    });

    it('should handle zero values correctly', () => {
      const zeroSpending = {
        current: 0,
        limit: 0,
        currency: 'USD',
      };

      const result = SpendingInfoSchema.safeParse(zeroSpending);
      expect(result.success).toBe(true);
    });
  });

  describe('TransactionSchema', () => {
    it('should validate a valid transaction object', () => {
      const validTransaction = {
        id: 'txn-1',
        description: 'Coffee Shop Purchase',
        dataPoints: '125 kr',
        date: '2024-01-15',
      };

      const result = TransactionSchema.safeParse(validTransaction);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validTransaction);
      }
    });

    it('should reject transaction with missing fields', () => {
      const invalidTransaction = {
        id: 'txn-1',
        description: 'Coffee Shop Purchase',
      };

      const result = TransactionSchema.safeParse(invalidTransaction);
      expect(result.success).toBe(false);
    });
  });

  describe('CardSchema', () => {
    it('should validate a card with imageUrl', () => {
      const validCard = {
        id: 'card-1',
        isActive: true,
        imageUrl: 'https://example.com/card.jpg',
      };

      const result = CardSchema.safeParse(validCard);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validCard);
      }
    });

    it('should validate a card without imageUrl (optional field)', () => {
      const validCard = {
        id: 'card-1',
        isActive: false,
      };

      const result = CardSchema.safeParse(validCard);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.imageUrl).toBeUndefined();
      }
    });

    it('should reject card with invalid boolean value', () => {
      const invalidCard = {
        id: 'card-1',
        isActive: 'true',
        imageUrl: 'https://example.com/card.jpg',
      };

      const result = CardSchema.safeParse(invalidCard);
      expect(result.success).toBe(false);
    });
  });

  describe('TransactionSummarySchema', () => {
    it('should validate a valid transaction summary', () => {
      const validSummary = {
        totalTransactions: 25,
        remainingCount: 20,
      };

      const result = TransactionSummarySchema.safeParse(validSummary);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validSummary);
      }
    });

    it('should handle zero values', () => {
      const zeroSummary = {
        totalTransactions: 0,
        remainingCount: 0,
      };

      const result = TransactionSummarySchema.safeParse(zeroSummary);
      expect(result.success).toBe(true);
    });
  });

  describe('DashboardDataSchema', () => {
    it('should validate a complete dashboard data object', () => {
      const validDashboard = {
        companies: [
          { id: 'company-1', name: 'Company A' },
          { id: 'company-2', name: 'Company B' },
        ],
        selectedCompany: { id: 'company-1', name: 'Company A' },
        card: {
          id: 'card-1',
          isActive: true,
          imageUrl: 'https://example.com/card.jpg',
        },
        invoiceDue: false,
        spending: {
          current: 5000,
          limit: 10000,
          currency: 'kr',
        },
        recentTransactions: [
          {
            id: 'txn-1',
            description: 'Coffee Shop',
            dataPoints: '125 kr',
            date: '2024-01-15',
          },
        ],
        transactionSummary: {
          totalTransactions: 15,
          remainingCount: 10,
        },
      };

      const result = DashboardDataSchema.safeParse(validDashboard);
      expect(result.success).toBe(true);
    });

    it('should reject dashboard data with missing nested fields', () => {
      const invalidDashboard = {
        companies: [{ id: 'company-1' }],
        selectedCompany: { id: 'company-1', name: 'Company A' },
        card: { id: 'card-1', isActive: true },
        invoiceDue: false,
        spending: { current: 5000, limit: 10000, currency: 'kr' },
        recentTransactions: [],
        transactionSummary: { totalTransactions: 0, remainingCount: 0 },
      };

      const result = DashboardDataSchema.safeParse(invalidDashboard);
      expect(result.success).toBe(false);
    });
  });

  describe('PaginatedTransactionsSchema', () => {
    it('should validate paginated transactions', () => {
      const validPaginated = {
        transactions: [
          {
            id: 'txn-1',
            description: 'Coffee Shop',
            dataPoints: '125 kr',
            date: '2024-01-15',
          },
        ],
        total: 100,
        hasMore: true,
      };

      const result = PaginatedTransactionsSchema.safeParse(validPaginated);
      expect(result.success).toBe(true);
    });

    it('should handle empty transactions array', () => {
      const emptyPaginated = {
        transactions: [],
        total: 0,
        hasMore: false,
      };

      const result = PaginatedTransactionsSchema.safeParse(emptyPaginated);
      expect(result.success).toBe(true);
    });
  });

  describe('CardActivationResponseSchema', () => {
    it('should validate successful card activation response', () => {
      const successResponse = {
        success: true,
        message: 'Card activated successfully',
      };

      const result = CardActivationResponseSchema.safeParse(successResponse);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(successResponse);
      }
    });

    it('should validate error card activation response', () => {
      const errorResponse = {
        success: false,
        message: 'Failed to activate card',
      };

      const result = CardActivationResponseSchema.safeParse(errorResponse);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(errorResponse);
      }
    });

    it('should reject response with invalid success field', () => {
      const invalidResponse = {
        success: 'true',
        message: 'Card activated successfully',
      };

      const result = CardActivationResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });
  });
});
