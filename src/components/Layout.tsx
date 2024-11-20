import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="mobile-container">
      <main>
        <Outlet />
      </main>
    </div>
  );
}
