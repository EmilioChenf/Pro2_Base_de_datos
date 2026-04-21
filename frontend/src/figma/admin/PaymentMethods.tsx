import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, CreditCard, Banknote, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  savePaymentMethod,
  deletePaymentMethod as deletePaymentMethodRequest,
} from '@/services/adminService';
import { fetchPaymentMethods } from '@/services/catalogService';
import { getErrorMessage } from '@/utils/errors';

interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  icon: 'cash' | 'card' | 'transfer';
  active: boolean;
}

const iconMap = {
  cash: Banknote,
  card: CreditCard,
  transfer: ArrowRightLeft,
};

function mapPaymentMethod(method: any): PaymentMethod {
  return {
    id: method.id_metodo_pago,
    name: method.nombre,
    description: method.descripcion,
    icon: method.icon,
    active: method.active,
  };
}

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState<Partial<PaymentMethod>>({});

  useEffect(() => {
    fetchPaymentMethods().then((rows) => setPaymentMethods(rows.map(mapPaymentMethod)));
  }, []);

  const handleCreate = () => {
    setSelectedMethod(null);
    setFormData({ icon: 'cash', active: true });
    setIsDialogOpen(true);
  };

  const handleEdit = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setFormData(method);
    setIsDialogOpen(true);
  };

  const handleDelete = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedMethod) {
      return;
    }

    try {
      await deletePaymentMethodRequest(selectedMethod.id);
      setPaymentMethods((current) => current.filter((item) => item.id !== selectedMethod.id));
      toast.success('Metodo de pago eliminado correctamente.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'No se pudo eliminar el metodo de pago.'));
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedMethod(null);
    }
  };

  const handleSave = async () => {
    try {
      const saved = await savePaymentMethod({
        id_metodo_pago: selectedMethod?.id,
        nombre: formData.name,
      });

      const mapped = {
        id: saved.id_metodo_pago,
        name: saved.nombre,
        description: formData.description || saved.descripcion,
        icon: formData.icon || saved.icon,
        active: formData.active ?? saved.active,
      } as PaymentMethod;

      setPaymentMethods((current) =>
        selectedMethod
          ? current.map((item) => (item.id === selectedMethod.id ? mapped : item))
          : [...current, mapped],
      );

      setIsDialogOpen(false);
      setFormData({});
      toast.success('Metodo de pago guardado correctamente.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'No se pudo guardar el metodo de pago.'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Metodos de Pago</h2>
          <p className="text-gray-600 mt-1">Gestion de metodos de pago aceptados</p>
        </div>
        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Metodo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((method) => {
          const Icon = iconMap[method.icon];
          return (
            <Card key={method.id} className={!method.active ? 'opacity-50' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <span>{method.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(method)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(method)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{method.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${method.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {method.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMethod ? 'Editar Metodo de Pago' : 'Nuevo Metodo de Pago'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Efectivo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripcion</label>
              <textarea
                value={formData.description || ''}
                onChange={(event) =>
                  setFormData({ ...formData, description: event.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Descripcion del metodo de pago"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icono</label>
              <select
                value={formData.icon || 'cash'}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    icon: event.target.value as 'cash' | 'card' | 'transfer',
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta</option>
                <option value="transfer">Transferencia</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active ?? true}
                onChange={(event) => setFormData({ ...formData, active: event.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">Metodo activo</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Estas seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. El metodo de pago "{selectedMethod?.name}" sera eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
