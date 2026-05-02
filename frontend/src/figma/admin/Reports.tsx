import { useEffect, useState } from 'react';
import {
  Download,
  FileText,
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { downloadReport, fetchOverviewReport } from '@/services/catalogService';
import type { OverviewReport } from '@/types';
import { formatCurrencyGTQ } from '@/utils/format';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export function Reports() {
  const [data, setData] = useState<OverviewReport | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    fetchOverviewReport().then(setData);
  }, []);

  const summary = data?.summary ?? {
    ingresos_totales: 0,
    productos_vendidos: 0,
    ticket_promedio: 0,
    ventas_mes_actual: 0,
  };

  const salesByMonth = data?.salesByMonth ?? [];
  const salesByPayment = data?.salesByPayment ?? [];
  const bestSellers = data?.bestSellers ?? [];
  const lowStock = data?.lowStock ?? [];
  const salesByProduct = data?.salesByProduct ?? [];
  const recentSales = data?.recentSales ?? [];
  const salesByDate = data?.salesByDate ?? [];
  const topCustomers = data?.topCustomers ?? [];
  const belowAverageStock = data?.belowAverageStock ?? [];
  const customersAboveAverage = data?.customersAboveAverage ?? [];
  const havingProducts = data?.havingProducts ?? [];
  const sqlSamples = data?.sqlSamples;

  const handleDownloadReport = async (endpoint: string, filename: string) => {
    try {
      setDownloadError(null);
      const blob = await downloadReport(endpoint);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError('No se pudo descargar el reporte. Verifica tu sesion de administrador.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Reportes</h2>
          <p className="text-gray-600 mt-1">Analisis y reportes del negocio</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownloadReport('/reports/recent-sales/csv', 'ventas-recientes.csv')}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {downloadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {downloadError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ingresos Totales</CardTitle>
            <DollarSign className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrencyGTQ(summary.ingresos_totales)}
            </div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Historico acumulado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Productos Vendidos</CardTitle>
            <Package className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {Number(summary.productos_vendidos).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Unidades vendidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ticket Promedio</CardTitle>
            <DollarSign className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrencyGTQ(summary.ticket_promedio)}
            </div>
            <p className="text-xs text-purple-600 mt-1">Promedio por venta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ventas Mes Actual</CardTitle>
            <Calendar className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrencyGTQ(summary.ventas_mes_actual)}
            </div>
            <p className="text-xs text-orange-600 mt-1">Mes en curso</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ventas por Mes</CardTitle>
            <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadReport('/reports/sales-by-date/csv', 'ventas-por-fecha.csv')}
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadReport('/reports/sales-by-date/pdf', 'ventas-por-fecha.pdf')}
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ventas por Metodo de Pago</CardTitle>
            <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadReport('/reports/sales-by-payment/csv', 'ventas-por-metodo-pago.csv')}
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadReport('/reports/sales-by-payment/pdf', 'ventas-por-metodo-pago.pdf')}
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByPayment}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesByPayment.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ventas Recientes</CardTitle>
          <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownloadReport('/reports/recent-sales/csv', 'ventas-recientes.csv')}
          >
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownloadReport('/reports/recent-sales/pdf', 'ventas-recientes.pdf')}
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cliente</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Usuario</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Metodo</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id_venta} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-blue-600">{sale.id_venta}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{sale.fecha}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{sale.cliente}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{sale.usuario}</td>
                    <td className="py-3 px-4 text-sm"><Badge variant="secondary">{sale.metodo_pago}</Badge></td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">{formatCurrencyGTQ(sale.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Productos Mas Vendidos</CardTitle>
          <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownloadReport('/reports/top-products/csv', 'productos-mas-vendidos.csv')}
          >
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownloadReport('/reports/top-products/pdf', 'productos-mas-vendidos.pdf')}
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ranking</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Producto</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Unidades Vendidas</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {bestSellers.map((item) => (
                  <tr key={item.rank} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Badge variant={item.rank <= 3 ? 'default' : 'secondary'}>#{item.rank}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.product}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.units} unidades</td>
                    <td className="py-3 px-4 text-sm font-semibold text-green-600">
                      {formatCurrencyGTQ(item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Reporte de Stock Bajo</CardTitle>
          <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownloadReport('/reports/low-stock/csv', 'productos-bajo-stock.csv')}
          >
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownloadReport('/reports/low-stock/pdf', 'productos-bajo-stock.pdf')}
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Producto</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stock Actual</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stock Minimo</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Reorden Sugerido</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((item) => (
                  <tr key={item.product} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.product}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant="destructive">{item.stock}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.minStock}</td>
                    <td className="py-3 px-4 text-sm text-blue-600 font-semibold">
                      {item.reorder} unidades
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant="outline" className="border-orange-500 text-orange-600">
                        Critico
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ventas por Fecha</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport('/reports/sales-by-date/csv', 'ventas-por-fecha.csv')}
              >
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport('/reports/sales-by-date/pdf', 'ventas-por-fecha.pdf')}
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fecha</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ventas</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {salesByDate.map((item) => (
                    <tr key={String(item.fecha)} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{String(item.fecha).slice(0, 10)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{item.ventas}</td>
                      <td className="py-3 px-4 text-sm text-right font-semibold text-green-600">{formatCurrencyGTQ(item.ingresos)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Clientes con Mas Compras</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport('/reports/top-customers/csv', 'clientes-mas-compras.csv')}
              >
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport('/reports/top-customers/pdf', 'clientes-mas-compras.pdf')}
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cliente</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Compras</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Gasto</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((item) => (
                    <tr key={item.customer} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.customer}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{item.purchases}</td>
                      <td className="py-3 px-4 text-sm text-right font-semibold text-green-600">{formatCurrencyGTQ(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consultas SQL de la Rubrica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Stock bajo el promedio</h3>
              <div className="space-y-2">
                {belowAverageStock.map((item) => (
                  <div key={item.id_producto} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                    <span>{item.nombre}</span>
                    <Badge variant="outline">{item.stock}</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Clientes sobre compra promedio</h3>
              <div className="space-y-2">
                {customersAboveAverage.map((item) => (
                  <div key={item.customer} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                    <span>{item.customer}</span>
                    <span className="font-semibold text-green-600">{formatCurrencyGTQ(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">HAVING: mas de 2 unidades</h3>
              <div className="space-y-2">
                {havingProducts.map((item) => (
                  <div key={item.product} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                    <span>{item.product}</span>
                    <Badge>{item.units}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>JOINs Visibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Ventas + cliente + usuario + pago</h3>
              <div className="space-y-2">
                {(sqlSamples?.salesJoin ?? []).slice(0, 5).map((item) => (
                  <div key={String(item.id_venta)} className="text-sm border-b border-gray-100 pb-2">
                    <div className="font-medium text-gray-900">#{String(item.id_venta)} {String(item.cliente)}</div>
                    <div className="text-gray-600">{String(item.usuario)} - {String(item.metodo_pago)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Detalle + producto + categoria + marca</h3>
              <div className="space-y-2">
                {(sqlSamples?.detailJoin ?? []).slice(0, 5).map((item) => (
                  <div key={String(item.id_detalle)} className="text-sm border-b border-gray-100 pb-2">
                    <div className="font-medium text-gray-900">{String(item.producto)}</div>
                    <div className="text-gray-600">{String(item.categoria)} - {String(item.marca)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Productos + categoria + proveedor + marca</h3>
              <div className="space-y-2">
                {(sqlSamples?.productsJoin ?? []).slice(0, 5).map((item) => (
                  <div key={String(item.id_producto)} className="text-sm border-b border-gray-100 pb-2">
                    <div className="font-medium text-gray-900">{String(item.nombre)}</div>
                    <div className="text-gray-600">{String(item.categoria)} - {String(item.proveedor)} - {String(item.marca)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ventas por Producto</CardTitle>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Ver Detalle
          </Button>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesByProduct}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ventas" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
