import { useCartStore } from "@/store";
import { Product } from "@/types/product";

export default function CardProduct({product}:{product:any}){
    const {addProduct} = useCartStore();
    const addToCart = (product:Product) => {
        addProduct(product);
    }
    return(
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 max-w-sm">
            {/* Product Image */}
            <div className="relative aspect-square mb-4">
                <img 
                    src={product.url} 
                    alt={product.nombre}
                    className="w-full h-full object-contain"
                />
            </div>
            
            {/* Brand */}
            <div className="text-gray-600 font-semibold uppercase text-sm mb-1">
                {product.marca}
            </div>
            
            {/* Product Name */}
            <h2 className="text-gray-800 font-medium text-lg mb-3 line-clamp-2">
                {product.nombre}
            </h2>
            
            {/* Price Section */}
            <div className="flex flex-col mb-2">
                <div>
                <span className="text-2xl font-bold">
                    ${new Intl.NumberFormat('es-CO').format(product.precio)}
                </span>
                {product.descuento && (
                    <span className="text-green-500 font-medium">
                        {product.descuento}% OFF
                    </span>
                )}
                </div>
                <div className="mt-4" onClick={() => addToCart(product)}    >
                    <button className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md">
                        Agregar
                    </button>
                </div>
            </div>
            
            {/* Payment Info */}
            {product.cuotas && (
                <p className="text-gray-600 text-sm mb-3">
                    en {product.cuotas.cantidad} cuotas de ${new Intl.NumberFormat('es-CO').format(product.cuotas.valor)} {product.cuotas.interes}
                </p>
            )}
            
            {/* Free Shipping */}
            {product.envioGratis && (
                <div className="text-green-500 text-sm font-medium">
                    Envío gratis
                </div>
            )}
        </div>
    )
}
