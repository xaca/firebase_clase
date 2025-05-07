import { useState } from 'react';
import { firebaseConfig } from '../../libs/utils/config';
import { initializeApp } from 'firebase/app';
import { getAuth,createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore,collection, setDoc, doc } from "firebase/firestore"; 
import { Link } from "react-router";
import { toast,Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

export default function Register() {
    
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        celular: '',
        direccion: '',
        correo: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        nombre: '',
        apellido: '',
        celular: '',
        direccion: '',
        correo: '',
        password: '',
        confirmPassword: ''
    });

    const [isLoading, setIsLoading] = useState(false);
     
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

        // Nombre validation
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
            isValid = false;
        }

        // Apellido validation
        if (!formData.apellido.trim()) {
            newErrors.apellido = 'El apellido es requerido';
            isValid = false;
        }

        // Celular validation
        if (!formData.celular.trim()) {
            newErrors.celular = 'El celular es requerido';
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.celular)) {
            newErrors.celular = 'El celular debe tener 10 dígitos';
            isValid = false;
        }

        // Dirección validation
        if (!formData.direccion.trim()) {
            newErrors.direccion = 'La dirección es requerida';
            isValid = false;
        }

        // Correo validation
        if (!formData.correo.trim()) {
            newErrors.correo = 'El correo es requerido';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            newErrors.correo = 'Ingrese un correo válido';
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

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Debe confirmar la contraseña';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    async function saveUserAutenticate(){
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        try{
            
            const ans = await createUserWithEmailAndPassword(auth,formData.correo,formData.password);
            return {error:false,data:ans};
        }
        catch(e){
            return {error:true}
        }
        
    }

    async function saveUserData(uid:String){
        try {
            const app = initializeApp(firebaseConfig);
            const db = getFirestore(app);
            await setDoc(doc(db, "usuarios", `${uid}`), {
                nombre:formData.nombre,
                apellido:formData.apellido,
                celular:formData.celular,
                direccion:formData.direccion,
                correo:formData.correo
            });

            return {error:false,id:uid};

          } catch (e) {
            return {error:true,message:e}
          }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            const response = await saveUserAutenticate();
            let error = false;            
            if(!response.error)
            {
                if(response.data)
                {
                    const ans = await saveUserData(response.data.user.uid);
        
                    if(!ans.error)
                    {
                        toast.success("Usuario creado con éxito");
                        setTimeout(()=>{
                            navigate("/login")
                        },1500);
                    }
                    else
                    {
                        error = true;
                    }
                }
                else{                    
                    error = true;
                }
            }
            else
            {
                error = true;
            }
            
            if(error)
            {
                toast.error("Error al guardar el usuario");
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <Toaster />
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Registro</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                                Nombre
                            </label>
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
                        </div>

                        {/* Apellido */}
                        <div>
                            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                                Apellido
                            </label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                    errors.apellido ? 'border-red-500' : ''
                                }`}
                                placeholder="Ingrese su apellido"
                            />
                            {errors.apellido && <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>}
                        </div>

                        {/* Celular */}
                        <div>
                            <label htmlFor="celular" className="block text-sm font-medium text-gray-700">
                                Celular
                            </label>
                            <input
                                type="tel"
                                id="celular"
                                name="celular"
                                value={formData.celular}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                    errors.celular ? 'border-red-500' : ''
                                }`}
                                placeholder="Ingrese su celular"
                            />
                            {errors.celular && <p className="mt-1 text-sm text-red-600">{errors.celular}</p>}
                        </div>

                        {/* Correo */}
                        <div>
                            <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
                                Correo
                            </label>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                    errors.correo ? 'border-red-500' : ''
                                }`}
                                placeholder="Ingrese su correo"
                            />
                            {errors.correo && <p className="mt-1 text-sm text-red-600">{errors.correo}</p>}
                        </div>
                    </div>

                    {/* Dirección */}
                    <div>
                        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                            Dirección
                        </label>
                        <textarea
                            id="direccion"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            rows={3}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                errors.direccion ? 'border-red-500' : ''
                            }`}
                            placeholder="Ingrese su dirección"
                        />
                        {errors.direccion && <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>}
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                errors.password ? 'border-red-500' : ''
                            }`}
                            placeholder="Ingrese su clave"
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    </div>

                    {/* Confirmar Contraseña */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirmar contraseña
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                errors.confirmPassword ? 'border-red-500' : ''
                            }`}
                            placeholder="Confirme su clave"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                    </div>
                    <div className='flex justify-content'>
                        <Link to="/" className='mr-4'>
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >Volver</button>
                        </Link>
                        <button
                            type="submit"
                            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Cargando...' : 'Enviar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}