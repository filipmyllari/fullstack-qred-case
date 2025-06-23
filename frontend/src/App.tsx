import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import './App.css';
import {
  useDashboardData,
  useCompanySelection,
  useCardActivation,
  useCardDeactivation,
} from './api/dashboard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import { Button } from './components/ui/button';

function App() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<
    string | undefined
  >();
  const [imageError, setImageError] = useState<boolean>(false);

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useDashboardData(selectedCompanyId);
  const { mutate: selectCompany, isPending: isSelectingCompany } =
    useCompanySelection();
  const { mutate: activateCard, isPending: isActivating } = useCardActivation();
  const { mutate: deactivateCard, isPending: isDeactivating } =
    useCardDeactivation();

  const isUpdatingCard = isActivating || isDeactivating;

  // Update selected company ID when dashboard data changes
  useEffect(() => {
    if (dashboardData?.selectedCompany.id && !selectedCompanyId) {
      setSelectedCompanyId(dashboardData.selectedCompany.id);
    }
  }, [dashboardData?.selectedCompany.id, selectedCompanyId]);

  // Reset image error when company changes
  useEffect(() => {
    setImageError(false);
  }, [selectedCompanyId, dashboardData?.card.imageUrl]);

  const handleCompanySelect = (companyId: string) => {
    if (selectedCompanyId !== companyId) {
      setSelectedCompanyId(companyId);
      selectCompany(companyId);
    }
  };

  const handleCardAction = () => {
    if (!selectedCompanyId) return;

    if (dashboardData?.card.isActive) {
      deactivateCard(selectedCompanyId);
    } else {
      activateCard(selectedCompanyId);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white w-[428px] mx-auto rounded-2xl px-4 py-8 gap-10 flex flex-col items-center justify-center min-h-[600px]">
        <div className="text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white w-[428px] mx-auto rounded-2xl px-4 py-8 gap-10 flex flex-col items-center justify-center min-h-[600px]">
        <div className="text-red-600">Error loading dashboard data</div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="bg-white w-[428px] mx-auto rounded-2xl px-4 py-8 gap-10 flex flex-col">
      <div className="flex flex-row justify-between">
        <div className="bg-gray-200 px-6 py-4">LOGO</div>
        <div className="bg-gray-200 px-1 py-4">MENU</div>
      </div>
      <div>
        <Select
          value={selectedCompanyId}
          onValueChange={handleCompanySelect}
          disabled={isSelectingCompany}
        >
          <SelectTrigger className="bg-gray-200 rounded-none border-none h-auto px-4 py-6 text-base text-gray-700 hover:text-gray-900 w-full">
            <SelectValue>{dashboardData.selectedCompany.name}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {dashboardData.companies.map((company) => (
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
      <div className="flex flex-col relative">
        <div className="bg-gray-200 px-4 py-4 w-full h-[180px] items-center justify-center flex flex-col rounded-2xl relative">
          <div className="flex flex-row items-center justify-center relative w-full">
            {dashboardData.card.imageUrl && !imageError ? (
              <img
                src={dashboardData.card.imageUrl}
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
        {dashboardData.invoiceDue && (
          <div className="bg-gray-200 px-6 py-4 flex flex-row items-center justify-between w-[170px] absolute top-[-24px] left-1/2 transform -translate-x-1/2 shadow-lg">
            <p className="text-center">Invoice due</p>
            <ChevronRight className="w-8 h-8" />
          </div>
        )}
      </div>
      <div>
        <div className="bg-gray-200 px-4 py-4 w-full h-[180px] flex flex-col justify-between">
          <div className="self-start">
            <p>Remaining Spend</p>
          </div>
          <div className="self-center flex flex-row items-center justify-center relative w-full">
            <p>
              {dashboardData.spending.current}/{dashboardData.spending.limit}{' '}
              {dashboardData.spending.currency}
            </p>
            <ChevronRight className="w-8 h-8 absolute right-0" />
          </div>
          <div className="self-end">
            <p>Based on your set limit</p>
          </div>
        </div>
      </div>
      <div>
        <div className="py-4 w-full">
          <div className="bg-gray-200 py-2 px-4">
            <h2 className="flex flex-row items-center">Latest transactions</h2>
          </div>
          <div className="space-y-3 bg-gray-300 px-4 py-2">
            {dashboardData.recentTransactions.map((transaction) => (
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
              {dashboardData.transactionSummary.remainingCount} more items in
              transaction view
            </p>
            <ChevronRight className="w-4 h-4 absolute right-4" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          className="rounded-none"
          onClick={handleCardAction}
          disabled={isUpdatingCard}
        >
          {isUpdatingCard
            ? 'Updating...'
            : dashboardData.card.isActive
            ? 'Deactivate Card'
            : 'Activate Card'}
        </Button>
        <Button className="rounded-none">Contact Qreds Support</Button>
      </div>
    </div>
  );
}

export default App;
