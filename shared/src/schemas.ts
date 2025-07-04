import { z } from 'zod';

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

export const CardSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
  imageUrl: z.string().optional(),
});

export const TransactionSummarySchema = z.object({
  totalTransactions: z.number(),
  remainingCount: z.number(),
});

export const DashboardDataSchema = z.object({
  companies: z.array(CompanySchema),
  selectedCompany: CompanySchema,
  card: CardSchema,
  invoiceDue: z.boolean(),
  spending: SpendingInfoSchema,
  recentTransactions: z.array(TransactionSchema),
  transactionSummary: TransactionSummarySchema,
});

export const PaginatedTransactionsSchema = z.object({
  transactions: z.array(TransactionSchema),
  total: z.number(),
  hasMore: z.boolean(),
});

export const CardActivationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type Company = z.infer<typeof CompanySchema>;
export type SpendingInfo = z.infer<typeof SpendingInfoSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type Card = z.infer<typeof CardSchema>;
export type TransactionSummary = z.infer<typeof TransactionSummarySchema>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;
export type PaginatedTransactions = z.infer<typeof PaginatedTransactionsSchema>;
export type CardActivationResponse = z.infer<
  typeof CardActivationResponseSchema
>;
