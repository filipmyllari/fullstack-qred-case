import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Card } from '@qred/shared';

interface CardDisplayProps {
  card: Card;
  showInvoiceDue?: boolean;
}

export function CardDisplay({
  card,
  showInvoiceDue = false,
}: CardDisplayProps) {
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    setImageError(false);
  }, [card.imageUrl]);

  return (
    <div className="flex flex-col relative">
      <div className="bg-gray-200 px-4 py-4 w-full h-[180px] items-center justify-center flex flex-col rounded-2xl relative">
        <div className="flex flex-row items-center justify-center relative w-full">
          {card.imageUrl && !imageError ? (
            <img
              src={card.imageUrl}
              alt="Credit Card"
              className="w-full h-full object-cover rounded-xl"
              onError={() => setImageError(true)}
            />
          ) : (
            <p className="text-center">Credit Card</p>
          )}
          <ChevronRight className="w-8 h-8 absolute right-0" />
        </div>
      </div>
      {showInvoiceDue && (
        <div className="bg-gray-200 px-6 py-4 flex flex-row items-center justify-between w-[170px] absolute top-[-24px] left-1/2 transform -translate-x-1/2 shadow-lg">
          <p className="text-center">Invoice due</p>
          <ChevronRight className="w-8 h-8" />
        </div>
      )}
    </div>
  );
}
