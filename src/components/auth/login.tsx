import {useState} from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../../libs/utils/config";

export default function Login() {

  const [formData, setFormData] = useState({
      email: '',
      password: '',
    });

  const [errors, setErrors] = useState({
      email: '',
      password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
        ...prev,
        [name]: ''
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Correo validation
    if (!formData.email.trim()) {
        newErrors.email = 'El correo es requerido';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Ingrese un correo válido';
        isValid = false;
    }

    // Password validation
    if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
        isValid = false;
    } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  function signIn()
  {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    signInWithEmailAndPassword(auth, "", "")
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

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (validateForm()) {
          // Aquí iría la lógica para enviar los datos
          signIn();
      }
      else
      {
        //alert("Verifique los datos y vuelva a intentar");
      }
  };

 /*
  <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                    errors.nombre ? 'border-red-500' : ''
                                }`}
                                placeholder="Ingrese su nombre"
                            />
                            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
 */

  return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        <p>{formData.email} {formData.password}</p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-gray-700">
              Correo
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingrese su correo"
              className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
              className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              No estoy registrado
            </a>
          </div>

          <button
            type="submit"            
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Enviar
          </button>
        </form>
      </div>
  );
}