import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CompanySelector } from '../CompanySelector';
import type { Company } from '@qred/shared';

const mockCompanies: Company[] = [
  { id: '1', name: 'Company A' },
  { id: '2', name: 'Company B' },
  { id: '3', name: 'Company C' },
];

describe('CompanySelector', () => {
  it('renders the component when no company is selected', () => {
    const mockOnCompanySelect = vi.fn();

    render(
      <CompanySelector
        companies={mockCompanies}
        selectedCompanyId={undefined}
        onCompanySelect={mockOnCompanySelect}
        selectedCompanyName=""
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays the selected company name when a company is selected', () => {
    const mockOnCompanySelect = vi.fn();

    render(
      <CompanySelector
        companies={mockCompanies}
        selectedCompanyId="1"
        onCompanySelect={mockOnCompanySelect}
        selectedCompanyName="Company A"
      />
    );

    expect(screen.getByText('Company A')).toBeInTheDocument();
  });

  it('renders the select trigger as disabled when disabled prop is true', () => {
    const mockOnCompanySelect = vi.fn();

    render(
      <CompanySelector
        companies={mockCompanies}
        selectedCompanyId="1"
        onCompanySelect={mockOnCompanySelect}
        selectedCompanyName="Company A"
        disabled={true}
      />
    );

    const selectTrigger = screen.getByRole('combobox');
    expect(selectTrigger).toBeDisabled();
  });

  it('renders without crashing when companies array is empty', () => {
    const mockOnCompanySelect = vi.fn();

    render(
      <CompanySelector
        companies={[]}
        selectedCompanyId={undefined}
        onCompanySelect={mockOnCompanySelect}
        selectedCompanyName=""
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
