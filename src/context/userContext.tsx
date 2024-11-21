import { createContext, useContext, useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface User extends SupabaseUser {
  img_url?: string | null;
}

interface UserContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContext>(null!);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: authUser } = await supabase.auth.getUser();
      if (authUser.user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile data:", error);
        } else {
          const userWithProfile: User = {
            ...authUser.user,
            img_url: profile.img_url,
          };
          setUser(userWithProfile);
        }
      }
    };

    fetchUserData();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
