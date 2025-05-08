import { X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { UserInfo } from '../../libs/data/user_info';
import { useEffect } from 'react';

export default function Profile({ 
    className, 
    onClose, 
    userInfo 
}: { 
    className?: string; 
    onClose: () => void;
    userInfo: UserInfo;
}) {
    const navigate = useNavigate();
    useEffect(() => {
        if(userInfo === null){
            navigate('/signout');
        }
    }, [userInfo]);

    const handleLogout = () => {
        onClose();
        navigate('/signout');
    }
    return (
        <div id="profile" className={`absolute top-10 right-5 max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden md:max-w-md ${className}`}>
            <div className="md:flex">
                <div className="w-full p-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold">UPB</h1>
                        <X className="cursor-pointer" onClick={onClose} />
                    </div>
                    <div className="flex items-center mt-4">
                        <img className="w-16 h-16 rounded-full mr-4" src="/path/to/profile.jpg" alt="Profile" />
                        <div>
                            <h2 className="text-lg font-semibold">{`${userInfo?.nombre} ${userInfo?.apellido}`}</h2>
                            <p className="text-sm text-gray-600">{userInfo?.correo}</p>
                            <p className="text-sm text-gray-600">Dirección: {userInfo?.direccion}</p>
                            <p className="text-sm text-gray-600">Celular: {userInfo?.celular}</p>
                        </div>
                    </div>                    
                    <button onClick={handleLogout} className="text-sm text-gray-600">Cerrar sesión</button>
                </div>
            </div>
        </div>
    );
}
