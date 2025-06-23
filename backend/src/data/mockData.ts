import type {
  DashboardData,
  Transaction,
  PaginatedTransactions,
} from '../schemas.js';

// Company-specific transaction data
const companyTransactions = {
  '1': [
    {
      id: '1',
      description: 'Office supplies',
      dataPoints: 'Stockholm HQ',
      date: '2024-01-15',
    },
    {
      id: '2',
      description: 'Marketing campaign',
      dataPoints: 'Google Ads',
      date: '2024-01-14',
    },
    {
      id: '3',
      description: 'Software license',
      dataPoints: 'Adobe Creative',
      date: '2024-01-13',
    },
    // Additional transactions for Company AB
    ...Array.from({ length: 54 }, (_, i) => ({
      id: `tx-ab-${i + 4}`,
      description: `Business expense ${i + 4}`,
      dataPoints: `Location: Stockholm`,
      date: new Date(2024, 0, 12 - i).toISOString().split('T')[0],
    })),
  ],
  '2': [
    {
      id: '4',
      description: 'Business travel',
      dataPoints: 'SAS Airlines',
      date: '2024-01-16',
    },
    {
      id: '5',
      description: 'Client dinner',
      dataPoints: 'Restaurant NK',
      date: '2024-01-15',
    },
    {
      id: '6',
      description: 'Equipment purchase',
      dataPoints: 'Dell Computers',
      date: '2024-01-14',
    },
    // Additional transactions for Company XYZ
    ...Array.from({ length: 42 }, (_, i) => ({
      id: `tx-xyz-${i + 7}`,
      description: `Company XYZ expense ${i + 7}`,
      dataPoints: `Location: Gothenburg`,
      date: new Date(2024, 0, 11 - i).toISOString().split('T')[0],
    })),
  ],
};

// Company-specific data
const companyData = {
  '1': {
    name: 'Company AB',
    card: {
      id: 'card-1',
      isActive: false,
      imageUrl: 'https://placeholdercard.com/300x180/2563eb/',
    },
    invoiceDue: true,
    spending: {
      current: 5400,
      limit: 10000,
      currency: 'kr',
    },
    recentTransactions: companyTransactions['1'].slice(0, 3), // First 3 transactions
  },
  '2': {
    name: 'Company XYZ',
    card: {
      id: 'card-2',
      isActive: true,
      imageUrl: 'https://placeholdercard.com/300x180/16a34a/',
    },
    invoiceDue: false,
    spending: {
      current: 8200,
      limit: 15000,
      currency: 'kr',
    },
    recentTransactions: companyTransactions['2'].slice(0, 3), // First 3 transactions
  },
};

// Available companies
const companies = [
  { id: '1', name: 'Company AB' },
  { id: '2', name: 'Company XYZ' },
];

// Function to get dashboard data for a specific company
export function getDashboardData(companyId: string = '1'): DashboardData {
  const company = companyData[companyId as keyof typeof companyData];

  if (!company) {
    throw new Error(`Company with id ${companyId} not found`);
  }

  // Get company-specific transactions
  const companyAllTransactions =
    companyTransactions[companyId as keyof typeof companyTransactions];
  const totalTransactions = companyAllTransactions.length;
  const recentTransactionsCount = company.recentTransactions.length;
  const remainingCount = totalTransactions - recentTransactionsCount;

  return {
    companies,
    selectedCompany: { id: companyId, name: company.name },
    card: company.card,
    invoiceDue: company.invoiceDue,
    spending: company.spending,
    recentTransactions: company.recentTransactions,
    transactionSummary: {
      totalTransactions,
      remainingCount,
    },
  };
}

// Default dashboard data (backward compatibility)
export const mockDashboardData: DashboardData = getDashboardData('1');

// Generate all transactions for pagination (using default company for now)
export const allTransactions: Transaction[] = companyTransactions['1'];

export function getPaginatedTransactions(
  limit: number = 20,
  offset: number = 0,
  companyId: string = '1'
): PaginatedTransactions {
  const companyAllTransactions =
    companyTransactions[companyId as keyof typeof companyTransactions] ||
    companyTransactions['1'];
  const startIndex = offset;
  const endIndex = startIndex + limit;
  const transactions = companyAllTransactions.slice(startIndex, endIndex);

  return {
    transactions,
    total: companyAllTransactions.length,
    hasMore: endIndex < companyAllTransactions.length,
  };
}
