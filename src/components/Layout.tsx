import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

import topbar from "/topbar.png";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

export default function Layout() {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setShowFooter(!!data.session);
    };

    checkUser();
    const authListener = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        checkUser();
      }
    });

    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="mobile-container">
      <main>
        {/* <header>
          <img src={topbar} alt="topbar" />
        </header> */}
        <Outlet />
        {showFooter && (
          <footer>
            <NavBar />
          </footer>
        )}
      </main>
    </div>
  );
}
