import type { Product, SaleDetail, SaleListItem } from '@/types';

export function toLegacyProduct(product: Product) {
  return {
    id: String(product.id_producto),
    name: product.nombre,
    price: product.precio,
    category: product.categoria,
    brand: product.marca,
    description: product.descripcion,
    image: product.imagen,
    stock: product.stock,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    isBestSeller: product.isBestSeller,
  };
}

export function toLegacyOrder(order: SaleListItem | SaleDetail) {
  return {
    id: String(order.id_venta),
    date: order.fecha,
    total: order.total,
    paymentMethod:
      'metodo_pago' in order ? order.metodo_pago.toLowerCase() : '',
  };
}
