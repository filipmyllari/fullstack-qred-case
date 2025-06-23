import { PrismaClient } from '../generated/prisma/index.js';
import type { DashboardData, PaginatedTransactions } from '../schemas.js';

const prisma = new PrismaClient();

export class DatabaseService {
  async getDashboardData(companyId?: string): Promise<DashboardData> {
    // Get all companies
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // Use first company if no ID provided
    const selectedCompanyId = companyId || companies[0]?.id;

    if (!selectedCompanyId) {
      throw new Error('No companies found');
    }

    // Get the selected company with all related data
    const company = await prisma.company.findUnique({
      where: { id: selectedCompanyId },
      include: {
        cards: {
          take: 1, // Assuming one card per company for now
        },
        transactions: {
          take: 3,
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!company) {
      throw new Error(`Company with id ${selectedCompanyId} not found`);
    }

    // Get spending limit
    const spendingLimit = await prisma.spendingLimit.findUnique({
      where: { companyId: selectedCompanyId },
    });

    // Get invoice status
    const invoice = await prisma.invoice.findFirst({
      where: { companyId: selectedCompanyId },
    });

    // Get transaction summary
    const totalTransactions = await prisma.transaction.count({
      where: { companyId: selectedCompanyId },
    });

    const recentTransactionsCount = company.transactions.length;
    const remainingCount = totalTransactions - recentTransactionsCount;

    // Transform data to match API schema
    return {
      companies: companies,
      selectedCompany: {
        id: company.id,
        name: company.name,
      },
      card: {
        id: company.cards[0]?.id || '',
        isActive: company.cards[0]?.isActive || false,
        imageUrl: company.cards[0]?.imageUrl || undefined,
      },
      invoiceDue: invoice?.isDue || false,
      spending: {
        current: spendingLimit?.current || 0,
        limit: spendingLimit?.limit || 0,
        currency: spendingLimit?.currency || 'kr',
      },
      recentTransactions: company.transactions.map((tx) => ({
        id: tx.id,
        description: tx.description,
        dataPoints: tx.dataPoints,
        date: tx.date.toISOString().split('T')[0],
      })),
      transactionSummary: {
        totalTransactions,
        remainingCount,
      },
    };
  }

  async getPaginatedTransactions(
    companyId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<PaginatedTransactions> {
    const transactions = await prisma.transaction.findMany({
      where: { companyId },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.transaction.count({
      where: { companyId },
    });

    return {
      transactions: transactions.map((tx) => ({
        id: tx.id,
        description: tx.description,
        dataPoints: tx.dataPoints,
        date: tx.date.toISOString().split('T')[0],
      })),
      total,
      hasMore: offset + limit < total,
    };
  }

  async updateCardStatus(
    companyId: string,
    isActive: boolean
  ): Promise<boolean> {
    try {
      await prisma.card.updateMany({
        where: { companyId },
        data: { isActive },
      });
      return true;
    } catch (error) {
      console.error('Failed to update card status:', error);
      return false;
    }
  }

  // Keep backward compatibility
  async activateCard(companyId: string): Promise<boolean> {
    return this.updateCardStatus(companyId, true);
  }

  async disconnect(): Promise<void> {
    await prisma.$disconnect();
  }
}

export const db = new DatabaseService();
