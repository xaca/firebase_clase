import { useCartStore } from "@/store";
import { Product } from "@/types/product";
import { Plus, Minus } from 'lucide-react';
import { useState } from "react";
import {Toaster,toast} from "react-hot-toast";

export default function CardProduct({product}:{product:any}){
    const {products,addProduct,updateProduct} = useCartStore();
    const [cantidad, setCantidad] = useState(0);
    
    const addToCart = (product:Product) => {
        if(cantidad > 0){
            product.quantity = cantidad;
            
            const productExistente = products.find(p => p.id === product.id);
           
            if(productExistente){
                productExistente.quantity = productExistente.quantity+cantidad;
                updateProduct(productExistente);
            }
            else{
                addProduct(product);
            }
           
            setCantidad(0);
            toast.success("Producto agregado al carrito");
        }
        else{
            toast.error("Debe seleccionar como minimo un producto");
        }
    }
    const restarCantidad = () => {
        if(cantidad - 1 >= 0){
            setCantidad(cantidad - 1);
        }
        else{
            toast.error("La cantidad debe ser mayor o igual a 1");
        }
    }
    const sumarCantidad = () => {
        if(cantidad + 1 <= product.quantity){
            setCantidad(cantidad + 1);
        }
        else{
            toast.error("No hay más productos disponibles");
        }

    }
    return(
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 max-w-sm">
            <Toaster />
            {/* Product Image */}
            <div className="relative aspect-square mb-4">
                <img 
                    src={product.url} 
                    alt={product.name}
                    className="w-full h-full object-contain"
                />
            </div>
                    
            {/* Product Name */}
            <h2 className="text-gray-800 font-medium text-lg mb-3 line-clamp-2">
                {product.name}
            </h2>
            
            {/* Price Section */}
            <div className="flex flex-col mb-2">
                <div>
                <span className="text-2xl font-bold">
                    ${new Intl.NumberFormat('es-CO').format(product.price)}
                </span>
                {/*product.discount && (
                    <span className="text-green-500 font-medium">
                        {product.discount}% OFF
                    </span>
                )}*/}
                </div>
                <div>Inventario: {product.quantity}</div>
                <div className="mt-4 flex items-center gap-2">
                <div className="mt-4" onClick={() => addToCart(product)}    >
                    <button className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md">
                        Agregar
                    </button>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <Minus onClick={restarCantidad} className="cursor-pointer text-gray-500 rounded-md border-2 border-black" />
                    <input className="w-5 text-center" type="text" readOnly value={cantidad} name="cantidad" id="cantidad" />
                    <Plus onClick={sumarCantidad} className="cursor-pointer text-gray-500 rounded-md border-2 border-black" />
                </div>
                </div>
            </div>
            
            {/* Payment Info */}
            {/*product.cuotas && (
                <p className="text-gray-600 text-sm mb-3">
                    en {product.cuotas.cantidad} cuotas de ${new Intl.NumberFormat('es-CO').format(product.cuotas.valor)} {product.cuotas.interes}
                </p>
            )}*/}
            
            {/* Free Shipping */}
            {/*product.envioGratis && (
                <div className="text-green-500 text-sm font-medium">
                    Envío gratis
                </div>
            )*/}
        </div>
    )
}
