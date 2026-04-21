import { useEffect, useMemo, useState } from 'react';
import { Plus, Eye, Search } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Badge } from './ui/badge';
import { createSale } from '@/services/adminService';
import {
  fetchCustomers,
  fetchPaymentMethods,
  fetchProducts,
  fetchSaleById,
  fetchSales,
} from '@/services/catalogService';
import { getErrorMessage } from '@/utils/errors';

interface SaleSummary {
  id: number;
  date: string;
  customer: string;
  employee: string;
  paymentMethod: string;
  total: number;
  items: number;
}

interface SaleItemDraft {
  id_producto: number;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

function mapSale(sale: any): SaleSummary {
  return {
    id: sale.id_venta,
    date: sale.fecha,
    customer: sale.cliente,
    employee: sale.usuario,
    paymentMethod: sale.metodo_pago,
    total: sale.total,
    items: sale.items,
  };
}

export function Sales() {
  const [sales, setSales] = useState<SaleSummary[]>([]);
  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [draftCustomerId, setDraftCustomerId] = useState('');
  const [draftPaymentMethodId, setDraftPaymentMethodId] = useState('');
  const [draftProductId, setDraftProductId] = useState('');
  const [draftQuantity, setDraftQuantity] = useState(1);
  const [draftItems, setDraftItems] = useState<SaleItemDraft[]>([]);

  const loadData = async () => {
    const [saleRows, customerRows, paymentRows, productRows] = await Promise.all([
      fetchSales(),
      fetchCustomers(),
      fetchPaymentMethods(),
      fetchProducts(),
    ]);

    setSales(saleRows.map(mapSale));
    setCustomers(customerRows);
    setPaymentMethods(paymentRows);
    setProducts(productRows);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleViewDetail = async (saleId: number) => {
    const detail = await fetchSaleById(saleId);
    setSelectedSale(detail);
    setIsDetailOpen(true);
  };

  const addProductToDraft = () => {
    const selectedProduct = products.find(
      (product) => product.id_producto === Number(draftProductId),
    );

    if (!selectedProduct || draftQuantity <= 0) {
      return;
    }

    setDraftItems((current) => {
      const existing = current.find((item) => item.id_producto === selectedProduct.id_producto);

      if (existing) {
        return current.map((item) =>
          item.id_producto === selectedProduct.id_producto
            ? {
                ...item,
                cantidad: item.cantidad + draftQuantity,
                subtotal: (item.cantidad + draftQuantity) * item.precio,
              }
            : item,
        );
      }

      return [
        ...current,
        {
          id_producto: selectedProduct.id_producto,
          nombre: selectedProduct.nombre,
          cantidad: draftQuantity,
          precio: selectedProduct.precio,
          subtotal: selectedProduct.precio * draftQuantity,
        },
      ];
    });

    setDraftProductId('');
    setDraftQuantity(1);
  };

  const confirmSale = async () => {
    try {
      if (!draftCustomerId || !draftPaymentMethodId || !draftItems.length) {
        toast.error('Debes seleccionar cliente, metodo de pago y productos.');
        return;
      }

      await createSale({
        id_cliente: Number(draftCustomerId),
        id_metodo_pago: Number(draftPaymentMethodId),
        items: draftItems.map((item) => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad,
        })),
      });

      setDraftCustomerId('');
      setDraftPaymentMethodId('');
      setDraftProductId('');
      setDraftQuantity(1);
      setDraftItems([]);
      setIsNewSaleOpen(false);
      toast.success('Venta registrada correctamente.');
      await loadData();
    } catch (error) {
      toast.error(getErrorMessage(error, 'No se pudo registrar la venta.'));
    }
  };

  const draftTotal = useMemo(
    () => draftItems.reduce((total, item) => total + item.subtotal, 0),
    [draftItems],
  );

  const filteredSales = sales.filter(
    (sale) =>
      String(sale.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Ventas</h2>
          <p className="text-gray-600 mt-1">Registro y gestion de ventas</p>
        </div>
        <Button onClick={() => setIsNewSaleOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Venta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por ID o cliente..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID Venta</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cliente</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Empleado</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Metodo Pago</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-blue-600">{sale.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{sale.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{sale.customer}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{sale.employee}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant="secondary">{sale.paymentMethod}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      ${Number(sale.total).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleViewDetail(sale.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalle de Venta {selectedSale?.id_venta}</DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p className="font-medium text-gray-900">{selectedSale.cliente}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Empleado</p>
                  <p className="font-medium text-gray-900">{selectedSale.usuario}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha y Hora</p>
                  <p className="font-medium text-gray-900">{selectedSale.fecha}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Metodo de Pago</p>
                  <p className="font-medium text-gray-900">{selectedSale.metodo_pago}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Productos</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-sm font-semibold text-gray-700">Producto</th>
                      <th className="text-center py-2 text-sm font-semibold text-gray-700">Cantidad</th>
                      <th className="text-right py-2 text-sm font-semibold text-gray-700">Precio Unit.</th>
                      <th className="text-right py-2 text-sm font-semibold text-gray-700">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale.items.map((item: any) => (
                      <tr key={item.id_detalle} className="border-b border-gray-100">
                        <td className="py-3 text-sm text-gray-900">{item.producto}</td>
                        <td className="py-3 text-sm text-center text-gray-600">{item.cantidad}</td>
                        <td className="py-3 text-sm text-right text-gray-600">${item.precio_unitario}</td>
                        <td className="py-3 text-sm text-right font-semibold text-gray-900">${item.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300">
                      <td colSpan={3} className="py-3 text-right font-semibold text-gray-900">Total:</td>
                      <td className="py-3 text-right text-xl font-bold text-blue-600">
                        ${Number(selectedSale.total).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Nueva Venta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                <select
                  value={draftCustomerId}
                  onChange={(event) => setDraftCustomerId(event.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar cliente...</option>
                  {customers.map((customer) => (
                    <option key={customer.id_cliente} value={customer.id_cliente}>
                      {customer.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metodo de Pago</label>
                <select
                  value={draftPaymentMethodId}
                  onChange={(event) => setDraftPaymentMethodId(event.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar metodo...</option>
                  {paymentMethods.map((method) => (
                    <option key={method.id_metodo_pago} value={method.id_metodo_pago}>
                      {method.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agregar Productos</label>
              <div className="flex gap-2">
                <select
                  value={draftProductId}
                  onChange={(event) => setDraftProductId(event.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar producto...</option>
                  {products.map((product) => (
                    <option key={product.id_producto} value={product.id_producto}>
                      {product.nombre} - ${product.precio}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={draftQuantity}
                  onChange={(event) => setDraftQuantity(Number(event.target.value))}
                  placeholder="Cant."
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={addProductToDraft} className="bg-blue-600 hover:bg-blue-700">
                  Agregar
                </Button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Productos en la venta</h3>
              {draftItems.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No hay productos agregados</div>
              ) : (
                <div className="space-y-3">
                  {draftItems.map((item) => (
                    <div key={item.id_producto} className="flex justify-between items-center text-sm">
                      <span>{item.nombre} ({item.cantidad})</span>
                      <span>${item.subtotal}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">${draftTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewSaleOpen(false)}>Cancelar</Button>
            <Button onClick={confirmSale} className="bg-blue-600 hover:bg-blue-700">Confirmar Venta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
