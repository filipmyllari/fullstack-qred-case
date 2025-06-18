import type {
  DashboardData,
  Transaction,
  PaginatedTransactions,
} from '../schemas.js';

// Mock dashboard data
export const mockDashboardData: DashboardData = {
  companies: [
    { id: '1', name: 'Company AB' },
    { id: '2', name: 'Company XYZ' },
  ],
  selectedCompany: { id: '1', name: 'Company AB' },
  card: {
    id: 'card-1',
    isActive: false,
    imageUrl:
      'https://via.placeholder.com/300x180/2563eb/ffffff?text=QRED+CARD',
  },
  invoiceDue: true,
  spending: {
    current: 5400,
    limit: 10000,
    currency: 'kr',
  },
  recentTransactions: [
    {
      id: '1',
      description: 'Transaction data',
      dataPoints: 'Data points',
      date: '2024-01-15',
    },
    {
      id: '2',
      description: 'Transaction data',
      dataPoints: 'Data points',
      date: '2024-01-14',
    },
    {
      id: '3',
      description: 'Transaction data',
      dataPoints: 'Data points',
      date: '2024-01-13',
    },
  ],
};

// Generate more transactions for pagination
export const allTransactions: Transaction[] = [
  ...mockDashboardData.recentTransactions,
  ...Array.from({ length: 54 }, (_, i) => ({
    id: `tx-${i + 4}`,
    description: `Business expense ${i + 4}`,
    dataPoints: `Location: Stockholm`,
    date: new Date(2024, 0, 12 - i).toISOString().split('T')[0],
  })),
];

export function getPaginatedTransactions(
  limit: number = 20,
  offset: number = 0
): PaginatedTransactions {
  const startIndex = offset;
  const endIndex = startIndex + limit;
  const transactions = allTransactions.slice(startIndex, endIndex);

  return {
    transactions,
    total: allTransactions.length,
    hasMore: endIndex < allTransactions.length,
  };
}
