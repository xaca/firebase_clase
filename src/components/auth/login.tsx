import {useState} from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../../libs/utils/config";

export default function Login() {

  const [mail,setMail] = useState<string>("");
  const [password,setPassword] = useState<string>("");

  function signIn()
  {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    signInWithEmailAndPassword(auth, mail, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user.uid);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode,errorMessage);
      alert(errorMessage);
    });
  }

  function handledSubmit(e:React.MouseEvent<HTMLButtonElement>)
  {
    e.preventDefault();
    if(mail != "" && password != "")
    {
        signIn();
    }
    else
    {
        alert("Verifique los datos y vuelva a intentar");
    }
  }

  return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        <p>{mail} {password}</p>
        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-gray-700">
              Correo
            </label>
            <input
              type="email"
              id="email"
              onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setMail(e.target.value)}
              placeholder="Ingrese su correo"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              No estoy registrado
            </a>
          </div>

          <button
            type="submit"
            onClick={handledSubmit}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Enviar
          </button>
        </form>
      </div>
  );
}