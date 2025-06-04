import { useCartStore,useInventarioStore } from "@/store";
import { DeleteConfirmationModal } from "@/components/dashboard";
import { Product } from "@/types/product";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function ShopingCart() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const {products,updateProduct,removeProduct} = useCartStore();
    const {getInventarioItem,updateInventario} = useInventarioStore();

    const eliminarProducto = () => {
        const product:Product|null = productToDelete;
        setIsDeleting(true);
        if(product){
            const product_inventario = getInventarioItem(product.id);
            removeProduct(product.id);
            if(product_inventario){
                updateInventario(product.id,product_inventario.quantity + product.quantity);
            }
        }
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
    }
    function total() {
        const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
        return total;
    }
    const restarCantidad = (product:Product) => {
        const productExistente = products.find(p => p.id === product.id);
        if(productExistente){
            if(productExistente.quantity-1 >= 1){
                productExistente.quantity--;
                updateProduct(productExistente);
            }
            else{
                toast.error("La minima cantidad es 1");
            }
        }
        else{
            toast.error("No se puede restar cantidad");
        }
    }
    const sumarCantidad = (product:Product) => {
        const productExistente = products.find(p => p.id === product.id);
        const inventario = getInventarioItem(product.id);
        if(productExistente && inventario){
            if(productExistente.quantity <= inventario.quantity)
            {
                productExistente.quantity++;
                updateProduct(productExistente);
            }
            else
            {
                toast.error("Llego al limite del inventario");
            }               
        }
        else{
            toast.error("No se puede agregar más productos");   
        }
    }
    return(<>
        <Toaster />
        <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
          }
        }}
        onConfirm={eliminarProducto}
        productName={productToDelete?.name || ''}
        isDeleting={isDeleting}
      />
        <section className="overflow-x-hidden w-full h-full">
        <h1 className="text-2xl font-bold mt-8 mb-8 text-center">Carrito de compras</h1>
        {(products.length>0 ? <table className="w-[350px] md:w-[750px] h-full mx-auto bg-white rounded-md">
            <thead>
                <tr className="text-left">
                    <th></th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th></th>
                </tr>
            </thead>
            <tbody className="text-[14px] md:text-[16px]">
            {products.map((product) => (
                <tr key={product.id}>
                    <td>
                        <img className="w-8 h-8 md:w-16 md:h-16" src={product.url} alt={product.name} />
                    </td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>  
                        <div className="flex items-center gap-2">                      
                        <Minus onClick={() => restarCantidad(product)} className="cursor-pointer text-gray-500 rounded-md border-2 border-black" />
                        <input className="w-5 text-center" type="text" readOnly value={product.quantity} name="cantidad" id="cantidad" />
                        <Plus onClick={() => sumarCantidad(product)} className="cursor-pointer text-gray-500 rounded-md border-2 border-black" />
                        </div>
                    </td>
                    <td>
                        <button className="cursor-pointer" onClick={() => {
                            setProductToDelete(product);
                            setIsDeleteModalOpen(true);
                        }}>
                        <Trash2 />
                        </button>
                    </td>
                </tr>
            ))}
            <tr>
                <td className="text-right pr-4" colSpan={2}>Total</td>
                <td colSpan={3}>${total()}</td>
            </tr>
            </tbody>
        </table> : <p className="text-center text-2xl font-bold mt-8 mb-8">No hay productos en el carrito</p>)}
    </section>
    </>)
}
