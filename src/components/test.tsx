import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function Test(){
    const [contador,setContador] = useState<number>(0);
    
    function promesa(resolve:any,reject:any){
        let contador = 0;
        let tope = 5;
        const id_timer:any = setInterval(()=>{
          if(++contador==tope)
          {
            clearInterval(id_timer);
            resolve("Termine"); 
          }
          
          if(Math.random()*10 > 8){
            clearInterval(id_timer);
            reject("Cancelado");
          }

          setContador(contador);
        },1000);
    }

    function handleClick(){
        /*const request = new Promise(promesa);
        request.then((ans)=>{
           console.log(ans);
        }).catch((error:any)=>{
            console.log(error);
        });*/

        toast.promise(
            new Promise<string>(promesa),
             {
               loading: 'Contando...',
               success: (data:string)=><b>{data}</b>,
               error: (err:string)=><b>{err}</b>,
             }
           );
    }

    return(
        <div className="w-[800px] mx-auto justify-center">
            <Toaster />
            <h1 className="text-4xl font-bold mt-4 text-center mb-4">Test</h1>
            <p className="text-2xl font-bold mt-4 text-center mb-4">Contador: {contador}</p>
            <button onClick={handleClick} className="bg-blue-500 text-white px-4 py-2 rounded-md">Click me</button>
        </div>
    )
}
