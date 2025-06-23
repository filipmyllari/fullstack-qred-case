import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TransactionsList } from '../TransactionsList';
import type { Transaction, TransactionSummary } from '@qred/shared';

const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Coffee Shop Purchase',
    dataPoints: '125 kr',
    date: '2024-01-15',
  },
  {
    id: '2',
    description: 'Office Supplies',
    dataPoints: '250 kr',
    date: '2024-01-14',
  },
  {
    id: '3',
    description: 'Lunch Meeting',
    dataPoints: '450 kr',
    date: '2024-01-13',
  },
];

const mockSummary: TransactionSummary = {
  totalTransactions: 18,
  remainingCount: 15,
};

describe('TransactionsList', () => {
  it('renders the transactions list with header', () => {
    render(
      <TransactionsList transactions={mockTransactions} summary={mockSummary} />
    );

    expect(screen.getByText('Latest transactions')).toBeInTheDocument();
  });

  it('renders all transaction items', () => {
    render(
      <TransactionsList transactions={mockTransactions} summary={mockSummary} />
    );

    expect(screen.getByText('Coffee Shop Purchase')).toBeInTheDocument();
    expect(screen.getByText('125 kr')).toBeInTheDocument();
    expect(screen.getByText('Office Supplies')).toBeInTheDocument();
    expect(screen.getByText('250 kr')).toBeInTheDocument();
    expect(screen.getByText('Lunch Meeting')).toBeInTheDocument();
    expect(screen.getByText('450 kr')).toBeInTheDocument();
  });

  it('renders the summary with remaining count', () => {
    render(
      <TransactionsList transactions={mockTransactions} summary={mockSummary} />
    );

    expect(
      screen.getByText('15 more items in transaction view')
    ).toBeInTheDocument();
  });

  it('renders with empty transactions list', () => {
    const emptySummary: TransactionSummary = {
      totalTransactions: 0,
      remainingCount: 0,
    };

    render(<TransactionsList transactions={[]} summary={emptySummary} />);

    expect(screen.getByText('Latest transactions')).toBeInTheDocument();
    expect(
      screen.getByText('0 more items in transaction view')
    ).toBeInTheDocument();
  });
});
