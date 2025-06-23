import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardDisplay } from '../CardDisplay';
import type { Card } from '@qred/shared';

const mockCard: Card = {
  id: '1',
  isActive: true,
  imageUrl: 'https://example.com/card.jpg',
};

const mockCardWithoutImage: Card = {
  id: '1',
  isActive: false,
  imageUrl: undefined,
};

describe('CardDisplay', () => {
  it('renders the card display with image when imageUrl is provided', () => {
    render(<CardDisplay card={mockCard} />);

    const cardImage = screen.getByAltText('Credit Card');
    expect(cardImage).toBeInTheDocument();
    expect(cardImage).toHaveAttribute('src', 'https://example.com/card.jpg');
  });

  it('renders fallback text when no imageUrl is provided', () => {
    render(<CardDisplay card={mockCardWithoutImage} />);

    expect(screen.getByText('Credit Card')).toBeInTheDocument();
  });

  it('shows invoice due banner when showInvoiceDue is true', () => {
    render(<CardDisplay card={mockCard} showInvoiceDue />);

    expect(screen.getByText('Invoice due')).toBeInTheDocument();
  });

  it('does not show invoice due banner when showInvoiceDue is false', () => {
    render(<CardDisplay card={mockCard} showInvoiceDue={false} />);

    expect(screen.queryByText('Invoice due')).not.toBeInTheDocument();
  });
});
