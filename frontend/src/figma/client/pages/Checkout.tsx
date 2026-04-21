import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, Building2, AlertCircle } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';

type PaymentMethodName = 'Tarjeta' | 'Efectivo' | 'Transferencia';

export function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const { paymentMethods, checkout } = useStore();

  const [formData, setFormData] = useState({
    fullName: user?.nombre ?? '',
    email: user?.correo ?? '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodName>('Tarjeta');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((current) => ({
        ...current,
        fullName: current.fullName || user.nombre,
        email: current.email || user.correo,
      }));
    }
  }, [user]);

  if (items.length === 0) {
    return <Navigate to="/carrito" replace />;
  }

  const totalPrice = getTotalPrice();

  const paymentOptions = useMemo(
    () => ({
      Tarjeta: paymentMethods.find((method) => method.nombre === 'Tarjeta'),
      Efectivo: paymentMethods.find((method) => method.nombre === 'Efectivo'),
      Transferencia: paymentMethods.find((method) => method.nombre === 'Transferencia'),
    }),
    [paymentMethods],
  );

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'El nombre completo es requerido';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'El correo electronico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'El correo electronico no es valido';
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'El telefono es requerido';
    } else if (!/^\d{8,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      nextErrors.phone = 'El telefono debe tener entre 8 y 15 digitos';
    }

    if (!paymentOptions[paymentMethod]) {
      nextErrors.paymentMethod = 'Selecciona un metodo de pago valido';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const selectedMethod = paymentOptions[paymentMethod];

    try {
      setIsSubmitting(true);

      const order = await checkout({
        id_metodo_pago: selectedMethod!.id_metodo_pago,
        customer: {
          nombre: formData.fullName,
          correo: formData.email,
          telefono: formData.phone,
        },
        items: items.map((item) => ({
          id_producto: Number(item.product.id),
          cantidad: item.quantity,
        })),
      });

      clearCart();
      navigate('/confirmacion', {
        state: {
          order,
          customer: formData,
          items,
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informacion del Cliente</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(event) =>
                        setFormData({ ...formData, fullName: event.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Juan Perez Garcia"
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
                      Correo Electronico *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(event) =>
                        setFormData({ ...formData, email: event.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
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
                      Telefono *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(event) =>
                        setFormData({ ...formData, phone: event.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
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

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Metodo de Pago</h2>

                <div className="space-y-3">
                  <label
                    className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                      paymentMethod === 'Tarjeta'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Tarjeta"
                      checked={paymentMethod === 'Tarjeta'}
                      onChange={(event) =>
                        setPaymentMethod(event.target.value as PaymentMethodName)
                      }
                      className="w-5 h-5 text-purple-600"
                    />
                    <CreditCard className="w-6 h-6 text-purple-600" />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Tarjeta de Credito/Debito</div>
                      <div className="text-sm text-gray-600">Pago seguro con tarjeta</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                      paymentMethod === 'Efectivo'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Efectivo"
                      checked={paymentMethod === 'Efectivo'}
                      onChange={(event) =>
                        setPaymentMethod(event.target.value as PaymentMethodName)
                      }
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
                      paymentMethod === 'Transferencia'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Transferencia"
                      checked={paymentMethod === 'Transferencia'}
                      onChange={(event) =>
                        setPaymentMethod(event.target.value as PaymentMethodName)
                      }
                      className="w-5 h-5 text-purple-600"
                    />
                    <Building2 className="w-6 h-6 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Transferencia Bancaria</div>
                      <div className="text-sm text-gray-600">Transferencia SPEI</div>
                    </div>
                  </label>
                </div>

                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-3 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.paymentMethod}</span>
                  </p>
                )}
              </div>
            </div>

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
                    <span>Envio</span>
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
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-full font-bold text-lg hover:from-pink-600 hover:to-purple-600 transition shadow-lg hover:shadow-xl mt-6 disabled:opacity-70"
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Al confirmar tu pedido aceptas nuestros terminos y condiciones
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
