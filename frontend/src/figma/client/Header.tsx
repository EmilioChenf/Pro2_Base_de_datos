import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { getTotalItems } = useCart();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const totalItems = getTotalItems();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/cliente" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Plushie Paradise
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/cliente" className="text-gray-700 hover:text-pink-500 transition">
              Inicio
            </Link>
            <Link to="/catalogo" className="text-gray-700 hover:text-pink-500 transition">
              Catalogo
            </Link>
            <Link
              to="/catalogo?category=Peluches"
              className="text-gray-700 hover:text-pink-500 transition"
            >
              Peluches
            </Link>
            <Link
              to="/catalogo?brand=Escandalosos"
              className="text-gray-700 hover:text-pink-500 transition"
            >
              Escandalosos
            </Link>
            <Link
              to="/catalogo?brand=Snoopy"
              className="text-gray-700 hover:text-pink-500 transition"
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
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </form>

          <div className="flex items-center space-x-4">
            <Link
              to="/ordenes"
              className="text-gray-700 hover:text-pink-500 transition hidden sm:block"
            >
              <User className="w-6 h-6" />
            </Link>
            <Link to="/carrito" className="relative text-gray-700 hover:text-pink-500 transition">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={logout}
              className="hidden lg:block text-sm text-gray-700 hover:text-pink-500 transition"
            >
              Cerrar sesion
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/cliente"
                className="text-gray-700 hover:text-pink-500 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/catalogo"
                className="text-gray-700 hover:text-pink-500 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Catalogo
              </Link>
              <Link
                to="/catalogo?category=Peluches"
                className="text-gray-700 hover:text-pink-500 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Peluches
              </Link>
              <Link
                to="/catalogo?brand=Escandalosos"
                className="text-gray-700 hover:text-pink-500 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Escandalosos
              </Link>
              <Link
                to="/catalogo?brand=Snoopy"
                className="text-gray-700 hover:text-pink-500 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Snoopy
              </Link>
              <Link
                to="/ordenes"
                className="text-gray-700 hover:text-pink-500 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mis Pedidos
              </Link>
              <button
                type="button"
                className="text-left text-gray-700 hover:text-pink-500 transition"
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
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
