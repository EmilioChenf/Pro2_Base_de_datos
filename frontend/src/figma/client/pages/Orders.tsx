import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, CreditCard, Eye, ShoppingBag } from 'lucide-react';

import { useStore } from '@/context/StoreContext';
import { fetchSaleById } from '@/services/catalogService';
import { formatCurrencyGTQ } from '@/utils/format';
import type { SaleDetail } from '@/types';

export function Orders() {
  const { orders, products } = useStore();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SaleDetail | null>(null);

  const productLookup = useMemo(
    () => new Map(products.map((product) => [Number(product.id), product])),
    [products],
  );

  const paymentMethodLabels: Record<string, string> = {
    Efectivo: 'Efectivo',
    Tarjeta: 'Tarjeta',
    Transferencia: 'Transferencia',
  };

  const status = { label: 'Procesando', color: 'bg-[rgba(165,255,242,0.65)] text-[#31534c]' };

  const handleToggleOrder = async (orderId: number) => {
    if (selectedOrderId === orderId) {
      setSelectedOrderId(null);
      setSelectedOrder(null);
      return;
    }

    const detail = await fetchSaleById(orderId);
    setSelectedOrderId(orderId);
    setSelectedOrder(detail);
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen brand-page-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No tienes pedidos aun</h1>
          <p className="text-gray-600 mb-8">
            Cuando realices tu primera compra, tus pedidos apareceran aqui
          </p>
          <Link
            to="/catalogo"
            className="inline-flex items-center space-x-2 brand-primary-gradient text-[#10231f] px-8 py-4 rounded-full font-bold  transition shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Explorar Productos</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen brand-page-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
          <p className="text-gray-600">
            Historial de {orders.length} pedido{orders.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id_venta} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="brand-primary-gradient text-[#10231f] p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-[#31534c] text-sm mb-1">Pedido</p>
                    <p className="text-2xl font-bold">#{order.id_venta}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[#31534c] text-sm mb-1">Total</p>
                      <p className="text-2xl font-bold">{formatCurrencyGTQ(order.total)}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-[var(--primary-hover)]" />
                    <div>
                      <p className="text-sm text-gray-600">Fecha</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(order.fecha).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-[var(--primary-hover)]" />
                    <div>
                      <p className="text-sm text-gray-600">Metodo de Pago</p>
                      <p className="font-semibold text-gray-900">
                        {paymentMethodLabels[order.metodo_pago] || order.metodo_pago}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-[var(--primary-hover)]" />
                    <div>
                      <p className="text-sm text-gray-600">Productos</p>
                      <p className="font-semibold text-gray-900">{order.items} articulos</p>
                    </div>
                  </div>
                </div>

                {selectedOrder?.id_venta === order.id_venta ? (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Productos</h3>
                    <div className="space-y-3 mb-4">
                      {selectedOrder.items.map((item) => {
                        const product = productLookup.get(item.id_producto);

                        return (
                          <div
                            key={item.id_detalle}
                            className="flex items-center space-x-4 p-3 brand-page-bg rounded-xl"
                          >
                            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                              {product ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : null}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm">
                                {item.producto}
                              </p>
                              <p className="text-gray-600 text-xs">
                                {item.cantidad} x {formatCurrencyGTQ(item.precio_unitario)}
                              </p>
                            </div>
                            <div className="font-bold text-gray-900">{formatCurrencyGTQ(item.subtotal)}</div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-[rgba(165,255,242,0.42)] rounded-xl p-4 mb-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Informacion de Contacto</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Nombre</p>
                          <p className="font-semibold text-gray-900">{selectedOrder.cliente}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Email</p>
                          <p className="font-semibold text-gray-900">{selectedOrder.correo}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Telefono</p>
                          <p className="font-semibold text-gray-900">{selectedOrder.telefono}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedOrderId(null);
                        setSelectedOrder(null);
                      }}
                      className="w-full py-3 bg-[rgba(173,235,179,0.55)] text-[#31534c] rounded-full font-semibold hover:bg-[rgba(173,235,179,0.8)] transition"
                    >
                      Ocultar Detalles
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleToggleOrder(order.id_venta)}
                    className="w-full py-3 brand-primary-gradient text-[#10231f] rounded-full font-semibold  transition flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-5 h-5" />
                    <span>Ver Detalles</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


