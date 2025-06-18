import { useQuery } from '@tanstack/react-query';
import { DashboardDataSchema, type DashboardData } from '../types/api';

async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch('/api/dashboard');

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard: ${response.statusText}`);
  }

  const data = await response.json();

  return DashboardDataSchema.parse(data);
}

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  });
}
