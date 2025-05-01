import { useParams } from "react-router";

export default function Gallery(){
    const params = useParams();

    return(<>
    {params.uid}
    <h1>Galeria</h1>
    </>);
}