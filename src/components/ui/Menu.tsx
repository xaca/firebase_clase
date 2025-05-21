import { useEffect,useState } from "react";
import { initializeApp } from "firebase/app"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { NavLink, useNavigate } from "react-router";
import { firebaseConfig } from "../../lib/xaca/utils/config";
import readUser from "../../lib/xaca/data/read_user";
import Profile from "../auth/profile";
import { UserInfo } from "../../types/user_info";
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from "@/store";
import 'animate.css';

export default function Menu(){
    const [userInfo,setUserInfo] = useState<UserInfo | null>(null);
    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const [isProfileOpen,setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const {products} = useCartStore();

    useEffect(() => {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
          setIsLoggedIn(user !== null);          
          if(user !== null){
            const userData = await readUser(user.uid);
            setUserInfo(userData as UserInfo);
          }
      });
      
      return () =>{
        unsubscribe();
      }  // Cleanup subscription on unmount
    }, []);  

    useEffect(() => {
      console.log(products);
    }, [products]);
    
    const handleProfileClick = () => {
      const profile = document.getElementById("profile");
      profile?.classList.remove("hidden");

      if(isProfileOpen)
      {
        profile?.classList.remove("animate__fadeInDown");
        profile?.classList.add("animate__fadeOutUp");
      }
      else{
        profile?.classList.remove("animate__fadeOutUp");
        profile?.classList.add("animate__fadeInDown");
      }
      setIsProfileOpen(!isProfileOpen);
    };

    const abrirCarrito = () => {
      navigate("/shoping_cart");
    }

    const calcularTotal = () => {
      return products.reduce((acc, product) => acc + product.quantity, 0);
    }

    return (<>
      {userInfo && <Profile userInfo={userInfo} onClose={() => setIsProfileOpen(false)}  />}
      <nav className="flex justify-between h-[30px] mt-2 sticky top-0 bg-white z-100">
        <div>
          <NavLink to="/" className="ml-4 mr-4">
            Home
          </NavLink>
          <NavLink to="/gallery" className="ml-4 mr-4">
            Galería
          </NavLink>
          {isLoggedIn && <NavLink to="/edit_profile" className="ml-4 mr-4">
            Editar Perfil
          </NavLink>}
          {(isLoggedIn && userInfo?.role === "admin") && (
            <NavLink to="/dashboard" className="ml-4 mr-4">
              Dashboard
            </NavLink>
          )}
          {!isLoggedIn && (
            <NavLink to="/login" className="mr-4">
              Login
            </NavLink>
          )}
          {!isLoggedIn && (
            <NavLink to="/register" className="mr-4">
              Register
            </NavLink>
          )}          
        </div>
        <div className="flex items-center gap-2">
          <button className="relative mr-4 cursor-pointer" onClick={abrirCarrito}>
            <ShoppingCart />
            <span className="absolute top-1 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{calcularTotal()}</span>
          </button>
       
        {isLoggedIn && (
            <button className="mr-4 cursor-pointer" onClick={handleProfileClick}>Profile</button>
          )}
        </div>
      </nav>
      </>
    );
}