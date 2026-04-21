import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Phone, Mail } from 'lucide-react';
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
import { saveSupplier, deleteSupplier as deleteSupplierRequest } from '@/services/adminService';
import { fetchSuppliers } from '@/services/catalogService';
import { getErrorMessage } from '@/utils/errors';

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

function mapSupplier(supplier: any): Supplier {
  return {
    id: supplier.id_proveedor,
    name: supplier.nombre,
    email: supplier.correo,
    phone: supplier.telefono,
    address: supplier.address ?? '',
  };
}

export function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Partial<Supplier>>({});

  useEffect(() => {
    fetchSuppliers().then((rows) => setSuppliers(rows.map(mapSupplier)));
  }, []);

  const handleCreate = () => {
    setSelectedSupplier(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData(supplier);
    setIsDialogOpen(true);
  };

  const handleDelete = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSupplier) {
      return;
    }

    try {
      await deleteSupplierRequest(selectedSupplier.id);
      setSuppliers((current) => current.filter((item) => item.id !== selectedSupplier.id));
      toast.success('Proveedor eliminado correctamente.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'No se pudo eliminar el proveedor.'));
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedSupplier(null);
    }
  };

  const handleSave = async () => {
    try {
      const saved = await saveSupplier({
        id_proveedor: selectedSupplier?.id,
        nombre: formData.name,
        correo: formData.email,
        telefono: formData.phone,
      });

      const mapped = {
        id: saved.id_proveedor,
        name: saved.nombre,
        email: saved.correo,
        phone: saved.telefono,
        address: formData.address || '',
      };

      setSuppliers((current) =>
        selectedSupplier
          ? current.map((item) => (item.id === selectedSupplier.id ? mapped : item))
          : [...current, mapped],
      );

      setIsDialogOpen(false);
      setFormData({});
      toast.success('Proveedor guardado correctamente.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'No se pudo guardar el proveedor.'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Proveedores</h2>
          <p className="text-gray-600 mt-1">Gestion de proveedores</p>
        </div>
        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Proveedor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <Card key={supplier.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{supplier.name}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(supplier)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(supplier)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{supplier.phone}</span>
                </div>
                {supplier.address && <p className="text-sm text-gray-500 mt-2">{supplier.address}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del proveedor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefono</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="555-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Direccion</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Direccion completa"
              />
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
              Esta accion no se puede deshacer. El proveedor "{selectedSupplier?.name}" sera eliminado permanentemente.
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
