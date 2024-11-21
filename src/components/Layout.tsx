import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout() {
  return (
    <div className="mobile-container">
      <main>
        <Outlet />
        <footer>
          <NavBar />
        </footer>
      </main>
    </div>
  );
}
