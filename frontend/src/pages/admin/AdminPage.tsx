import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { Categories } from '@/figma/admin/Categories';
import { Customers } from '@/figma/admin/Customers';
import { Dashboard } from '@/figma/admin/Dashboard';
import { PaymentMethods } from '@/figma/admin/PaymentMethods';
import { Products } from '@/figma/admin/Products';
import { Reports } from '@/figma/admin/Reports';
import { Sales } from '@/figma/admin/Sales';
import { Sidebar } from '@/figma/admin/Sidebar';
import { Suppliers } from '@/figma/admin/Suppliers';
import { TopBar } from '@/figma/admin/TopBar';
import { Users } from '@/figma/admin/Users';
import { Toaster } from '@/figma/admin/ui/sonner';
import type { UserRole } from '@/types';

const SECTION_PERMISSIONS: Record<string, UserRole[]> = {
  dashboard: ['ADMIN', 'GERENTE'],
  products: ['ADMIN', 'INVENTARIO'],
  categories: ['ADMIN', 'INVENTARIO'],
  suppliers: ['ADMIN', 'INVENTARIO'],
  customers: ['ADMIN', 'GERENTE', 'VENDEDOR'],
  users: ['ADMIN'],
  sales: ['ADMIN', 'GERENTE', 'VENDEDOR'],
  payments: ['ADMIN'],
  reports: ['ADMIN', 'GERENTE'],
  settings: ['ADMIN'],
};

const DEFAULT_SECTION_BY_ROLE: Record<UserRole, string> = {
  ADMIN: 'dashboard',
  GERENTE: 'dashboard',
  VENDEDOR: 'sales',
  INVENTARIO: 'products',
  CLIENTE: 'dashboard',
};

function canAccessSection(role: UserRole | undefined, section: string) {
  return Boolean(role && SECTION_PERMISSIONS[section]?.includes(role));
}

function getDefaultSection(role: UserRole | undefined) {
  return role ? DEFAULT_SECTION_BY_ROLE[role] : 'dashboard';
}

export function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const requestedSection = searchParams.get('section') ?? 'dashboard';
  const activeSection = canAccessSection(user?.rol, requestedSection)
    ? requestedSection
    : getDefaultSection(user?.rol);

  const content = useMemo(() => {
    switch (activeSection) {
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
      default:
        return canAccessSection(user?.rol, activeSection) ? (
          <Dashboard />
        ) : (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
            Acceso denegado para tu rol.
          </div>
        );
    }
  }, [activeSection, user?.rol]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        role={user?.rol}
        onSectionChange={(section) => setSearchParams({ section })}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={user} onLogout={logout} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{content}</div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}
