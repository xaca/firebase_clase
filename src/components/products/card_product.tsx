import { useCartStore, useInventarioStore } from "@/store";
import { Product } from "@/types/product";
import { Plus, Minus } from 'lucide-react';
import { useState } from "react";
import {Toaster,toast} from "react-hot-toast";
import { useNavigate } from "react-router";

export default function CardProduct({product}:{product:any}){
    const navigate = useNavigate();
    const {products,addProduct,updateProduct} = useCartStore();
    const {inventario,updateInventario} = useInventarioStore();
    const [cantidad, setCantidad] = useState(0);
    const currentProduct = inventario.find((p:Product) => p.id === product.id);

    const addToCart = () => {
        if(currentProduct){
            if(cantidad > 0){
                console.log("inventario",currentProduct.quantity,"cantidad",cantidad);
                
                const productExistente = products.find(p => p.id === currentProduct.id);
                
                if(productExistente){
                    productExistente.quantity = productExistente.quantity+cantidad;
                    updateProduct(productExistente);
                }
                else{
                    const product = {...currentProduct,quantity:cantidad};
                    addProduct(product);
                }

                currentProduct.quantity -= cantidad;
                updateInventario(currentProduct.id,currentProduct.quantity);
            
                setCantidad(0);
                toast.success("Producto agregado al carrito");
            }
            else{
                toast.error("Debe seleccionar como minimo un producto");
            }
        }
        else{
            toast.error("Producto no disponible");
        }
    }
    const restarCantidad = () => {
        if(currentProduct){
            if(cantidad - 1 >= 0){
                setCantidad(cantidad - 1);
            }
            else{
                toast.error("La cantidad debe ser mayor o igual a 1");
            }
        }
        else{
            toast.error("Producto no disponible");
        }
    }
    const sumarCantidad = () => {
        if(currentProduct)
        {
            if(cantidad + 1 <= currentProduct.quantity){
                setCantidad(cantidad + 1);
            }
            else{
                    toast.error("No hay más productos disponibles");
                }
        }
        else{
            toast.error("Producto no disponible");
        }
    }

    return(currentProduct && (
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 max-w-sm">
            <Toaster />
            <div onClick={() => navigate(`/product/${currentProduct.id}`)} className="cursor-pointer">
            {/* Product Image */}
            <div className="relative aspect-square mb-4">
                <img 
                    src={currentProduct.url} 
                    alt={currentProduct.name}
                    className="w-full h-full object-contain"
                />
            </div>
                    
            {/* Product Name */}
            <h2 className="text-gray-800 font-medium text-lg mb-3 line-clamp-2">
                {currentProduct.name}
            </h2>
            </div>
            {/* Price Section */}
            <div className="flex flex-col mb-2">
                <div>
                <span className="text-2xl font-bold">
                    ${new Intl.NumberFormat('es-CO').format(currentProduct.price)}
                </span>
                {/*product.discount && (
                    <span className="text-green-500 font-medium">
                        {product.discount}% OFF
                    </span>
                )}*/}
                </div>
                <div>Inventario: {currentProduct.quantity}</div>
                <div className="mt-4 flex items-center gap-2">
                <div className="mt-4" onClick={() => addToCart()}    >
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
    ))
}
