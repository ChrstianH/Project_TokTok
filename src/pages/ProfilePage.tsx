import { useEffect, useState } from "react";
import { getStorageURL, supabase } from "../lib/supabase";
import { useUserContext } from "../context/userContext";

import logo from "../../public/Logo.svg";
import addIcon from "../../public/icons/plus_icon.svg";
import editIcon from "../../public/icons/edit_icon.svg";
import moreIcon from "../../public/icons/more_icon.svg";

interface Profile {
  id: string;
  img_url: string | null;
  name: string | null;
  user_name: string | null;
  birthday: string | null;
  occupation: string | null;
  slogan: string | null;
  created_at: string;
  phone: string | null;
  gender: string | null;
  website: string | null;
}

export default function ProfilePage() {
  const { user } = useUserContext();
  const [profile, setProfile] = useState<Profile>();

  const imageUrl = profile?.img_url ? getStorageURL(profile.img_url) : null;

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
          <img src={logo} alt="toktok_logo" />
          <h2>{profile?.user_name}</h2>
        </div>
        <div className="profile-icons">
          <img src={addIcon} alt="add_post" />
          <img src={editIcon} alt="edit_profile" />
          <img src={moreIcon} alt="settings" />
        </div>
      </div>
      <div className="profile-container">
        <div>
          <img src={imageUrl || "https://placehold.co/600x900"} alt="" />
          <h2>{profile?.name}</h2>
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
