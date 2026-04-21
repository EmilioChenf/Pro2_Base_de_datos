export type UserRole = 'ADMIN' | 'CLIENTE';

export interface User {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Category {
  id_categoria: number;
  nombre: string;
  descripcion?: string;
}

export interface Brand {
  id_marca: number;
  nombre: string;
}

export interface Supplier {
  id_proveedor: number;
  nombre: string;
  correo: string;
  telefono: string;
  address?: string;
}

export interface PaymentMethod {
  id_metodo_pago: number;
  nombre: string;
  descripcion?: string;
  icon?: 'cash' | 'card' | 'transfer';
  active?: boolean;
}

export interface Product {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  id_categoria: number;
  categoria: string;
  id_proveedor: number;
  proveedor: string;
  id_marca: number;
  marca: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface ClientProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  description: string;
  image: string;
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface Customer {
  id_cliente: number;
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono: string;
  total_compras?: number;
}

export interface UserRow {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: UserRole;
  google_id?: string | null;
}

export interface SaleListItem {
  id_venta: number;
  fecha: string;
  total: number;
  id_cliente: number;
  cliente: string;
  usuario: string;
  metodo_pago: string;
  items: number;
}

export interface SaleDetailItem {
  id_detalle: number;
  id_producto: number;
  producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface SaleDetail {
  id_venta: number;
  fecha: string;
  total: number;
  id_cliente: number;
  cliente: string;
  correo: string;
  telefono: string;
  usuario: string;
  metodo_pago: string;
  items: SaleDetailItem[];
}

export interface DashboardReport {
  summary: {
    total_productos: number;
    stock_bajo: number;
    ventas_hoy: number;
    ingresos_mes: number;
    total_clientes: number;
  };
  salesByMonth: Array<{ month: string; ventas: number }>;
  recentSales: Array<{
    id_venta: number;
    cliente: string;
    fecha: string;
    items: number;
    total: number;
  }>;
  lowStock: Array<{
    id_producto: number;
    nombre: string;
    stock: number;
    stock_minimo: number;
  }>;
}

export interface OverviewReport {
  summary: {
    ingresos_totales: number;
    productos_vendidos: number;
    ticket_promedio: number;
    ventas_mes_actual: number;
  };
  salesByMonth: Array<{ month: string; ventas: number }>;
  salesByPayment: Array<{
    name: string;
    totalVentas: number;
    amount: number;
    value: number;
  }>;
  bestSellers: Array<{
    rank: number;
    product: string;
    units: number;
    revenue: number;
  }>;
  lowStock: Array<{
    product: string;
    stock: number;
    minStock: number;
    reorder: number;
  }>;
  salesByProduct: Array<{
    name: string;
    ventas: number;
  }>;
}

export interface CartItem {
  product: ClientProduct;
  quantity: number;
}

export interface CheckoutPayload {
  id_metodo_pago: number;
  customer: {
    nombre: string;
    correo: string;
    telefono: string;
  };
  items: Array<{
    id_producto: number;
    cantidad: number;
  }>;
}
