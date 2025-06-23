import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpendingInfo } from '../SpendingInfo';
import type { SpendingInfo as SpendingInfoType } from '@qred/shared';

const mockSpending: SpendingInfoType = {
  current: 5000,
  limit: 10000,
  currency: 'kr',
};

const mockSpendingUSD: SpendingInfoType = {
  current: 1500,
  limit: 3000,
  currency: 'USD',
};

describe('SpendingInfo', () => {
  it('renders the spending information correctly', () => {
    render(<SpendingInfo spending={mockSpending} />);

    expect(screen.getByText('Remaining Spend')).toBeInTheDocument();
    expect(screen.getByText('5000/10000 kr')).toBeInTheDocument();
    expect(screen.getByText('Based on your set limit')).toBeInTheDocument();
  });

  it('renders spending information with different currency', () => {
    render(<SpendingInfo spending={mockSpendingUSD} />);

    expect(screen.getByText('1500/3000 USD')).toBeInTheDocument();
  });

  it('displays the correct spending format when current is 0', () => {
    const zeroSpending: SpendingInfoType = {
      current: 0,
      limit: 10000,
      currency: 'kr',
    };

    render(<SpendingInfo spending={zeroSpending} />);

    expect(screen.getByText('0/10000 kr')).toBeInTheDocument();
  });

  it('displays the correct spending format when limit is reached', () => {
    const limitReachedSpending: SpendingInfoType = {
      current: 10000,
      limit: 10000,
      currency: 'kr',
    };

    render(<SpendingInfo spending={limitReachedSpending} />);

    expect(screen.getByText('10000/10000 kr')).toBeInTheDocument();
  });
});
