import { useRef, useState, useEffect } from 'react';
import { firebaseConfig } from '@/lib/xaca/utils/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { InputImage } from "@/components/ui";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase/auth';
import readUser from '../../lib/xaca/data/read_user';
import { UserInfo } from '@/types/user_info';

/*
 const urlImage = await uploadImage() as UploadImageResponse;
            if (!urlImage.error && urlImage.data) {
                formData.avatar = urlImage.data;
            } else {
                // More specific error message based on the error type
                const errorMessage = urlImage.message || "Error al subir imagen";
                if (typeof errorMessage === 'string' && errorMessage.includes("No file selected")) {
                    toast.error("Por favor seleccione una imagen");
                } else if (typeof errorMessage === 'string' && errorMessage.includes("storage/unauthorized")) {
                    toast.error("No tiene permisos para subir imágenes");
                } else if (typeof errorMessage === 'string' && errorMessage.includes("storage/canceled")) {
                    toast.error("La subida de la imagen fue cancelada");
                } else if (typeof errorMessage === 'string' && errorMessage.includes("storage/retry-limit-exceeded")) {
                    toast.error("Error de conexión. Por favor intente nuevamente");
                } else {
                    toast.error("Error al subir imagen: " + (typeof errorMessage === 'string' ? errorMessage : "Error desconocido"));
                }
                setIsLoading(false);
                return;
            }
*/

interface UploadImageResponse {
    error: boolean;
    data?: string;
    message?: string;
}

export default function EditProfile() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement> | null;
    const [formData, setFormData] = useState({
        id: '',
        nombre: '',
        apellido: '',
        celular: '',
        direccion: '',
        correo: '',
        password: '',
        confirmPassword: '',
        avatar: '',
        role: ''
    });
    const [errors, setErrors] = useState({
        nombre: '',
        apellido: '',
        celular: '',
        direccion: '',
        correo: '',
        password: '',
        confirmPassword: '',
        avatar: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // Fetch current user data on mount
    useEffect(() => {
        (async () => {
            try {
                const app = initializeApp(firebaseConfig);
                const auth = getAuth(app);
                await auth.authStateReady?.();
                const user = auth.currentUser;
                if (!user?.uid) {
                    navigate('/login');
                    return;
                }
                const userData = await readUser(user.uid) as UserInfo;
                if (userData) {
                    setFormData(prev => ({
                        ...prev,
                        id: user.uid,
                        nombre: userData.nombre || '',
                        apellido: userData.apellido || '',
                        celular: userData.celular || '',
                        direccion: userData.direccion || '',
                        correo: userData.correo || '',
                        avatar: userData.avatar || '',
                        role: userData.role || ''
                    }));
                }
            } catch (e) {
                toast.error('Error al cargar los datos del usuario');
            } finally {
                setIsFetching(false);
            }
        })();
    }, [navigate]);

    if (isFetching) {
        return (
            <div className="w-full min-h-[660px] flex justify-center items-center p-2 md:p-4">
                <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl flex justify-center items-center">
                    <span className="text-lg text-gray-600">Cargando datos del usuario...</span>
                </div>
            </div>
        );
    }

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

        if(!fileInputRef?.current?.files?.length && !formData.avatar)
        {
            newErrors.avatar = 'La imagen es requerida';
            isValid = false;
        }
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
                avatar:formData.avatar,
                role:formData.role
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
            let urlImage: UploadImageResponse = { error: false, data: formData.avatar };
            if (fileInputRef?.current?.files?.length) {
                urlImage = await uploadImage();
            }
            if (!urlImage.error && urlImage.data) {
                formData.avatar = urlImage.data;
            } else {
                const errorMessage = urlImage.message || "Error al subir imagen";
                if (typeof errorMessage === 'string' && errorMessage.includes("No file selected")) {
                    toast.error("Por favor seleccione una imagen");
                } else if (typeof errorMessage === 'string' && errorMessage.includes("storage/unauthorized")) {
                    toast.error("No tiene permisos para subir imágenes");
                } else if (typeof errorMessage === 'string' && errorMessage.includes("storage/canceled")) {
                    toast.error("La subida de la imagen fue cancelada");
                } else if (typeof errorMessage === 'string' && errorMessage.includes("storage/retry-limit-exceeded")) {
                    toast.error("Error de conexión. Por favor intente nuevamente");
                } else {
                    toast.error("Error al subir imagen: " + (typeof errorMessage === 'string' ? errorMessage : "Error desconocido"));
                }
                setIsLoading(false);
                return;
            }
            const saveResult = await saveUserData(formData.id);
            if(saveResult.error){
                toast.error("Error al guardar los datos del usuario");
            }
            else{
                toast.success("Perfil actualizado con éxito");
                setTimeout(()=>{
                    navigate("/")
                },1500);
            }
            setIsLoading(false);
        }
    };


    function uploadImage(): Promise<UploadImageResponse> {
        return new Promise((resolve: (value: UploadImageResponse) => void, reject: (reason: UploadImageResponse) => void) => {
            if (!fileInputRef?.current?.files?.length) {
                reject({error: true, message: "No file selected"});
                return;
            }
            
            const app = initializeApp(firebaseConfig);
            const storageRef = ref(getStorage(app),`images/users/${uuidv4()}`);
            const file = fileInputRef?.current?.files?.[0];
            
            uploadBytes(storageRef, file).then((snapshot) => {
                getDownloadURL(snapshot.ref).
                then((downloadURL) => {
                    resolve({error:false,data:downloadURL});
                });
            }).catch((error) => {
                reject({error:true,message:error});
            });
        });        
    }
    return (
        <div className="w-full min-h-[660px] flex justify-center items-center p-2 md:p-4">
            <Toaster />
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl relative">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Registro</h2>
                {/* Close button */}
                <button className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600" onClick={() => navigate("/")}>×</button>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left column: Avatar + 3 fields */}
                        <div className="flex flex-col items-center md:items-start">
                            <InputImage fileInputRef={fileInputRef} initialImage={formData.avatar} />
                            {errors.avatar && <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>}
                            <div className="w-full mt-6 space-y-4">
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
                                    id: formData.id,
                                    nombre: '',
                                    apellido: '',
                                    celular: '',
                                    direccion: '',
                                    correo: '',
                                    password: '',
                                    confirmPassword: '',
                                    avatar: ''
                                }); 
                                setErrors({
                                    nombre: '',
                                    apellido: '',
                                    celular: '',
                                    direccion: '',
                                    correo: '',
                                    password: '',
                                    confirmPassword: '',
                                    avatar: ''
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
