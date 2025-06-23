import { Button } from './ui/button';

interface CardActionsProps {
  isCardActive: boolean;
  onCardAction: () => void;
  isUpdating: boolean;
}

export function CardActions({
  isCardActive,
  onCardAction,
  isUpdating,
}: CardActionsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        className="rounded-none"
        onClick={onCardAction}
        disabled={isUpdating}
      >
        {isUpdating
          ? 'Updating...'
          : isCardActive
          ? 'Deactivate Card'
          : 'Activate Card'}
      </Button>
      <Button className="rounded-none">Contact Qreds Support</Button>
    </div>
  );
}
