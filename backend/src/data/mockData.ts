import type { DashboardData } from '../schemas.js';

export const mockDashboardData: DashboardData = {
  companies: [
    { id: '1', name: 'Company AB' },
    { id: '2', name: 'Company XYZ' },
  ],
  selectedCompany: { id: '1', name: 'Company AB' },
  invoiceDue: true,
  cardImage: 'https://via.placeholder.com/300x180/2563eb/ffffff?text=QRED+CARD',
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
  totalTransactions: 57,
  cardActivated: false,
};
