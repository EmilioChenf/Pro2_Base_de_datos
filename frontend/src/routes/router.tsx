import { createBrowserRouter, Navigate } from 'react-router-dom';

import { LoadingScreen } from '@/components/common/LoadingScreen';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { ClientLayout } from '@/layouts/ClientLayout';
import { AuthPage } from '@/pages/auth/AuthPage';
import { AdminPage } from '@/pages/admin/AdminPage';
import { Home } from '@/figma/client/pages/Home';
import { Catalog } from '@/figma/client/pages/Catalog';
import { ProductDetail } from '@/figma/client/pages/ProductDetail';
import { Cart } from '@/figma/client/pages/Cart';
import { Checkout } from '@/figma/client/pages/Checkout';
import { Confirmation } from '@/figma/client/pages/Confirmation';
import { Orders } from '@/figma/client/pages/Orders';
import { getPathForRole } from '@/context/AuthContext';

function RootEntry() {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated && user) {
    return <Navigate to={getPathForRole(user.rol)} replace />;
  }

  return <AuthPage />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootEntry />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute allowedRoles={['CLIENTE']}>
        <ClientLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/cliente',
        element: <Home />,
      },
      {
        path: '/catalogo',
        element: <Catalog />,
      },
      {
        path: '/producto/:id',
        element: <ProductDetail />,
      },
      {
        path: '/carrito',
        element: <Cart />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
      {
        path: '/confirmacion',
        element: <Confirmation />,
      },
      {
        path: '/ordenes',
        element: <Orders />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
