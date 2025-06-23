import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DashboardDataSchema,
  PaginatedTransactionsSchema,
  CardActivationResponseSchema,
  type DashboardData,
  type PaginatedTransactions,
  type CardActivationResponse,
} from '@qred/shared';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

async function fetchDashboardData(companyId?: string): Promise<DashboardData> {
  const url = companyId
    ? `${API_BASE_URL}/api/dashboard?companyId=${companyId}`
    : `${API_BASE_URL}/api/dashboard`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard: ${response.statusText}`);
  }

  const data = await response.json();
  return DashboardDataSchema.parse(data);
}

async function selectCompany(companyId: string): Promise<DashboardData> {
  const response = await fetch(`${API_BASE_URL}/api/company/select`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ companyId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to select company: ${response.statusText}`);
  }

  const data = await response.json();
  return DashboardDataSchema.parse(data);
}

async function fetchTransactions(
  limit: number = 20,
  offset: number = 0
): Promise<PaginatedTransactions> {
  const response = await fetch(
    `${API_BASE_URL}/api/transactions?limit=${limit}&offset=${offset}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.statusText}`);
  }

  const data = await response.json();
  return PaginatedTransactionsSchema.parse(data);
}

async function activateCard(
  companyId: string
): Promise<CardActivationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/card/activate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ companyId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to activate card: ${response.statusText}`);
  }

  const data = await response.json();
  return CardActivationResponseSchema.parse(data);
}

async function deactivateCard(
  companyId: string
): Promise<CardActivationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/card/deactivate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ companyId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to deactivate card: ${response.statusText}`);
  }

  const data = await response.json();
  return CardActivationResponseSchema.parse(data);
}

// Generic function for both actions
async function updateCardStatus(
  companyId: string,
  isActive: boolean
): Promise<CardActivationResponse> {
  return isActive ? activateCard(companyId) : deactivateCard(companyId);
}

export function useDashboardData(companyId?: string) {
  return useQuery({
    queryKey: ['dashboard', companyId],
    queryFn: () => fetchDashboardData(companyId),
  });
}

export function useCompanySelection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: selectCompany,
    onSuccess: (data) => {
      // Set the specific company data in cache
      queryClient.setQueryData(['dashboard', data.selectedCompany.id], data);
      // Remove the default/undefined query to force refetch with company ID
      queryClient.removeQueries({ queryKey: ['dashboard', undefined] });
      // Invalidate other company queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
        predicate: (query) => query.queryKey[1] !== data.selectedCompany.id,
      });
    },
  });
}

export function useTransactions(limit: number = 20, offset: number = 0) {
  return useQuery({
    queryKey: ['transactions', limit, offset],
    queryFn: () => fetchTransactions(limit, offset),
  });
}

export function useCardActivation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateCard,
    onSuccess: (_, companyId) => {
      // Only invalidate the specific company's dashboard data
      queryClient.invalidateQueries({ queryKey: ['dashboard', companyId] });
    },
  });
}

export function useCardDeactivation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateCard,
    onSuccess: (_, companyId) => {
      // Only invalidate the specific company's dashboard data
      queryClient.invalidateQueries({ queryKey: ['dashboard', companyId] });
    },
  });
}

// Generic hook for both operations (can be used if toggle behavior is preferred)
export function useCardStatusUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyId,
      isActive,
    }: {
      companyId: string;
      isActive: boolean;
    }) => updateCardStatus(companyId, isActive),
    onSuccess: (_, { companyId }) => {
      // Invalidate dashboard queries to refresh card status
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', companyId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', undefined] });
    },
  });
}
