import { ChevronRight } from 'lucide-react';
import type { SpendingInfo } from '@qred/shared';

interface SpendingInfoProps {
  spending: SpendingInfo;
}

export function SpendingInfo({ spending }: SpendingInfoProps) {
  return (
    <div>
      <div className="bg-gray-200 px-4 py-4 w-full h-[180px] flex flex-col justify-between">
        <div className="self-start">
          <p>Remaining Spend</p>
        </div>
        <div className="self-center flex flex-row items-center justify-center relative w-full">
          <p>
            {spending.current}/{spending.limit} {spending.currency}
          </p>
          <ChevronRight className="w-8 h-8 absolute right-0" />
        </div>
        <div className="self-end">
          <p>Based on your set limit</p>
        </div>
      </div>
    </div>
  );
}
