import { NavLink } from "react-router";

export default function Menu(){
    return (<nav>
      <NavLink to="/" className="mr-4">
        Home
      </NavLink>
      <NavLink to="/login" className="mr-4">
        Login
      </NavLink>
      <NavLink to="/register" className="mr-4">
      Register
      </NavLink>
      <NavLink to="/signout" className="mr-4">
      Sign out
      </NavLink>
    </nav>);
}