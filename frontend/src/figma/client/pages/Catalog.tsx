import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Eye, SlidersHorizontal } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';

export function Catalog() {
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { products, categories, brands } = useStore();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : [],
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brand') ? [searchParams.get('brand')!] : [],
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const searchQuery = searchParams.get('search') || '';

  const filteredProducts = useMemo(() => {
    const filtered = [...products]
      .filter((product) => {
        if (!searchQuery) {
          return true;
        }

        return (
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
      .filter((product) =>
        selectedCategories.length ? selectedCategories.includes(product.category) : true,
      )
      .filter((product) =>
        selectedBrands.length ? selectedBrands.includes(product.brand) : true,
      )
      .filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1],
      )
      .filter((product) => (inStockOnly ? product.stock > 0 : true));

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((left, right) => left.price - right.price);
        break;
      case 'price-desc':
        filtered.sort((left, right) => right.price - left.price);
        break;
      case 'newest':
        filtered.sort(
          (left, right) => Number(Boolean(right.isNew)) - Number(Boolean(left.isNew)),
        );
        break;
      case 'best-selling':
        filtered.sort(
          (left, right) =>
            Number(Boolean(right.isBestSeller)) - Number(Boolean(left.isBestSeller)),
        );
        break;
      default:
        filtered.sort(
          (left, right) => Number(Boolean(right.isFeatured)) - Number(Boolean(left.isFeatured)),
        );
        break;
    }

    return filtered;
  }, [
    brands,
    inStockOnly,
    priceRange,
    products,
    searchQuery,
    selectedBrands,
    selectedCategories,
    sortBy,
  ]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((value) => value !== category)
        : [...current, category],
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((current) =>
      current.includes(brand)
        ? current.filter((value) => value !== brand)
        : [...current, brand],
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Catalogo de Productos</h1>
          <p className="text-gray-600">
            {filteredProducts.length} producto
            {filteredProducts.length !== 1 ? 's' : ''} encontrado
            {filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filtros</span>
          </button>

          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <label className="text-gray-700 font-medium">Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="newest">Mas Nuevos</option>
              <option value="best-selling">Mas Vendidos</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:block w-full lg:w-64 ${showFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="font-bold text-xl mb-6 text-gray-900">Filtros</h3>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Categorias</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.id_categoria}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.nombre)}
                        onChange={() => toggleCategory(category.nombre)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{category.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Marcas</h4>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label
                      key={brand.id_marca}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.nombre)}
                        onChange={() => toggleBrand(brand.nombre)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{brand.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Rango de Precio</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(event) =>
                      setPriceRange([priceRange[0], Number(event.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(event) => setInStockOnly(event.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-700">Solo en stock</span>
                </label>
              </div>

              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedBrands([]);
                  setPriceRange([0, 2000]);
                  setInStockOnly(false);
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Limpiar Filtros
              </button>
            </div>
          </aside>

          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <p className="text-gray-500 text-lg">
                  No se encontraron productos con los filtros seleccionados.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition group"
                  >
                    <Link to={`/producto/${product.id}`}>
                      <div className="relative h-64 overflow-hidden bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                        {product.isNew && (
                          <span className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            Nuevo
                          </span>
                        )}
                        {product.stock < 10 && product.stock > 0 && (
                          <span className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            Pocos
                          </span>
                        )}
                        {product.stock === 0 && (
                          <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            Agotado
                          </span>
                        )}
                        <Link
                          to={`/producto/${product.id}`}
                          className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                          <Eye className="w-8 h-8 text-white" />
                        </Link>
                      </div>
                    </Link>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-purple-600 font-semibold">{product.brand}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                      <Link to={`/producto/${product.id}`}>
                        <h3 className="font-bold text-lg mb-2 text-gray-900 hover:text-purple-600 transition line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                        <span className="text-sm text-gray-500">{product.stock} en stock</span>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={`w-full py-3 rounded-full font-bold transition flex items-center justify-center space-x-2 ${
                          product.stock === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                        }`}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>{product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
