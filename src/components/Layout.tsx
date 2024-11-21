import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

import topbar from "/topbar.png";

export default function Layout() {
  return (
    <div className="mobile-container">
      <main>
        <header>
          <img src={topbar} alt="topbar" />
        </header>
        <Outlet />
        <footer>
          <NavBar />
        </footer>
      </main>
    </div>
  );
}
