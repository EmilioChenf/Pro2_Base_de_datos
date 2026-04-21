import { api } from './api';
import type {
  Brand,
  Category,
  Customer,
  DashboardReport,
  OverviewReport,
  PaymentMethod,
  Product,
  SaleDetail,
  SaleListItem,
  Supplier,
  UserRow,
} from '@/types';

export async function fetchProducts(params?: Record<string, string | number | boolean>) {
  const response = await api.get<Product[]>('/products', { params });
  return response.data;
}

export async function fetchProductById(id: number) {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
}

export async function fetchCategories() {
  const response = await api.get<Category[]>('/categories');
  return response.data;
}

export async function fetchBrands() {
  const response = await api.get<Brand[]>('/brands');
  return response.data;
}

export async function fetchSuppliers() {
  const response = await api.get<Supplier[]>('/suppliers');
  return response.data;
}

export async function fetchPaymentMethods() {
  const response = await api.get<PaymentMethod[]>('/payment-methods');
  return response.data;
}

export async function fetchCustomers() {
  const response = await api.get<Customer[]>('/customers');
  return response.data;
}

export async function fetchUsers() {
  const response = await api.get<UserRow[]>('/users');
  return response.data;
}

export async function fetchSales(scope?: 'mine') {
  const response = await api.get<SaleListItem[]>('/sales', {
    params: scope ? { scope } : undefined,
  });
  return response.data;
}

export async function fetchSaleById(id: number) {
  const response = await api.get<SaleDetail>(`/sales/${id}`);
  return response.data;
}

export async function fetchDashboardReport() {
  const response = await api.get<DashboardReport>('/reports/dashboard');
  return response.data;
}

export async function fetchOverviewReport() {
  const response = await api.get<OverviewReport>('/reports/overview');
  return response.data;
}
