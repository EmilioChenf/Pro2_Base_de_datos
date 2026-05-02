import { Link, useNavigate } from "react-router";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useState } from "react";

export function Header() {
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const totalItems = getTotalItems();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b client-soft-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 client-primary-gradient rounded-full flex items-center justify-center">
              <span className="text-[#10231f] font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-[#10231f] hidden sm:block">
              Plushie Paradise
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-[#31534c] hover:text-[var(--primary-hover)] transition">
              Inicio
            </Link>
            <Link to="/catalogo" className="text-[#31534c] hover:text-[var(--primary-hover)] transition">
              Catálogo
            </Link>
            <Link to="/catalogo?category=Peluches" className="text-[#31534c] hover:text-[var(--primary-hover)] transition">
              Peluches
            </Link>
            <Link to="/catalogo?brand=Escandalosos" className="text-[#31534c] hover:text-[var(--primary-hover)] transition">
              Escandalosos
            </Link>
            <Link to="/catalogo?brand=Snoopy" className="text-[#31534c] hover:text-[var(--primary-hover)] transition">
              Snoopy
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border rounded-full focus:outline-none focus:border-transparent client-input placeholder:text-[#58736d]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--primary-hover)]" />
            </div>
          </form>

          {/* Actions */}
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
                <span className="absolute -top-2 -right-2 client-badge-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#31534c]"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t client-soft-border">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
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
                Catálogo
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
            </nav>
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border rounded-full focus:outline-none client-input placeholder:text-[#58736d]"
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
