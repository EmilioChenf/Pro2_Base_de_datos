import { useState } from 'react';
import { Plus, Eye, Search, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Badge } from './ui/badge';

interface SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Sale {
  id: string;
  date: string;
  customer: string;
  employee: string;
  paymentMethod: string;
  items: SaleItem[];
  total: number;
}

const mockSales: Sale[] = [
  {
    id: 'V-001',
    date: '2026-04-20 14:30',
    customer: 'María González',
    employee: 'Juan Pérez',
    paymentMethod: 'Tarjeta',
    total: 1250,
    items: [
      { productId: 1, productName: 'Peluche Panda', quantity: 2, unitPrice: 450, subtotal: 900 },
      { productId: 6, productName: 'Taza Escandalosos', quantity: 2, unitPrice: 120, subtotal: 240 },
      { productId: 7, productName: 'Llavero Panda', quantity: 1, unitPrice: 65, subtotal: 65 },
    ]
  },
  {
    id: 'V-002',
    date: '2026-04-20 12:15',
    customer: 'Carlos Ruiz',
    employee: 'Sofia Torres',
    paymentMethod: 'Efectivo',
    total: 890,
    items: [
      { productId: 4, productName: 'Snoopy Clásico', quantity: 2, unitPrice: 380, subtotal: 760 },
      { productId: 8, productName: 'Llavero Snoopy', quantity: 2, unitPrice: 70, subtotal: 140 },
    ]
  },
  {
    id: 'V-003',
    date: '2026-04-19 16:45',
    customer: 'Ana López',
    employee: 'Juan Pérez',
    paymentMethod: 'Transferencia',
    total: 2340,
    items: [
      { productId: 1, productName: 'Peluche Panda', quantity: 1, unitPrice: 450, subtotal: 450 },
      { productId: 2, productName: 'Peluche Polar', quantity: 1, unitPrice: 450, subtotal: 450 },
      { productId: 3, productName: 'Peluche Pardo', quantity: 1, unitPrice: 450, subtotal: 450 },
      { productId: 4, productName: 'Snoopy Clásico', quantity: 2, unitPrice: 380, subtotal: 760 },
      { productId: 6, productName: 'Taza Escandalosos', quantity: 2, unitPrice: 120, subtotal: 240 },
    ]
  },
];

export function Sales() {
  const [sales] = useState<Sale[]>(mockSales);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewDetail = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDetailOpen(true);
  };

  const filteredSales = sales.filter(s =>
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Ventas</h2>
          <p className="text-gray-600 mt-1">Registro y gestión de ventas</p>
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Método Pago</th>
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
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">${sale.total.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleViewDetail(sale)}
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
            <DialogTitle>Detalle de Venta {selectedSale?.id}</DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p className="font-medium text-gray-900">{selectedSale.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Empleado</p>
                  <p className="font-medium text-gray-900">{selectedSale.employee}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha y Hora</p>
                  <p className="font-medium text-gray-900">{selectedSale.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Método de Pago</p>
                  <p className="font-medium text-gray-900">{selectedSale.paymentMethod}</p>
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
                    {selectedSale.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-3 text-sm text-gray-900">{item.productName}</td>
                        <td className="py-3 text-sm text-center text-gray-600">{item.quantity}</td>
                        <td className="py-3 text-sm text-right text-gray-600">${item.unitPrice}</td>
                        <td className="py-3 text-sm text-right font-semibold text-gray-900">${item.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300">
                      <td colSpan={3} className="py-3 text-right font-semibold text-gray-900">Total:</td>
                      <td className="py-3 text-right text-xl font-bold text-blue-600">${selectedSale.total.toLocaleString()}</td>
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
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Seleccionar cliente...</option>
                  <option>María González</option>
                  <option>Carlos Ruiz</option>
                  <option>Ana López</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Efectivo</option>
                  <option>Tarjeta</option>
                  <option>Transferencia</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agregar Productos</label>
              <div className="flex gap-2">
                <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Seleccionar producto...</option>
                  <option>Peluche Panda - $450</option>
                  <option>Peluche Polar - $450</option>
                  <option>Snoopy Clásico - $380</option>
                </select>
                <input
                  type="number"
                  placeholder="Cant."
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">Agregar</Button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Productos en la venta</h3>
              <div className="text-center text-gray-500 py-8">
                No hay productos agregados
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">$0.00</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewSaleOpen(false)}>Cancelar</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Confirmar Venta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
