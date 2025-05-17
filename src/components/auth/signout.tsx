import { firebaseConfig } from "../../lib/xaca/utils/config";
import { initializeApp } from "firebase/app";
import { getAuth,signOut} from "firebase/auth";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router";

export default function SignOut(){
    const navigate = useNavigate();
    const [mensaje,setMensaje] = useState("");

    useEffect(()=>{
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        signOut(auth)
        .then(()=>{
            navigate("/");
            setMensaje("La sesión se ha cerrado");
        })
        .catch(()=>{
            setMensaje("Error, al cerrar la sesión");
        });
    });
    return (<>{mensaje}</>);
}