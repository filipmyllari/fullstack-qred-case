import './App.css';
import { useDashboardData } from './api/dashboard';

function App() {
  const { data: dashboardData, isLoading, error } = useDashboardData();

  return (
    <div className="app">
      <h1>Qred Dashboard</h1>

      {/* Dashboard Data Display */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <h2>Dashboard Data</h2>
        {isLoading && <p>Loading dashboard...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
        {dashboardData && (
          <div style={{ textAlign: 'left' }}>
            <p>
              <strong>Company:</strong> {dashboardData.selectedCompany.name}
            </p>
            <p>
              <strong>Invoice Due:</strong>{' '}
              {dashboardData.invoiceDue ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Card Activated:</strong>{' '}
              {dashboardData.cardActivated ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Spending:</strong>{' '}
              {dashboardData.spending.current.toLocaleString()} /{' '}
              {dashboardData.spending.limit.toLocaleString()}{' '}
              {dashboardData.spending.currency}
            </p>
            <p>
              <strong>Recent Transactions:</strong>{' '}
              {dashboardData.recentTransactions.length} shown,{' '}
              {dashboardData.totalTransactions} total
            </p>
            <details>
              <summary>Raw API Response</summary>
              <pre
                style={{
                  fontSize: '12px',
                  textAlign: 'left',
                  overflow: 'auto',
                  color: 'black',
                  background: '#f5f5f5',
                  padding: '1rem',
                  borderRadius: '4px',
                }}
              >
                {JSON.stringify(dashboardData, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
