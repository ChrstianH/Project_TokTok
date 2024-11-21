import { NavLink } from "react-router-dom";

import homeIcon from "/icons/home.svg";
import searchIcon from "/icons/search.svg";
import uploadIcon from "/icons/upload.svg";
import profileIcon from "/icons/profile.svg";

export default function NavBar() {
  const userId = localStorage.getItem("userId");

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
    </nav>
  );
}
