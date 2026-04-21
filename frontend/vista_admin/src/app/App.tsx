import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { Products } from './components/Products';
import { Categories } from './components/Categories';
import { Suppliers } from './components/Suppliers';
import { Customers } from './components/Customers';
import { Users } from './components/Users';
import { Sales } from './components/Sales';
import { PaymentMethods } from './components/PaymentMethods';
import { Reports } from './components/Reports';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'categories':
        return <Categories />;
      case 'suppliers':
        return <Suppliers />;
      case 'customers':
        return <Customers />;
      case 'users':
        return <Users />;
      case 'sales':
        return <Sales />;
      case 'payments':
        return <PaymentMethods />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Configuración</h2>
            <p className="text-gray-600">Panel de configuración del sistema</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}