import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../contexts/CartContext";
import { CreditCard, Banknote, Building2, AlertCircle } from "lucide-react";

type PaymentMethod = "efectivo" | "tarjeta" | "transferencia";

export function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("tarjeta");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    navigate("/carrito");
    return null;
  }

  const totalPrice = getTotalPrice();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "El teléfono debe tener 10 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Store order data
    const order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: items,
      total: totalPrice,
      customer: formData,
      paymentMethod: paymentMethod,
      status: "pendiente",
    };

    // Save to localStorage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.unshift(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear cart and navigate
    clearCart();
    navigate("/confirmacion", { state: { order } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Información del Cliente</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Juan Pérez García"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="correo@ejemplo.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="5512345678"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Método de Pago</h2>

                <div className="space-y-3">
                  <label
                    className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                      paymentMethod === "tarjeta"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="tarjeta"
                      checked={paymentMethod === "tarjeta"}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-5 h-5 text-purple-600"
                    />
                    <CreditCard className="w-6 h-6 text-purple-600" />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Tarjeta de Crédito/Débito</div>
                      <div className="text-sm text-gray-600">Pago seguro con tarjeta</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                      paymentMethod === "efectivo"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="efectivo"
                      checked={paymentMethod === "efectivo"}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-5 h-5 text-purple-600"
                    />
                    <Banknote className="w-6 h-6 text-green-600" />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Efectivo</div>
                      <div className="text-sm text-gray-600">Pago contra entrega</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                      paymentMethod === "transferencia"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transferencia"
                      checked={paymentMethod === "transferencia"}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-5 h-5 text-purple-600"
                    />
                    <Building2 className="w-6 h-6 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Transferencia Bancaria</div>
                      <div className="text-sm text-gray-600">Transferencia SPEI</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {item.quantity} × ${item.product.price}
                        </p>
                      </div>
                      <div className="font-bold text-gray-900">
                        ${item.product.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Envío</span>
                    <span className="font-semibold text-green-600">Gratis</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-3xl font-bold text-gray-900">${totalPrice}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 text-right">MXN</p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-full font-bold text-lg hover:from-pink-600 hover:to-purple-600 transition shadow-lg hover:shadow-xl mt-6"
                >
                  Confirmar Pedido
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Al confirmar tu pedido aceptas nuestros términos y condiciones
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
