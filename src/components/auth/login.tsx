import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../../libs/utils/config";
import React, { useState } from 'react';
import { toast,Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
      valid = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newErrors.email = 'El correo no es válido';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  function signIn(email: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          resolve(user.uid); // Resolve with the user's uid
        })
        .catch((error) => {
          const errorMessage = error.message;
          reject(errorMessage); // Reject with the error message
        });
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      signIn(formData.email, formData.password)
        .then((uid: string) => {
          console.log("User UID:", uid); // Log the user's uid
          toast.success('Successfully toasted!')
          setTimeout(()=>{
            //navigate(`/gallery/${uid}`);
            navigate(`/gallery/`);
          },1000);
        })
        .catch((error: string) => {
          console.error("Error:", error); // Log the error message
          toast.error("This didn't work.")
        });
    }
  };

  return (<section className="w-full h-[400px] flex justify-center mt-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 w-full max-w-md">
        <Toaster />
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        
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
              value={formData.password}
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
    </section>
  );
}