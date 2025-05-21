import { useState } from 'react';
import { firebaseConfig } from '../../lib/xaca/utils/config';
import { initializeApp } from 'firebase/app';
import { getAuth,createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from "firebase/firestore"; 
import { toast,Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

export default function Register() {
    const navigate = useNavigate();
    const defaultAvatar = 'https://firebasestorage.googleapis.com/v0/b/fullstack-fed2d.appspot.com/o/images%2Fusers%2FUser-blue-icon.png?alt=media&token=05db934c-9161-4a44-9789-fafef4520c2d';
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        celular: '',
        direccion: '',
        correo: '',
        password: '',
        confirmPassword: '',
        avatar: defaultAvatar
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

    async function saveUserData(uid:string){
        try {
            const app = initializeApp(firebaseConfig);
            const db = getFirestore(app);
            await setDoc(doc(db, "usuarios", uid), {
                nombre:formData.nombre,
                apellido:formData.apellido,
                celular:formData.celular,
                direccion:formData.direccion,
                correo:formData.correo,
                avatar:formData.avatar
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
                            navigate("/")
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
        <div className="w-full min-h-[660px] flex justify-center items-center p-2 md:p-4">
            <Toaster />
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl relative">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Registro</h2>
                {/* Close button (optional) */}
                {/* <button className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600">&times;</button> */}
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left column: Avatar + 3 fields */}
                        <div className="flex flex-col items-center md:items-start">                           
                            <div className="w-full mt-6 space-y-4">
                                {/* Nombre */}
                                <div>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className={`w-full bg-gray-200 rounded-md px-4 py-2 text-lg placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.nombre ? 'border border-red-500' : ''}`}
                                        placeholder="Nombre"
                                    />
                                    {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                                </div>
                                {/* Apellido */}
                                <div>
                                    <input
                                        type="text"
                                        id="apellido"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        className={`w-full bg-gray-200 rounded-md px-4 py-2 text-lg placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.apellido ? 'border border-red-500' : ''}`}
                                        placeholder="Apellido"
                                    />
                                    {errors.apellido && <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>}
                                </div>
                                {/* Celular */}
                                <div>
                                    <input
                                        type="tel"
                                        id="celular"
                                        name="celular"
                                        value={formData.celular}
                                        onChange={handleChange}
                                        className={`w-full bg-gray-200 rounded-md px-4 py-2 text-lg placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.celular ? 'border border-red-500' : ''}`}
                                        placeholder="Celular"
                                    />
                                    {errors.celular && <p className="mt-1 text-sm text-red-600">{errors.celular}</p>}
                                </div>
                            </div>
                        </div>
                        {/* Right column: 4 fields */}
                        <div className="flex flex-col justify-between h-full w-full space-y-4">
                            {/* Clave */}
                            <div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-200 rounded-md px-4 py-2 text-lg placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.password ? 'border border-red-500' : ''}`}
                                    placeholder="Clave"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>
                            {/* Validar clave */}
                            <div>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-200 rounded-md px-4 py-2 text-lg placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.confirmPassword ? 'border border-red-500' : ''}`}
                                    placeholder="Validar clave"
                                />
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                            </div>
                            {/* Correo */}
                            <div>
                                <input
                                    type="email"
                                    id="correo"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-200 rounded-md px-4 py-2 text-lg placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.correo ? 'border border-red-500' : ''}`}
                                    placeholder="Correo"
                                />
                                {errors.correo && <p className="mt-1 text-sm text-red-600">{errors.correo}</p>}
                            </div>
                            {/* Dirección */}
                            <div>
                                <textarea
                                    id="direccion"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    rows={3}
                                    className={`w-full bg-gray-200 rounded-md px-4 py-2 text-lg placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.direccion ? 'border border-red-500' : ''}`}
                                    placeholder="Dirección"
                                />
                                {errors.direccion && <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>}
                            </div>
                        </div>
                    </div>
                    {/* Buttons */}
                    <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
                        <button
                            type="reset"
                            className="w-full md:w-48 bg-gray-400 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
                            onClick={() => {
                                setFormData({
                                    nombre: '',
                                    apellido: '',
                                    celular: '',
                                    direccion: '',
                                    correo: '',
                                    password: '',
                                    confirmPassword: '',
                                    avatar: defaultAvatar
                                }); 
                                setErrors({
                                    nombre: '',
                                    apellido: '',
                                    celular: '',
                                    direccion: '',
                                    correo: '',
                                    password: '',
                                    confirmPassword: ''
                                });
                            }}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className={`w-full md:w-48 bg-gray-400 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Cargando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}