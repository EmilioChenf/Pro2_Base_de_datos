import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
import { saveCategory, deleteCategory as deleteCategoryRequest } from '@/services/adminService';
import { fetchCategories } from '@/services/catalogService';
import { getErrorMessage } from '@/utils/errors';

interface Category {
  id: number;
  name: string;
  description: string;
}

function mapCategory(category: any): Category {
  return {
    id: category.id_categoria,
    name: category.nombre,
    description: category.descripcion ?? `Categoria disponible para ${category.nombre}.`,
  };
}

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({});

  useEffect(() => {
    fetchCategories().then((rows) => setCategories(rows.map(mapCategory)));
  }, []);

  const handleCreate = () => {
    setSelectedCategory(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) {
      return;
    }

    try {
      await deleteCategoryRequest(selectedCategory.id);
      setCategories((current) => current.filter((item) => item.id !== selectedCategory.id));
      toast.success('Categoria eliminada correctamente.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'No se pudo eliminar la categoria.'));
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleSave = async () => {
    try {
      const saved = await saveCategory({
        id_categoria: selectedCategory?.id,
        nombre: formData.name,
      });

      const mapped = {
        id: saved.id_categoria,
        name: saved.nombre,
        description: formData.description || saved.descripcion || `Categoria disponible para ${saved.nombre}.`,
      };

      setCategories((current) =>
        selectedCategory
          ? current.map((item) => (item.id === selectedCategory.id ? mapped : item))
          : [...current, mapped],
      );

      setIsDialogOpen(false);
      setFormData({});
      toast.success('Categoria guardada correctamente.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'No se pudo guardar la categoria.'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Categorias</h2>
          <p className="text-gray-600 mt-1">Gestion de categorias de productos</p>
        </div>
        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category.name}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(category)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(category)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? 'Editar Categoria' : 'Nueva Categoria'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Peluches"
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
                placeholder="Descripcion visual de la categoria"
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
              Esta accion no se puede deshacer. La categoria "{selectedCategory?.name}" sera eliminada permanentemente.
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
