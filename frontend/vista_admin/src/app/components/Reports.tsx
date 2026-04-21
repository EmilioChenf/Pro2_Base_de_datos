import { Download, FileText, TrendingUp, Package, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from './ui/badge';

const salesByMonth = [
  { month: 'Nov', ventas: 42000 },
  { month: 'Dic', ventas: 58000 },
  { month: 'Ene', ventas: 45000 },
  { month: 'Feb', ventas: 52000 },
  { month: 'Mar', ventas: 48000 },
  { month: 'Abr', ventas: 61000 },
];

const salesByProduct = [
  { name: 'Peluche Panda', ventas: 145 },
  { name: 'Snoopy Clásico', ventas: 132 },
  { name: 'Peluche Polar', ventas: 98 },
  { name: 'Peluche Pardo', ventas: 87 },
  { name: 'Snoopy Piloto', ventas: 65 },
];

const salesByPayment = [
  { name: 'Tarjeta', value: 45, color: '#3b82f6' },
  { name: 'Efectivo', value: 35, color: '#10b981' },
  { name: 'Transferencia', value: 20, color: '#f59e0b' },
];

const lowStockReport = [
  { product: 'Peluche Panda', stock: 3, minStock: 10, reorder: 20 },
  { product: 'Snoopy Piloto', stock: 5, minStock: 15, reorder: 30 },
  { product: 'Llavero Oso Polar', stock: 2, minStock: 20, reorder: 40 },
  { product: 'Taza Snoopy', stock: 8, minStock: 15, reorder: 25 },
];

const bestSellers = [
  { rank: 1, product: 'Peluche Panda', units: 145, revenue: 65250 },
  { rank: 2, product: 'Snoopy Clásico', units: 132, revenue: 50160 },
  { rank: 3, product: 'Peluche Polar', units: 98, revenue: 44100 },
  { rank: 4, product: 'Taza Escandalosos', units: 87, revenue: 10440 },
  { rank: 5, product: 'Peluche Pardo', units: 78, revenue: 35100 },
];

export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Reportes</h2>
          <p className="text-gray-600 mt-1">Análisis y reportes del negocio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ingresos Totales</CardTitle>
            <DollarSign className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">$306,000</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +18% últimos 6 meses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Productos Vendidos</CardTitle>
            <Package className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">1,847</div>
            <p className="text-xs text-gray-500 mt-1">Últimos 6 meses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ticket Promedio</CardTitle>
            <DollarSign className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">$892</div>
            <p className="text-xs text-purple-600 mt-1">+5% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ventas Mes Actual</CardTitle>
            <Calendar className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">$61,000</div>
            <p className="text-xs text-orange-600 mt-1">Abril 2026</p>
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
            <CardTitle>Ventas por Método de Pago</CardTitle>
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
          <CardTitle>Productos Más Vendidos</CardTitle>
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
                    <td className="py-3 px-4 text-sm font-semibold text-green-600">${item.revenue.toLocaleString()}</td>
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
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stock Mínimo</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Reorden Sugerido</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {lowStockReport.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.product}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant="destructive">{item.stock}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.minStock}</td>
                    <td className="py-3 px-4 text-sm text-blue-600 font-semibold">{item.reorder} unidades</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant="outline" className="border-orange-500 text-orange-600">Crítico</Badge>
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
