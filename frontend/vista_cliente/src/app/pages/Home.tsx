import { Link } from "react-router";
import { products } from "../data/products";
import { ShoppingCart, Star, TrendingUp, Sparkles } from "lucide-react";
import { useCart } from "../contexts/CartContext";

export function Home() {
  const { addToCart } = useCart();

  const featuredProducts = products.filter((p) => p.isFeatured);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <div className="min-h-screen client-page-bg">
      {/* Hero Section */}
      <section className="client-hero-gradient text-[#10231f] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              ¡Bienvenido a Plushie Paradise!
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-[#31534c]">
              Descubre los peluches más adorables de Escandalosos y Snoopy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/catalogo"
                className="bg-white text-[var(--primary-hover)] px-8 py-4 rounded-full font-bold text-lg hover:bg-[rgba(165,255,242,0.55)] transition shadow-lg"
              >
                Ver Catálogo
              </Link>
              <Link
                to="/catalogo?category=Sets"
                className="bg-[var(--primary)] text-[#10231f] px-8 py-4 rounded-full font-bold text-lg hover:bg-[var(--primary-hover)] transition shadow-lg"
              >
                Ver Ofertas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
            <p className="text-gray-600 text-lg">Los favoritos de nuestros clientes</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition group"
              >
                <Link to={`/producto/${product.id}`} className="block">
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img
                      src={product.imagen}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = "/images/productos/placeholder-producto.png";
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    {product.stock < 10 && (
                      <span className="absolute top-3 right-3 bg-[var(--secondary)] text-[#10231f] px-3 py-1 rounded-full text-sm font-bold">
                        ¡Pocos!
                      </span>
                    )}
                  </div>
                </Link>
                <div className="p-6">
                  <p className="text-sm text-[var(--primary-hover)] font-semibold mb-1">{product.brand}</p>
                  <Link to={`/producto/${product.id}`}>
                    <h3 className="font-bold text-lg mb-2 text-gray-900 hover:text-[var(--primary-hover)] transition">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-[var(--primary-hover)]">${product.price}</span>
                    <span className="text-sm text-gray-500">{product.stock} disponibles</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full client-primary-gradient text-[#10231f] py-3 rounded-full font-bold  transition flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Agregar al Carrito</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 client-section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Categorías</h2>
            <p className="text-gray-600 text-lg">Explora por categoría</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              to="/catalogo?category=Peluches"
              className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition group"
            >
              <div className="w-20 h-20 bg-[rgba(173,235,179,0.58)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[rgba(173,235,179,0.8)] transition">
                <Star className="w-10 h-10 text-[var(--primary-hover)]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Peluches</h3>
              <p className="text-gray-600">Los más suaves y adorables</p>
            </Link>

            <Link
              to="/catalogo?category=Ropa"
              className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition group"
            >
              <div className="w-20 h-20 bg-[rgba(165,255,242,0.65)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[rgba(165,255,242,0.9)] transition">
                <TrendingUp className="w-10 h-10 text-[var(--primary-hover)]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ropa</h3>
              <p className="text-gray-600">Viste tu estilo favorito</p>
            </Link>

            <Link
              to="/catalogo?category=Accesorios"
              className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition group"
            >
              <div className="w-20 h-20 bg-[rgba(165,255,242,0.65)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[rgba(165,255,242,0.9)] transition">
                <Sparkles className="w-10 h-10 text-[var(--primary-hover)]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Accesorios</h3>
              <p className="text-gray-600">Complementa tu colección</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Los Más Vendidos</h2>
            <p className="text-gray-600 text-lg">Los favoritos de todos</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
              >
                <Link to={`/producto/${product.id}`}>
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={product.imagen}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = "/images/productos/placeholder-producto.png";
                      }}
                      className="w-full h-full object-cover hover:scale-110 transition duration-300"
                    />
                  </div>
                </Link>
                <div className="p-5">
                  <p className="text-xs text-[var(--primary-hover)] font-semibold mb-1">{product.category}</p>
                  <Link to={`/producto/${product.id}`}>
                    <h3 className="font-bold text-base mb-2 text-gray-900 hover:text-[var(--primary-hover)] transition">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[var(--primary-hover)]">${product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-[var(--primary)] text-[#10231f] p-2 rounded-full hover:bg-[var(--primary-hover)] transition"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 client-page-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuevos Productos</h2>
            <p className="text-gray-600 text-lg">Recién llegados a la tienda</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
              >
                <Link to={`/producto/${product.id}`}>
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={product.imagen}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = "/images/productos/placeholder-producto.png";
                      }}
                      className="w-full h-full object-cover hover:scale-110 transition duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-[var(--primary)] text-[#10231f] px-3 py-1 rounded-full text-sm font-bold">
                      Nuevo
                    </span>
                  </div>
                </Link>
                <div className="p-5">
                  <p className="text-xs text-[var(--primary-hover)] font-semibold mb-1">{product.category}</p>
                  <Link to={`/producto/${product.id}`}>
                    <h3 className="font-bold text-base mb-2 text-gray-900 hover:text-[var(--primary-hover)] transition">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[var(--primary-hover)]">${product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-[var(--primary)] text-[#10231f] p-2 rounded-full hover:bg-[var(--primary-hover)] transition"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 client-hero-gradient text-[#10231f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">¿Listo para comenzar tu colección?</h2>
          <p className="text-xl mb-8 text-[#31534c]">
            Tenemos los mejores peluches y merchandising oficial
          </p>
          <Link
            to="/catalogo"
            className="bg-white text-[var(--primary-hover)] px-10 py-4 rounded-full font-bold text-lg hover:bg-[rgba(165,255,242,0.55)] transition shadow-lg inline-block"
          >
            Explorar Catálogo Completo
          </Link>
        </div>
      </section>
    </div>
  );
}





