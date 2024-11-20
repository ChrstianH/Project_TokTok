import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUserContext } from "../context/userContext";

interface Profile {
  id: string;
  img_url: string | null;
  name: string;
  user_name: string;
  birthday: string;
  occupation: string | null;
  slogan: string | null;
  created_at: string;
  email: string;
  phone: string | null;
  gender: string;
  website: string | null;
}

export default function ProfilePage() {
  const { user } = useUserContext();
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error loading user profile:", error);
        } else {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, [user]);

  console.log(user);

  return (
    <div>
      <div className="profile-header">
        <div>
          <img src="" alt="toktok_logo" />
          <h2>{profile?.user_name}</h2>
        </div>
        <div>
          <img src="" alt="add_post" />
          <img src="" alt="edit_profile" />
          <img src="" alt="settings" />
        </div>
      </div>
      <div className="profile-container">
        <div>
          {/* <img src={profile?.img_url} alt={profile?.user_name} /> */}
          <h2>{profile?.user_name}</h2>
          <h4>{profile?.occupation}</h4>
          <p>{profile?.slogan}</p>
          {/* <a href={profile?.website}>{profile?.website}</a> */}
        </div>
        <div className="follower-container">
          <p>Posts</p>
          <p>Followers</p>
          <p>Following</p>
        </div>
      </div>
      <div className="user-posts">{/* <UserPosts/> */}</div>
    </div>
  );
}
