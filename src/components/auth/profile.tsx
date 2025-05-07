import { X } from 'lucide-react';

export default function Profile({ className, onClose }: { className?: string; onClose: () => void }) {
    
    return (
        <div className={`absolute top-10 right-5 max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden md:max-w-md ${className}`}>
            <div className="md:flex">
                <div className="w-full p-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold">UPB</h1>
                        <X className="cursor-pointer" onClick={onClose} />
                    </div>
                    <div className="flex items-center mt-4">
                        <img className="w-16 h-16 rounded-full mr-4" src="/path/to/profile.jpg" alt="Profile" />
                        <div>
                            <h2 className="text-lg font-semibold">Andres Bedoya Tob...</h2>
                            <p className="text-sm text-gray-600">andres.bedoya@upb.edu.co</p>
                        </div>
                    </div>
                    <button className="text-sm text-gray-600">Cerrar sesión</button>
                </div>
            </div>
        </div>
    );
}
