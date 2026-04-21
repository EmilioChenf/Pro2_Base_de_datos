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
import { fetchOverviewReport } from '@/services/catalogService';
import type { OverviewReport } from '@/types';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export function Reports() {
  const [data, setData] = useState<OverviewReport | null>(null);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Reportes</h2>
          <p className="text-gray-600 mt-1">Analisis y reportes del negocio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ingresos Totales</CardTitle>
            <DollarSign className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              ${Number(summary.ingresos_totales).toLocaleString()}
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
              ${Number(summary.ticket_promedio).toLocaleString()}
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
              ${Number(summary.ventas_mes_actual).toLocaleString()}
            </div>
            <p className="text-xs text-orange-600 mt-1">Mes en curso</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ventas por Mes</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
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
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
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
          <CardTitle>Productos Mas Vendidos</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
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
                      ${Number(item.revenue).toLocaleString()}
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
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
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
