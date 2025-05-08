export default function CardProduct({product}:{product:any}){
    return(
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 max-w-sm">
            {/* Product Image */}
            <div className="relative aspect-square mb-4">
                <img 
                    src={product.image} 
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
            <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold">
                    ${new Intl.NumberFormat('es-CO').format(product.precio)}
                </span>
                {product.descuento && (
                    <span className="text-green-500 font-medium">
                        {product.descuento}% OFF
                    </span>
                )}
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
