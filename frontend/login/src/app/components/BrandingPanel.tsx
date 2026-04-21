import { Heart, ShoppingBag, Star } from 'lucide-react';

export function BrandingPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-12 flex-col justify-between text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-24 h-24 bg-white rounded-full" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-white rounded-full" />
        <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-white rounded-full" />
        <div className="absolute bottom-40 right-10 w-20 h-20 bg-white rounded-full" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Heart className="text-white" size={28} fill="currentColor" />
          </div>
          <h1 className="text-3xl">PlushStore</h1>
        </div>
        <p className="text-blue-100 text-lg">Sistema de Gestión de Tienda</p>
      </div>

      <div className="relative z-10 space-y-8">
        <div>
          <h2 className="text-4xl mb-4 leading-tight">
            Gestiona tu tienda de peluches y merchandising
          </h2>
          <p className="text-blue-100 text-lg">
            Control total de inventario, ventas y pedidos de productos de Escandalosos, Snoopy y más.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
              <ShoppingBag size={20} />
            </div>
            <h3 className="font-medium mb-1">Inventario</h3>
            <p className="text-sm text-blue-100">Control en tiempo real</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
              <Star size={20} />
            </div>
            <h3 className="font-medium mb-1">Ventas</h3>
            <p className="text-sm text-blue-100">Reportes detallados</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-sm text-blue-100">
        © 2026 PlushStore. Sistema de gestión empresarial.
      </div>
    </div>
  );
}
