import { useCartStore,useInventarioStore } from "@/store";
import { Product } from "@/types/product";
import { Trash2 } from "lucide-react";

export default function ShopingCart() {
    const {products,removeProduct} = useCartStore();
    const {getInventarioItem,updateInventario} = useInventarioStore();

    const eliminarProducto = (product:Product) => {
        const product_inventario = getInventarioItem(product.id);
        removeProduct(product.id);
        if(product_inventario){
            updateInventario(product.id,product_inventario.quantity + product.quantity);
        }
    }
    function total() {
        const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
        return total;
    }
    return(<><section className="overflow-x-hidden w-full h-full">
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
                    <td>{product.quantity}</td>
                    <td>
                        <button className="cursor-pointer" onClick={() => eliminarProducto(product)}>
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
