//import { useParams } from "react-router";
import { useEffect,useState } from "react";
import { Product } from "@/types/product";
import readProducts from "../../lib/xaca/data/read_product";
import CardProduct from "./card_product";
import { useInventarioStore } from "@/store/inventarioStore";

export default function Gallery(){
    //const params = useParams();

    const {inventario,setInventario} = useInventarioStore();
    useEffect(()=> {
        (async () => {
            if(inventario.length === 0){
                const products = await readProducts();
                console.log(products);
                setInventario(products as Product[]);
            }
        })();
    }, []);
    return(<section className="w-full h-full justify-center mt-4 p-6">
    {/*{params.uid}*/}
        <h1 className="w-full text-center mx-auto mb-4 text-2xl font-bold">Galeria</h1>
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {inventario.map((product) => (
            <CardProduct key={product.id} product={product} />
        ))}
        </section>
    </section>);
}