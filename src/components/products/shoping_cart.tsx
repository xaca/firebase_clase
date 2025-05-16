import { useCartStore } from "@/store";

export default function ShopingCart() {
    const {products,removeProduct} = useCartStore();
    const eliminarProducto = (id:string) => {
        removeProduct(id);
    }
    function total() {
        const total = products.reduce((acc, product) => acc + product.precio * product.cantidad, 0);
        return total;
    }
    return(<><section className="overflow-x-hidden w-full h-full">
        <h1 className="text-2xl font-bold mt-8 mb-8 text-center">Carrito de compras</h1>
        {(products.length>0 ? <table className="w-[800px] h-full mx-auto">
            <thead>
                <tr className="text-left">
                    <th></th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {products.map((product) => (
                <tr key={product.id}>
                    <td>
                        <img className="w-16 h-16" src={product.url} alt={product.nombre} />
                    </td>
                    <td>{product.nombre}</td>
                    <td>{product.precio}</td>
                    <td>{product.cantidad}</td>
                    <td>
                        <button onClick={() => eliminarProducto(product.id)}>Eliminar</button>
                    </td>
                </tr>
            ))}
            <tr>
                <td colSpan={2}>Total</td>
                <td colSpan={3}>${total()}</td>
            </tr>
            </tbody>
        </table> : <p className="text-center text-2xl font-bold mt-8 mb-8">No hay productos en el carrito</p>)}
    </section>
    </>)
}
