import { useEffect, useMemo } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, CreditCard, Calendar, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Confirmation() {
  const location = useLocation();
  const order = location.state?.order;
  const customer = location.state?.customer;
  const items = location.state?.items ?? [];

  useEffect(() => {
    if (order) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [order]);

  if (!order) {
    return <Navigate to="/cliente" replace />;
  }

  const orderDate = new Date(order.fecha);
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const orderItems = useMemo(
    () =>
      order.items.map((detail: any) => {
        const cartItem = items.find(
          (item: any) => Number(item.product.id) === detail.id_producto,
        );

        return {
          detail,
          product: cartItem?.product ?? null,
          quantity: cartItem?.quantity ?? detail.cantidad,
        };
      }),
    [items, order.items],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <CheckCircle className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Compra Realizada con Exito
          </h1>
          <p className="text-xl text-gray-600">
            Gracias por tu compra, {(customer?.fullName ?? order.cliente).split(' ')[0]}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-pink-100 text-sm mb-1">Numero de Pedido</p>
                <p className="text-2xl font-bold">#{order.id_venta}</p>
              </div>
              <div className="text-right">
                <p className="text-pink-100 text-sm mb-1">Total Pagado</p>
                <p className="text-3xl font-bold">${order.total} MXN</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Metodo de Pago</h3>
                </div>
                <p className="text-gray-700">{order.metodo_pago}</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Fecha de Pedido</h3>
                </div>
                <p className="text-gray-700">
                  {orderDate.toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Entrega Estimada</h3>
                </div>
                <p className="text-gray-700">
                  {estimatedDelivery.toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Informacion de Contacto</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Nombre</p>
                  <p className="font-semibold text-gray-900">
                    {customer?.fullName ?? order.cliente}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Correo Electronico</p>
                  <p className="font-semibold text-gray-900">
                    {customer?.email ?? order.correo}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Telefono</p>
                  <p className="font-semibold text-gray-900">
                    {customer?.phone ?? order.telefono}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Estado</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                    Procesando
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-4">Productos Comprados</h3>
              <div className="space-y-4">
                {orderItems.map(({ detail, product, quantity }: any) => (
                  <div
                    key={detail.id_detalle}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      {product ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{detail.producto}</p>
                      <p className="text-gray-600 text-sm">
                        {product ? `${product.brand} - ${product.category}` : 'Producto comprado'}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Cantidad: {quantity} × ${detail.precio_unitario}
                      </p>
                    </div>
                    <div className="font-bold text-gray-900 text-lg">${detail.subtotal}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Que sigue</h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-bold text-sm">1</span>
              </div>
              <p>Recibiras un correo de confirmacion en {customer?.email ?? order.correo}</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-bold text-sm">2</span>
              </div>
              <p>Prepararemos tu pedido con mucho cuidado</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-bold text-sm">3</span>
              </div>
              <p>Te notificaremos cuando tu pedido este en camino</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-bold text-sm">4</span>
              </div>
              <p>Recibiras tu pedido en aproximadamente 5 dias habiles</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/ordenes"
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-full font-bold text-center hover:from-pink-600 hover:to-purple-600 transition shadow-lg hover:shadow-xl"
          >
            Ver Mis Pedidos
          </Link>
          <Link
            to="/catalogo"
            className="flex-1 bg-white border-2 border-purple-500 text-purple-600 py-4 rounded-full font-bold text-center hover:bg-purple-50 transition flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Seguir Comprando</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
