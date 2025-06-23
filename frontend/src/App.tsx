import { useState, useEffect } from 'react';
import './App.css';
import {
  useDashboardData,
  useCompanySelection,
  useCardActivation,
  useCardDeactivation,
} from './api/dashboard';
import { CompanySelector } from './components/CompanySelector';
import { CardDisplay } from './components/CardDisplay';
import { SpendingInfo } from './components/SpendingInfo';
import { TransactionsList } from './components/TransactionsList';
import { CardActions } from './components/CardActions';

function App() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<
    string | undefined
  >();

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

  useEffect(() => {
    if (dashboardData?.selectedCompany.id && !selectedCompanyId) {
      setSelectedCompanyId(dashboardData.selectedCompany.id);
    }
  }, [dashboardData?.selectedCompany.id, selectedCompanyId]);

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

      <CompanySelector
        companies={dashboardData.companies}
        selectedCompanyId={selectedCompanyId}
        onCompanySelect={handleCompanySelect}
        disabled={isSelectingCompany}
        selectedCompanyName={dashboardData.selectedCompany.name}
      />

      <CardDisplay
        card={dashboardData.card}
        showInvoiceDue={dashboardData.invoiceDue}
      />

      <SpendingInfo spending={dashboardData.spending} />

      <TransactionsList
        transactions={dashboardData.recentTransactions}
        summary={dashboardData.transactionSummary}
      />

      <CardActions
        isCardActive={dashboardData.card.isActive}
        onCardAction={handleCardAction}
        isUpdating={isUpdatingCard}
      />
    </div>
  );
}

export default App;
