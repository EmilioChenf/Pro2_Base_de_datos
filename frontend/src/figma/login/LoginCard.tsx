import { useState } from 'react';
import { Mail } from 'lucide-react';
import { InputField } from './InputField';
import { PasswordField } from './PasswordField';
import { Checkbox } from './Checkbox';
import { AlertMessage } from './AlertMessage';
import { PrimaryButton } from './PrimaryButton';
import { Footer } from './Footer';

export function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showAlert, setShowAlert] = useState<'success' | 'error' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (email && password) {
        setShowAlert('success');
      } else {
        setShowAlert('error');
      }
    }, 1500);
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="lg:hidden mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🧸</span>
            </div>
            <h1 className="text-2xl text-gray-900">PlushStore</h1>
          </div>

          <h2 className="text-3xl text-gray-900 mb-2">
            Bienvenido de nuevo
          </h2>
          <p className="text-gray-600">
            Ingresa tus credenciales para acceder al sistema
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Administrador / Empleado
          </p>
        </div>

        {showAlert && (
          <div className="mb-6">
            <AlertMessage
              type={showAlert}
              message={
                showAlert === 'success'
                  ? 'Inicio de sesión exitoso. Redirigiendo al panel de control...'
                  : 'Por favor verifica tus credenciales e intenta nuevamente.'
              }
              onClose={() => setShowAlert(null)}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Correo electrónico"
            type="email"
            placeholder="ejemplo@plushstore.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={20} />}
            required
          />

          <PasswordField
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between">
            <Checkbox
              label="Recordarme"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <PrimaryButton type="submit" isLoading={isLoading}>
            Iniciar sesión
          </PrimaryButton>
        </form>

        <Footer />
      </div>
    </div>
  );
}
