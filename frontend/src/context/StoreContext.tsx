import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { fetchBrands, fetchCategories, fetchPaymentMethods, fetchProducts, fetchSales } from '@/services/catalogService';
import { createSale } from '@/services/adminService';
import { useAuth } from './AuthContext';
import { toLegacyProduct } from '@/utils/adapters';
import type {
  Brand,
  Category,
  ClientProduct,
  CheckoutPayload,
  PaymentMethod,
  SaleDetail,
  SaleListItem,
} from '@/types';

interface StoreContextValue {
  products: ClientProduct[];
  categories: Category[];
  brands: Brand[];
  paymentMethods: PaymentMethod[];
  orders: SaleListItem[];
  loading: boolean;
  refreshCatalog: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  checkout: (payload: CheckoutPayload) => Promise<SaleDetail>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<ClientProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [orders, setOrders] = useState<SaleListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCatalog = async () => {
    const [nextProducts, nextCategories, nextBrands, nextPaymentMethods] =
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchBrands(),
        fetchPaymentMethods(),
      ]);

    setProducts(nextProducts.map(toLegacyProduct));
    setCategories(nextCategories);
    setBrands(nextBrands);
    setPaymentMethods(nextPaymentMethods);
  };

  const refreshOrders = async () => {
    if (!user || user.rol !== 'CLIENTE') {
      setOrders([]);
      return;
    }

    const nextOrders = await fetchSales('mine');
    setOrders(nextOrders);
  };

  useEffect(() => {
    async function bootstrap() {
      setLoading(true);

      try {
        await Promise.all([refreshCatalog(), refreshOrders()]);
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, [user?.id_usuario, user?.rol]);

  const value = useMemo<StoreContextValue>(
    () => ({
      products,
      categories,
      brands,
      paymentMethods,
      orders,
      loading,
      refreshCatalog,
      refreshOrders,
      async checkout(payload) {
        const sale = await createSale(payload);
        await Promise.all([refreshCatalog(), refreshOrders()]);
        return sale;
      },
    }),
    [brands, categories, loading, orders, paymentMethods, products],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStore debe usarse dentro de StoreProvider');
  }

  return context;
}
