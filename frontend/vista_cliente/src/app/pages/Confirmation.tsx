import { useLocation, Link, Navigate } from "react-router";
import { CheckCircle, Package, CreditCard, Calendar, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export function Confirmation() {
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    if (order) {
      // Celebrate with confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [order]);

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const paymentMethodLabels = {
    efectivo: "Efectivo",
    tarjeta: "Tarjeta de Crédito/Débito",
    transferencia: "Transferencia Bancaria",
  };

  const orderDate = new Date(order.date);
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <CheckCircle className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ¡Compra Realizada con Éxito!
          </h1>
          <p className="text-xl text-gray-600">
            Gracias por tu compra, {order.customer.fullName.split(" ")[0]}
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-pink-100 text-sm mb-1">Número de Pedido</p>
                <p className="text-2xl font-bold">#{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-pink-100 text-sm mb-1">Total Pagado</p>
                <p className="text-3xl font-bold">${order.total} MXN</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Método de Pago</h3>
                </div>
                <p className="text-gray-700">{paymentMethodLabels[order.paymentMethod]}</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Fecha de Pedido</h3>
                </div>
                <p className="text-gray-700">
                  {orderDate.toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Entrega Estimada</h3>
                </div>
                <p className="text-gray-700">
                  {estimatedDelivery.toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Información de Contacto</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Nombre</p>
                  <p className="font-semibold text-gray-900">{order.customer.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Correo Electrónico</p>
                  <p className="font-semibold text-gray-900">{order.customer.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Teléfono</p>
                  <p className="font-semibold text-gray-900">{order.customer.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Estado</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                    Pendiente
                  </span>
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-4">Productos Comprados</h3>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div
                    key={item.product.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{item.product.name}</p>
                      <p className="text-gray-600 text-sm">
                        {item.product.brand} - {item.product.category}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Cantidad: {item.quantity} × ${item.product.price}
                      </p>
                    </div>
                    <div className="font-bold text-gray-900 text-lg">
                      ${item.product.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">¿Qué sigue?</h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-bold text-sm">1</span>
              </div>
              <p>Recibirás un correo de confirmación en {order.customer.email}</p>
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
              <p>Te notificaremos cuando tu pedido esté en camino</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-bold text-sm">4</span>
              </div>
              <p>Recibirás tu pedido en aproximadamente 5 días hábiles</p>
            </div>
          </div>
        </div>

        {/* Actions */}
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
