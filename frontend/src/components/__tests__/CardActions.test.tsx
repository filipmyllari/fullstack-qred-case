import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardActions } from '../CardActions';

describe('CardActions', () => {
  it('renders activate button when card is inactive', () => {
    const mockOnCardAction = vi.fn();

    render(
      <CardActions
        isCardActive={false}
        onCardAction={mockOnCardAction}
        isUpdating={false}
      />
    );

    expect(screen.getByText('Activate Card')).toBeInTheDocument();
    expect(screen.getByText('Contact Qreds Support')).toBeInTheDocument();
  });

  it('renders deactivate button when card is active', () => {
    const mockOnCardAction = vi.fn();

    render(
      <CardActions
        isCardActive={true}
        onCardAction={mockOnCardAction}
        isUpdating={false}
      />
    );

    expect(screen.getByText('Deactivate Card')).toBeInTheDocument();
  });

  it('shows updating state when isUpdating is true', () => {
    const mockOnCardAction = vi.fn();

    render(
      <CardActions
        isCardActive={false}
        onCardAction={mockOnCardAction}
        isUpdating={true}
      />
    );

    expect(screen.getByText('Updating...')).toBeInTheDocument();
  });

  it('calls onCardAction when button is clicked', () => {
    const mockOnCardAction = vi.fn();

    render(
      <CardActions
        isCardActive={false}
        onCardAction={mockOnCardAction}
        isUpdating={false}
      />
    );

    fireEvent.click(screen.getByText('Activate Card'));
    expect(mockOnCardAction).toHaveBeenCalledTimes(1);
  });
});
