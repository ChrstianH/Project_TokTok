import { useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type User = {
  name: string;
  occupation: string | null;
  phone: string | null;
  slogan: string | null;
  user_name: string;
  website: string | null;
};

export default function HomePage() {
  const { user, setUser } = useState<User | null>({});
  useEffect(() => {
    getUserData().then((userResult) => setUser(userResult.data));
  }, []);

  const { id } = useContext();

  const getUserData = async () => {
    const result = await supabase.from("profiles").select("*").eq("id", id);
    return result;
  };

  return (
    <div>
      <div>
        <img src="" alt="" className="avatar" />
        <b>{user.name}</b>
        <p>{user.occupation}</p>
      </div>
      <div>
        <button></button>
      </div>
      <img src="" alt="" />
      Likes {user.isLiked}
      Comments {user.comments.length}
    </div>
  );
}
