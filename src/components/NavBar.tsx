import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import homeIcon from "/icons/home.svg";
import searchIcon from "/icons/search.svg";
import uploadIcon from "/icons/upload.svg";
import profileIcon from "/icons/profile.svg";
import logoutIcon from "/icons/logout.svg";
import { useEffect } from "react";

export default function NavBar() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/logout") {
      handleLogout();
    }
  }, [location]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();

      localStorage.removeItem("userId");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <nav>
      <div>
        <NavLink to={"/home"}>
          <img src={homeIcon} alt="homeIcon" />
          <p>Home</p>
        </NavLink>
      </div>
      <div>
        <NavLink to={"/search"}>
          <img src={searchIcon} alt="SearchIcon" />
          <p>Search</p>
        </NavLink>
      </div>
      <div>
        <NavLink to={userId ? `/${userId}/new-post` : "/"}>
          <img src={uploadIcon} alt="uploadIcon" />
          <p>Upload</p>
        </NavLink>
      </div>
      <div>
        <NavLink to={userId ? `/${userId}/profile` : "/"}>
          <img src={profileIcon} alt="profileIcon" />
          <p>Profile</p>
        </NavLink>
      </div>
      <div>
        <NavLink to="/logout">
          <img src={logoutIcon} alt="logout" className="logout-svg" />
          <p>Logout</p>
        </NavLink>
      </div>
    </nav>
  );
}
