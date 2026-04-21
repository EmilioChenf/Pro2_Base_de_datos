import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader } from './ui/card';
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
import { Badge } from './ui/badge';
import { saveProduct, deleteProduct as deleteProductRequest } from '@/services/adminService';
import {
  fetchBrands,
  fetchCategories,
  fetchProducts,
  fetchSuppliers,
} from '@/services/catalogService';
import { getErrorMessage } from '@/utils/errors';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  supplier: string;
  brand: string;
  image: string;
}

function mapProduct(product: any): Product {
  return {
    id: product.id_producto,
    name: product.nombre,
    description: product.descripcion,
    price: product.precio,
    stock: product.stock,
    category: product.categoria,
    supplier: product.proveedor,
    brand: product.marca,
    image: product.imagen,
  };
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const loadData = async () => {
    const [productRows, categoryRows, brandRows, supplierRows] = await Promise.all([
      fetchProducts(),
      fetchCategories(),
      fetchBrands(),
      fetchSuppliers(),
    ]);

    setProducts(productRows.map(mapProduct));
    setCategories(categoryRows.map((item) => item.nombre));
    setBrands(brandRows.map((item) => item.nombre));
    setSuppliers(supplierRows.map((item) => item.nombre));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = () => {
    setSelectedProduct(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) {
      return;
    }

    try {
      await deleteProductRequest(selectedProduct.id);
      setProducts((current) => current.filter((item) => item.id !== selectedProduct.id));
      toast.success('Producto eliminado correctamente.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'No se pudo eliminar el producto.'));
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleSave = async () => {
    try {
      const saved = await saveProduct({
        id_producto: selectedProduct?.id,
        nombre: formData.name,
        descripcion: formData.description,
        precio: formData.price,
        stock: formData.stock,
        categoria: formData.category,
        proveedor: formData.supplier,
        marca: formData.brand,
        imagen:
          formData.image ||
          selectedProduct?.image ||
          'https://placehold.co/600x600/png?text=Producto',
      });

      const mapped = mapProduct(saved);

      setProducts((current) =>
        selectedProduct
          ? current.map((item) => (item.id === selectedProduct.id ? mapped : item))
          : [...current, mapped],
      );

      setIsDialogOpen(false);
      setFormData({});
      toast.success('Producto guardado correctamente.');
      await loadData();
    } catch (error) {
      toast.error(getErrorMessage(error, 'No se pudo guardar el producto.'));
    }
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          filterCategory === 'all' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
      }),
    [filterCategory, products, searchTerm],
  );

  const categoryOptions = ['all', ...categories];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Productos</h2>
          <p className="text-gray-600 mt-1">Gestion de inventario y catalogo</p>
        </div>
        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o marca..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterCategory}
                onChange={(event) => setFilterCategory(event.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las categorias</option>
                {categoryOptions
                  .filter((item) => item !== 'all')
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Categoria</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Marca</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Precio</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stock</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Proveedor</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">{product.id}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant="secondary">{product.category}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{product.brand}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">${product.price}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant={product.stock < 10 ? 'destructive' : 'default'}>
                        {product.stock}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{product.supplier}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" onClick={() => handleEdit(product)}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded" onClick={() => handleDelete(product)}>
                          <Trash2 className="w-4 h-4" />
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Peluche Panda"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripcion</label>
              <textarea
                value={formData.description || ''}
                onChange={(event) =>
                  setFormData({ ...formData, description: event.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Descripcion detallada del producto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(event) =>
                  setFormData({ ...formData, price: Number(event.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
              <input
                type="number"
                value={formData.stock || ''}
                onChange={(event) =>
                  setFormData({ ...formData, stock: Number(event.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <input
                list="product-categories"
                type="text"
                value={formData.category || ''}
                onChange={(event) =>
                  setFormData({ ...formData, category: event.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Peluches"
              />
              <datalist id="product-categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
              <input
                list="product-brands"
                type="text"
                value={formData.brand || ''}
                onChange={(event) => setFormData({ ...formData, brand: event.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Escandalosos"
              />
              <datalist id="product-brands">
                {brands.map((brand) => (
                  <option key={brand} value={brand} />
                ))}
              </datalist>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor</label>
              <input
                list="product-suppliers"
                type="text"
                value={formData.supplier || ''}
                onChange={(event) =>
                  setFormData({ ...formData, supplier: event.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Distribuidora ABC"
              />
              <datalist id="product-suppliers">
                {suppliers.map((supplier) => (
                  <option key={supplier} value={supplier} />
                ))}
              </datalist>
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
              Esta accion no se puede deshacer. El producto "{selectedProduct?.name}" sera eliminado permanentemente.
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
