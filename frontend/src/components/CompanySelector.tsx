import type { Company } from '@qred/shared';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface CompanySelectorProps {
  companies: Company[];
  selectedCompanyId: string | undefined;
  onCompanySelect: (companyId: string) => void;
  disabled?: boolean;
  selectedCompanyName?: string;
}

export function CompanySelector({
  companies,
  selectedCompanyId,
  onCompanySelect,
  disabled = false,
  selectedCompanyName,
}: CompanySelectorProps) {
  return (
    <div>
      <Select
        value={selectedCompanyId}
        onValueChange={onCompanySelect}
        disabled={disabled}
      >
        <SelectTrigger className="bg-gray-200 rounded-none border-none h-auto px-4 py-6 text-base text-gray-700 hover:text-gray-900 w-full">
          <SelectValue>{selectedCompanyName || 'Select Company'}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {companies.map((company) => (
            <SelectItem
              key={company.id}
              value={company.id}
              className="text-base"
            >
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
