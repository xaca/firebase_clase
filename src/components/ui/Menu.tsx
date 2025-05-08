import { useEffect,useState } from "react";
import { initializeApp } from "firebase/app"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { NavLink } from "react-router";
import { firebaseConfig } from "../../libs/utils/config";
import readUser from "../../libs/data/read_user";
import Profile from "../auth/profile";
import 'animate.css';
import { UserInfo } from "../../libs/data/user_info";

export default function Menu(){
    const [userInfo,setUserInfo] = useState<UserInfo | null>(null);
    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const [isProfileOpen,setIsProfileOpen] = useState(false);
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
      
      return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);  

    const handleProfileClick = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    return (<>
      {userInfo && <Profile userInfo={userInfo} className={isProfileOpen ? "block" : "hidden"} onClose={() => setIsProfileOpen(false)}  />}
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