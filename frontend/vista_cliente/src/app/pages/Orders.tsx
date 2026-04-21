import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Package, Calendar, CreditCard, Eye, ShoppingBag } from "lucide-react";

interface Order {
  id: string;
  date: string;
  items: any[];
  total: number;
  customer: any;
  paymentMethod: string;
  status: string;
}

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(storedOrders);
  }, []);

  const paymentMethodLabels: Record<string, string> = {
    efectivo: "Efectivo",
    tarjeta: "Tarjeta",
    transferencia: "Transferencia",
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
    procesando: { label: "Procesando", color: "bg-blue-100 text-blue-800" },
    enviado: { label: "Enviado", color: "bg-purple-100 text-purple-800" },
    entregado: { label: "Entregado", color: "bg-green-100 text-green-800" },
    cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800" },
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No tienes pedidos aún</h1>
          <p className="text-gray-600 mb-8">
            Cuando realices tu primera compra, tus pedidos aparecerán aquí
          </p>
          <Link
            to="/catalogo"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold hover:from-pink-600 hover:to-purple-600 transition shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Explorar Productos</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
          <p className="text-gray-600">Historial de {orders.length} pedido{orders.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-pink-100 text-sm mb-1">Pedido</p>
                    <p className="text-2xl font-bold">#{order.id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-pink-100 text-sm mb-1">Total</p>
                      <p className="text-2xl font-bold">${order.total}</p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full font-semibold ${
                        statusLabels[order.status]?.color || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {statusLabels[order.status]?.label || "Desconocido"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Fecha</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(order.date).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Método de Pago</p>
                      <p className="font-semibold text-gray-900">
                        {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Productos</p>
                      <p className="font-semibold text-gray-900">{order.items.length} artículos</p>
                    </div>
                  </div>
                </div>

                {selectedOrder?.id === order.id ? (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Productos</h3>
                    <div className="space-y-3 mb-4">
                      {order.items.map((item: any) => (
                        <div
                          key={item.product.id}
                          className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl"
                        >
                          <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm">
                              {item.product.name}
                            </p>
                            <p className="text-gray-600 text-xs">
                              {item.quantity} × ${item.product.price}
                            </p>
                          </div>
                          <div className="font-bold text-gray-900">
                            ${item.product.price * item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-purple-50 rounded-xl p-4 mb-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Información de Contacto</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Nombre</p>
                          <p className="font-semibold text-gray-900">{order.customer.fullName}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Email</p>
                          <p className="font-semibold text-gray-900">{order.customer.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Teléfono</p>
                          <p className="font-semibold text-gray-900">{order.customer.phone}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="w-full py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition"
                    >
                      Ocultar Detalles
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition flex items-center justify-center space-x-2"
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
