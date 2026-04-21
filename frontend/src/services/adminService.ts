import { api } from './api';
import type {
  Category,
  Customer,
  PaymentMethod,
  Product,
  SaleDetail,
  Supplier,
  UserRow,
} from '@/types';

export async function saveCategory(payload: Partial<Category>) {
  if (payload.id_categoria) {
    const response = await api.put<Category>(`/categories/${payload.id_categoria}`, payload);
    return response.data;
  }

  const response = await api.post<Category>('/categories', payload);
  return response.data;
}

export async function deleteCategory(id: number) {
  await api.delete(`/categories/${id}`);
}

export async function saveSupplier(payload: Partial<Supplier>) {
  if (payload.id_proveedor) {
    const response = await api.put<Supplier>(`/suppliers/${payload.id_proveedor}`, payload);
    return response.data;
  }

  const response = await api.post<Supplier>('/suppliers', payload);
  return response.data;
}

export async function deleteSupplier(id: number) {
  await api.delete(`/suppliers/${id}`);
}

export async function savePaymentMethod(payload: Partial<PaymentMethod>) {
  if (payload.id_metodo_pago) {
    const response = await api.put<PaymentMethod>(
      `/payment-methods/${payload.id_metodo_pago}`,
      payload,
    );
    return response.data;
  }

  const response = await api.post<PaymentMethod>('/payment-methods', payload);
  return response.data;
}

export async function deletePaymentMethod(id: number) {
  await api.delete(`/payment-methods/${id}`);
}

export async function saveProduct(payload: Partial<Product>) {
  if (payload.id_producto) {
    const response = await api.put<Product>(`/products/${payload.id_producto}`, payload);
    return response.data;
  }

  const response = await api.post<Product>('/products', payload);
  return response.data;
}

export async function deleteProduct(id: number) {
  await api.delete(`/products/${id}`);
}

export async function saveCustomer(payload: Partial<Customer> & { password?: string }) {
  if (payload.id_cliente) {
    const response = await api.put<Customer>(`/customers/${payload.id_cliente}`, payload);
    return response.data;
  }

  const response = await api.post<Customer>('/customers', payload);
  return response.data;
}

export async function deleteCustomer(id: number) {
  await api.delete(`/customers/${id}`);
}

export async function saveUser(payload: Partial<UserRow> & { password?: string; telefono?: string }) {
  if (payload.id_usuario) {
    const response = await api.put<UserRow>(`/users/${payload.id_usuario}`, payload);
    return response.data;
  }

  const response = await api.post<UserRow>('/users', payload);
  return response.data;
}

export async function deleteUser(id: number) {
  await api.delete(`/users/${id}`);
}

export async function createSale(payload: {
  id_cliente?: number;
  id_metodo_pago: number;
  items: Array<{ id_producto: number; cantidad: number }>;
  customer?: {
    nombre: string;
    correo: string;
    telefono: string;
  };
}) {
  const response = await api.post<SaleDetail>('/sales', payload);
  return response.data;
}
