import { FC, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate  } from 'react-router';
import { Product } from '@/types/product';
import { useInventarioStore } from '@/store/inventarioStore';

interface ShowProductProps {
  onBack?: () => void;
}

export const ShowProduct: FC<ShowProductProps> = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [product,setProduct] = useState<Product | null>(null);
    const {getInventarioItem,getInventario} = useInventarioStore();
    
  useEffect(() => {
    const productId:string = params.id as string;
    setProduct(getInventarioItem(productId));
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Container */}
        <div className="w-full md:w-1/2">
          <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
            <img src={product?.url} alt={product?.name} className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Nombre"
              value={product?.name}
              onChange={(e) => console.log(e.target.value)}
              className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price Input */}
          <div className="space-y-2">
            <label className="block text-lg font-medium">Precio</label>
            <input
              type="text"
              value={product?.price}
              onChange={(e) => console.log(e.target.value)}
              className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quantity Input */}
          <div className="space-y-2">
            <label className="block text-lg font-medium">Cantidad</label>
            <input
              type="number"
              value={product?.quantity}
              min={0}
              onChange={(e) => console.log(e.target.value)}
              className="w-32 p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="block text-lg font-medium">Descripción</label>
            <textarea
              rows={4}
              value={product?.description}
              onChange={(e) => console.log(e.target.value)}
              className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Save Button */}
          <button className="w-full md:w-auto px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
