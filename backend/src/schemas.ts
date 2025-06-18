import { z } from 'zod';

// Zod schemas for API validation
export const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const SpendingInfoSchema = z.object({
  current: z.number(),
  limit: z.number(),
  currency: z.string(),
});

export const TransactionSchema = z.object({
  id: z.string(),
  description: z.string(),
  dataPoints: z.string(),
  date: z.string(),
});

export const DashboardDataSchema = z.object({
  companies: z.array(CompanySchema),
  selectedCompany: CompanySchema,
  invoiceDue: z.boolean(),
  cardImage: z.string(),
  spending: SpendingInfoSchema,
  recentTransactions: z.array(TransactionSchema),
  totalTransactions: z.number(),
  cardActivated: z.boolean(),
});

// Export inferred types (these should match our types.ts)
export type Company = z.infer<typeof CompanySchema>;
export type SpendingInfo = z.infer<typeof SpendingInfoSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;
