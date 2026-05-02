import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { formatCurrencyGTQ } from '@/utils/format';
import { useImageFallback } from '@/utils/images';

export function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen brand-page-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-16 h-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito esta vacio</h1>
          <p className="text-gray-600 mb-8">
            Agrega productos a tu carrito para continuar con tu compra
          </p>
          <Link
            to="/catalogo"
            className="inline-flex items-center space-x-2 brand-primary-gradient text-[#10231f] px-8 py-4 rounded-full font-bold  transition shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Explorar Productos</span>
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen brand-page-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.product.id} className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <Link
                        to={`/producto/${item.product.id}`}
                        className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          onError={useImageFallback}
                          className="w-full h-full object-cover hover:scale-110 transition duration-300"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Link
                              to={`/producto/${item.product.id}`}
                              className="font-bold text-lg text-gray-900 hover:text-[var(--primary-hover)] transition"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.product.brand} - {item.product.category}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(Number(item.product.id))}
                            className="text-[#057f63] hover:text-[var(--primary-hover)] transition p-2"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-700 font-medium">Cantidad:</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  updateQuantity(Number(item.product.id), item.quantity - 1)
                                }
                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-[rgba(173,235,179,0.8)] transition"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="text-lg font-bold text-gray-900 w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(Number(item.product.id), item.quantity + 1)
                                }
                                disabled={item.quantity >= item.product.stock}
                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-[rgba(173,235,179,0.8)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              {formatCurrencyGTQ(item.product.price)} x {item.quantity}
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                              {formatCurrencyGTQ(item.product.price * item.quantity)}
                            </div>
                          </div>
                        </div>

                        {item.quantity >= item.product.stock && (
                          <p className="text-[#057f63] text-sm mt-2">
                            Cantidad maxima disponible alcanzada
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/catalogo"
              className="inline-flex items-center space-x-2 text-[var(--primary-hover)] hover:text-[#057f63] font-semibold mt-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Continuar Comprando</span>
            </Link>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrencyGTQ(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Envio</span>
                  <span className="font-semibold text-[var(--primary-hover)]">Gratis</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-bold text-gray-900">{formatCurrencyGTQ(totalPrice)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">GTQ (IVA incluido)</p>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full brand-primary-gradient text-[#10231f] py-4 rounded-full font-bold text-lg  transition shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Finalizar Compra</span>
              </Link>

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-[rgba(173,235,179,0.58)] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--primary-hover)] text-xs">✓</span>
                  </div>
                  <span>Envio gratis en toda la republica</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-[rgba(173,235,179,0.58)] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--primary-hover)] text-xs">✓</span>
                  </div>
                  <span>Devoluciones dentro de 30 dias</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-[rgba(173,235,179,0.58)] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--primary-hover)] text-xs">✓</span>
                  </div>
                  <span>Compra 100% segura</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


