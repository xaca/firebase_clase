//import { useParams } from "react-router";
import { useEffect,useState } from "react";
import { ProductInfo } from "../../libs/data/product_info";
import readProducts from "../../libs/data/read_product";
import CardProduct from "./card_product";

export default function Gallery(){
    //const params = useParams();
    const datos = [
        {
            nombre:"Licuadora",
            descripcion:"Licuadora de tres velocidades",
            precio:30000,
            cantidad:20
        },
        {
            nombre:"Tv",
            descripcion:"Smart Tv 4k",
            precio:2500000,
            cantidad:10
        },
        {
            nombre:"Tostadora",
            descripcion:"Tostadora de dos rebanadas",
            precio:70000,
            cantidad:12
        },
        {
            nombre:"Aspiradora",
            descripcion:"Aspiradora de 2000w",
            precio:150000,
            cantidad:5
        },
        {
            nombre:"Nevera",
            descripcion:"Nevera de 200 litros",
            precio:1500000,
            cantidad:3
        },
        {
            nombre:"Ventilador",
            descripcion:"Ventilador de 2000w",
            precio:150000,
            cantidad:5
        },
        {
            nombre:"Computador",
            descripcion:"Computador de 16gb de ram",
            precio:150000,
            cantidad:5
        }
    ]
    const [products,setProducts] = useState<ProductInfo[]>([]);
    useEffect(()=> {
        (async () => {
            const products = await readProducts();
            console.log(products);
            setProducts(products as ProductInfo[]);
        })();
    }, []);
    return(<section className="w-full h-full justify-center mt-4">
    {/*{params.uid}*/}
        <h1 className="w-full text-center mx-auto mb-4 text-2xl font-bold">Galeria</h1>
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
            <CardProduct key={product.id} product={product} />
        ))}
        </section>
    </section>);
}