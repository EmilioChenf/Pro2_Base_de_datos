import { useParams, Link } from "react-router";
import { products } from "../data/products";
import { ShoppingCart, Minus, Plus, Package, Tag, Award } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useState } from "react";

export function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen client-page-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <Link to="/catalogo" className="text-[var(--primary-hover)] hover:text-[#057f63] font-semibold">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.brand === product.brand || p.category === product.category))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen client-page-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link to="/" className="hover:text-[var(--primary-hover)]">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to="/catalogo" className="hover:text-[var(--primary-hover)]">Catálogo</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={product.imagen}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = "/images/productos/placeholder-producto.png";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-[var(--primary)] text-[#10231f] px-4 py-2 rounded-full font-bold">
                  Nuevo
                </span>
              )}
              {product.isBestSeller && (
                <span className="absolute top-4 right-4 bg-[var(--secondary)] text-[#10231f] px-4 py-2 rounded-full font-bold flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>Best Seller</span>
                </span>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-3 mb-3">
                <span className="bg-[rgba(165,255,242,0.65)] text-[#057f63] px-3 py-1 rounded-full text-sm font-semibold">
                  {product.brand}
                </span>
                <span className="bg-[rgba(173,235,179,0.58)] text-[#057f63] px-3 py-1 rounded-full text-sm font-semibold">
                  {product.category}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-baseline space-x-4 mb-6">
                <span className="text-5xl font-bold text-[var(--primary-hover)]">${product.price}</span>
                <span className="text-gray-500">MXN</span>
              </div>

              <div className="client-page-bg rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Package className="w-5 h-5 text-gray-700" />
                  <span className="font-semibold text-gray-900">Disponibilidad</span>
                </div>
                {product.stock > 0 ? (
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-[var(--primary)] rounded-full"></span>
                    <span className="text-gray-700">
                      {product.stock} unidades en stock
                      {product.stock < 10 && " - ¡Pocas unidades disponibles!"}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-[rgba(173,235,179,0.7)] rounded-full"></span>
                    <span className="text-gray-700">Agotado</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Cantidad</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-[rgba(173,235,179,0.8)] transition"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold text-gray-900 w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-[rgba(173,235,179,0.8)] transition"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 rounded-full font-bold text-lg transition flex items-center justify-center space-x-3 mb-4 ${
                  product.stock === 0
                    ? "bg-[rgba(173,235,179,0.45)] text-[#58736d] cursor-not-allowed"
                    : "client-primary-gradient text-[#10231f]  shadow-lg hover:shadow-xl"
                }`}
              >
                <ShoppingCart className="w-6 h-6" />
                <span>{product.stock === 0 ? "Agotado" : "Agregar al Carrito"}</span>
              </button>

              <Link
                to="/catalogo"
                className="w-full py-4 rounded-full font-bold text-lg transition flex items-center justify-center border-2 border-gray-300 text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary-hover)]"
              >
                Seguir Comprando
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Productos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/producto/${relatedProduct.id}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition group"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={relatedProduct.imagen}
                      alt={relatedProduct.name}
                      onError={(e) => {
                        e.currentTarget.src = "/images/productos/placeholder-producto.png";
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-[var(--primary-hover)] font-semibold mb-1">{relatedProduct.brand}</p>
                    <h3 className="font-bold text-base mb-2 text-gray-900 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-[var(--primary-hover)]">${relatedProduct.price}</span>
                      <Tag className="w-5 h-5 text-[var(--primary-hover)]" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}





