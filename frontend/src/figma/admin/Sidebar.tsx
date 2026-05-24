import { LayoutDashboard, Package, FolderTree, Truck, Users, UserCog, ShoppingCart, CreditCard, BarChart3, Settings } from 'lucide-react';
import type { UserRole } from '@/types';

interface SidebarProps {
  activeSection: string;
  role?: UserRole;
  onSectionChange: (section: string) => void;
}

const permissions: Record<string, UserRole[]> = {
  dashboard: ['ADMIN', 'GERENTE', 'VENDEDOR', 'INVENTARIO'],
  products: ['ADMIN', 'GERENTE', 'INVENTARIO'],
  categories: ['ADMIN', 'GERENTE', 'INVENTARIO'],
  suppliers: ['ADMIN', 'GERENTE', 'INVENTARIO'],
  customers: ['ADMIN', 'GERENTE', 'VENDEDOR'],
  users: ['ADMIN'],
  sales: ['ADMIN', 'GERENTE', 'VENDEDOR'],
  payments: ['ADMIN', 'GERENTE'],
  reports: ['ADMIN', 'GERENTE'],
  settings: ['ADMIN'],
};

export function Sidebar({ activeSection, role, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'categories', label: 'Categorías', icon: FolderTree },
    { id: 'suppliers', label: 'Proveedores', icon: Truck },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'users', label: 'Usuarios', icon: UserCog },
    { id: 'sales', label: 'Ventas', icon: ShoppingCart },
    { id: 'payments', label: 'Métodos de Pago', icon: CreditCard },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ].filter((item) => role && permissions[item.id]?.includes(role));

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <h1 className="font-semibold text-xl text-gray-900">Peluche Store</h1>
        <p className="text-sm text-gray-500">Panel Administrativo</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
