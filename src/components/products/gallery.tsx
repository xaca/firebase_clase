//import { useParams } from "react-router";
import { useEffect,useState } from "react";
import { ProductInfo } from "../../libs/data/product_info";
import readProducts from "../../libs/data/read_product";

export default function Gallery(){
    //const params = useParams();
    const [products,setProducts] = useState<ProductInfo[]>([]);
    useEffect(()=> {
        (async () => {
            const products = await readProducts();
            console.log(products);
            setProducts(products as ProductInfo[]);
        })();
    }, []);
    return(<>
    {/*{params.uid}*/}
    <h1>Galeria</h1>
    <section>
    {products.map((product) => (
        <div key={product.id}>
            <h2>{product.nombre}</h2>
            <p>{product.descripcion}</p>
            <p>{product.precio}</p>
        </div>
    ))}
    </section>
    </>);
}