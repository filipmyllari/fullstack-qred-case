import { ChevronRight } from 'lucide-react';
import type { Transaction, TransactionSummary } from '@qred/shared';

interface TransactionsListProps {
  transactions: Transaction[];
  summary: TransactionSummary;
}

export function TransactionsList({
  transactions,
  summary,
}: TransactionsListProps) {
  return (
    <div>
      <div className="py-4 w-full">
        <div className="bg-gray-200 py-2 px-4">
          <h2 className="flex flex-row items-center">Latest transactions</h2>
        </div>
        <div className="space-y-3 bg-gray-300 px-4 py-2">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex flex-row justify-between items-center py-2"
            >
              <p className="text-gray-700">{transaction.description}</p>
              <p className="text-gray-700">{transaction.dataPoints}</p>
            </div>
          ))}
        </div>
        <div className="bg-white px-4 py-2 flex flex-row justify-center items-center border border-black relative">
          <p className="text-gray-700">
            {summary.remainingCount} more items in transaction view
          </p>
          <ChevronRight className="w-4 h-4 absolute right-4" />
        </div>
      </div>
    </div>
  );
}
