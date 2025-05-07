import { useEffect,useState } from "react";
import { initializeApp } from "firebase/app"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { NavLink } from "react-router";
import { firebaseConfig } from "../../libs/utils/config";
import Profile from "../auth/profile";

export default function Menu(){

    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const [isProfileOpen,setIsProfileOpen] = useState(false);
    useEffect(() => {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
          setIsLoggedIn(user !== null);
      });
      return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);  

    const handleProfileClick = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    return (<>
      <Profile className={isProfileOpen ? "block" : "hidden"} onClose={() => setIsProfileOpen(false)}  />
      <nav className="flex justify-between">
        <div>
          <NavLink to="/" className="mr-4">
            Home
          </NavLink>
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
          {isLoggedIn && (
            <NavLink to="/signout" className="mr-4">
              Sign out
            </NavLink>
          )}
        </div>
        {isLoggedIn && (
          <div>
            <button className="mr-4" onClick={handleProfileClick}>Profile</button>
          </div>
        )}
      </nav>
      </>
    );
}