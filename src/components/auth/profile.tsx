import { X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import useUserStore from '@/store/userStore';

export default function Profile({  
    onClose, 
}: { 
    onClose: () => void;
}) {
    const navigate = useNavigate();
    const {user} = useUserStore();

    useEffect(() => {
        if(user === null){
            navigate('/signout');
        }
        console.log(user);
    }, [user]);

    const handleLogout = () => {
        onClose();
        hideProfile();
        navigate('/signout');
    }

    function hideProfile(){
        const profile = document.getElementById("profile");
        if(profile){
            profile.classList.remove("hidden");
            profile.classList.remove("animate__fadeInDown");
            profile.classList.add("animate__fadeOutUp");
        }
    }

    function closeProfile(){
        onClose();
        hideProfile();
    }

    return (
        <div id="profile" className={`absolute top-12 right-5 max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden md:max-w-md animate__animated hidden z-10`}>
            <div className="md:flex">
                <div className="w-full p-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold">UPB</h1>
                        <X className="cursor-pointer" onClick={closeProfile} />
                    </div>
                    <div className="flex items-center mt-4">
                        <img className="w-16 h-16 rounded-full mr-4" src={`${user?.avatar}`} alt="Profile" />
                        <div>
                            <h2 className="text-lg font-semibold">{`${user?.nombre} ${user?.apellido}`}</h2>
                            <p className="text-sm text-gray-600">{user?.correo}</p>
                            <p className="text-sm text-gray-600">Dirección: {user?.direccion}</p>
                            <p className="text-sm text-gray-600">Celular: {user?.celular}</p>
                        </div>
                    </div>                    
                    <button onClick={handleLogout} className="text-sm text-gray-600 cursor-pointer">Cerrar sesión</button>
                </div>
            </div>
        </div>
    );
}
