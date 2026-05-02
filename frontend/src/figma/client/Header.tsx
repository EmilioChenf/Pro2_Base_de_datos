import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { getTotalItems } = useCart();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    navigate(value.trim() ? `/catalogo?search=${encodeURIComponent(value)}` : '/catalogo');
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const totalItems = getTotalItems();
  const currentPath = `${location.pathname}${location.search}`;
  const navClass = (target: string) =>
    `text-[#31534c] hover:text-[var(--primary-hover)] transition ${
      currentPath === target ? 'text-[var(--primary-hover)] font-semibold' : ''
    }`;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b brand-soft-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/cliente" className="flex items-center space-x-2">
            <div className="w-10 h-10 brand-primary-gradient rounded-full flex items-center justify-center">
              <span className="text-[#10231f] font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Plushie Paradise
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/cliente" className={navClass('/cliente')}>
              Inicio
            </Link>
            <Link to="/catalogo" className={navClass('/catalogo')}>
              Catalogo
            </Link>
            <Link
              to="/catalogo?category=Peluches"
              className={navClass('/catalogo?category=Peluches')}
            >
              Peluches
            </Link>
            <Link
              to="/catalogo?brand=Escandalosos"
              className={navClass('/catalogo?brand=Escandalosos')}
            >
              Escandalosos
            </Link>
            <Link
              to="/catalogo?brand=Snoopy"
              className={navClass('/catalogo?brand=Snoopy')}
            >
              Snoopy
            </Link>
          </nav>

          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(event) => handleSearchChange(event.target.value)}
                className="w-full px-4 py-2 pl-10 border rounded-full focus:outline-none focus:border-transparent brand-input placeholder:text-[#58736d]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--primary-hover)]" />
            </div>
          </form>

          <div className="flex items-center space-x-4">
            <Link
              to="/ordenes"
              className="text-[#31534c] hover:text-[var(--primary-hover)] transition hidden sm:block"
            >
              <User className="w-6 h-6" />
            </Link>
            <Link to="/carrito" className="relative text-[#31534c] hover:text-[var(--primary-hover)] transition">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 brand-badge-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={logout}
              className="hidden lg:block text-sm text-[#31534c] hover:text-[var(--primary-hover)] transition"
            >
              Cerrar sesion
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#31534c]"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t brand-soft-border">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/cliente"
                className="text-[#31534c] hover:text-[var(--primary-hover)] transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/catalogo"
                className="text-[#31534c] hover:text-[var(--primary-hover)] transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Catalogo
              </Link>
              <Link
                to="/catalogo?category=Peluches"
                className="text-[#31534c] hover:text-[var(--primary-hover)] transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Peluches
              </Link>
              <Link
                to="/catalogo?brand=Escandalosos"
                className="text-[#31534c] hover:text-[var(--primary-hover)] transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Escandalosos
              </Link>
              <Link
                to="/catalogo?brand=Snoopy"
                className="text-[#31534c] hover:text-[var(--primary-hover)] transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Snoopy
              </Link>
              <Link
                to="/ordenes"
                className="text-[#31534c] hover:text-[var(--primary-hover)] transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mis Pedidos
              </Link>
              <button
                type="button"
                className="text-left text-[#31534c] hover:text-[var(--primary-hover)] transition"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
              >
                Cerrar sesion
              </button>
            </nav>
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <input
                  type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  className="w-full px-4 py-2 pl-10 border rounded-full focus:outline-none brand-input placeholder:text-[#58736d]"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--primary-hover)]" />
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
