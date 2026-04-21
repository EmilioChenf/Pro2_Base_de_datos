import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { Mail, User as UserIcon, Phone } from 'lucide-react';

import { useAuth, getPathForRole } from '@/context/AuthContext';
import { AlertMessage } from '@/figma/login/AlertMessage';
import { BrandingPanel } from '@/figma/login/BrandingPanel';
import { Checkbox } from '@/figma/login/Checkbox';
import { Footer } from '@/figma/login/Footer';
import { InputField } from '@/figma/login/InputField';
import { PasswordField } from '@/figma/login/PasswordField';
import { PrimaryButton } from '@/figma/login/PrimaryButton';

type AuthMode = 'login' | 'register';

const GOOGLE_ENABLED = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

export function AuthPage() {
  const navigate = useNavigate();
  const { login, register, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    password: '',
  });
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const title = useMemo(
    () =>
      mode === 'login'
        ? 'Bienvenido de nuevo'
        : 'Crea tu cuenta de cliente',
    [mode],
  );

  const subtitle = useMemo(
    () =>
      mode === 'login'
        ? 'Ingresa tus credenciales para acceder al sistema'
        : 'Registra tus datos para comprar y consultar tus pedidos',
    [mode],
  );

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const user = await loginWithGoogle(tokenResponse.access_token);
        navigate(getPathForRole(user.rol), { replace: true });
      } catch (error: any) {
        setMessage({
          type: 'error',
          text:
            error?.response?.data?.message ??
            'No se pudo completar el acceso con Google.',
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setMessage({
        type: 'error',
        text: 'No se pudo iniciar el flujo de Google.',
      });
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const user =
        mode === 'login'
          ? await login({
              correo: formData.correo,
              password: formData.password,
            })
          : await register({
              nombre: formData.nombre,
              correo: formData.correo,
              telefono: formData.telefono,
              password: formData.password,
            });

      if (!rememberMe) {
        sessionStorage.setItem('plushstore_session', 'temporary');
      }

      setMessage({
        type: 'success',
        text:
          mode === 'login'
            ? 'Inicio de sesion exitoso. Redirigiendo...'
            : 'Cuenta creada correctamente. Redirigiendo...',
      });

      navigate(getPathForRole(user.rol), { replace: true });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text:
          error?.response?.data?.message ??
          'No fue posible completar la autenticacion.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      <BrandingPanel />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="lg:hidden mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">P</span>
              </div>
              <h1 className="text-2xl text-gray-900">PlushStore</h1>
            </div>

            <h2 className="text-3xl text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
            <p className="text-sm text-gray-500 mt-2">
              {mode === 'login' ? 'Administrador / Cliente' : 'Registro de cliente'}
            </p>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-xl border transition ${
                mode === 'login'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              Iniciar sesion
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-xl border transition ${
                mode === 'register'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              Registrarse
            </button>
          </div>

          {message && (
            <div className="mb-6">
              <AlertMessage
                type={message.type}
                message={message.text}
                onClose={() => setMessage(null)}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <>
                <InputField
                  label="Nombre completo"
                  placeholder="Tu nombre completo"
                  value={formData.nombre}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      nombre: event.target.value,
                    }))
                  }
                  icon={<UserIcon size={20} />}
                  required
                />

                <InputField
                  label="Telefono"
                  placeholder="5512345678"
                  value={formData.telefono}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      telefono: event.target.value,
                    }))
                  }
                  icon={<Phone size={20} />}
                  required
                />
              </>
            )}

            <InputField
              label="Correo electronico"
              type="email"
              placeholder="ejemplo@plushstore.com"
              value={formData.correo}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  correo: event.target.value,
                }))
              }
              icon={<Mail size={20} />}
              required
            />

            <PasswordField
              label="Contrasena"
              placeholder="Ingresa tu contrasena"
              value={formData.password}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              required
            />

            <div className="flex items-center justify-between">
              <Checkbox
                label={mode === 'login' ? 'Recordarme' : 'Mantener sesion iniciada'}
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                onClick={() =>
                  setMode((current) => (current === 'login' ? 'register' : 'login'))
                }
              >
                {mode === 'login'
                  ? 'Crear cuenta nueva'
                  : 'Ya tengo una cuenta'}
              </button>
            </div>

            <PrimaryButton type="submit" isLoading={isLoading}>
              {mode === 'login' ? 'Iniciar sesion' : 'Crear cuenta'}
            </PrimaryButton>

            {GOOGLE_ENABLED && (
              <PrimaryButton
                type="button"
                variant="secondary"
                onClick={() => googleLogin()}
                disabled={isLoading}
              >
                Continuar con Google
              </PrimaryButton>
            )}
          </form>

          <Footer />
        </div>
      </div>
    </div>
  );
}
