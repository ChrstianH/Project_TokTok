import { useEffect, useState } from "react";
import { getStorageURL, supabase } from "../lib/supabase";
import { useUserContext } from "../context/userContext";
import { NavLink, useNavigate } from "react-router-dom";

import logo from "/Logo.svg";
import addIcon from "/icons/plus_icon.svg";
import editIcon from "/icons/edit_icon.svg";
import placeholderImg from "/placeholder-profileImg.png";
import FollowerInfo from "../components/FollowerInfo";
import ShowPosts from "../components/ShowPosts";

interface Profile {
  id: string;
  img_url: string | null;
  name: string | null;
  user_name: string | null;
  birthday: string | null;
  occupation: string | null;
  slogan: string | null;
  created_at: string;
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

    if (user) {
      fetchProfile();
    }
  }, [user]);

  return (
    <div className="main-container">
      <div className="profile-header">
        <div>
          <NavLink to={"/home"}>
            <img src={logo} alt="toktok_logo" />
          </NavLink>
          <h2>{profile?.user_name}</h2>
        </div>
        <div className="profile-icons">
          <NavLink to={`/${user?.id}/new-post`}>
            <img src={addIcon} alt="add_post" />
          </NavLink>
          <NavLink to={`/${user?.id}/edit-profile`}>
            <img src={editIcon} alt="edit_profile" />
          </NavLink>
        </div>
      </div>
      <div className="profile-container">
        <div>
          <div className="image-container">
            <img
              src={imageUrl || placeholderImg}
              alt={profile?.user_name || "userimg"}
              className="profile-picture"
            />
          </div>
          <div className="profile-details">
            <h2>{profile?.name}</h2>
            <h4>{profile?.occupation}</h4>
            <p>{profile?.slogan}</p>
            <a href={profile?.website || "www.yourdomain.com"}>
              {profile?.website}
            </a>
          </div>
        </div>
        <div className="follower-container">
          {user && <FollowerInfo userId={user?.id} />}
        </div>
      </div>
      <div className="user-posts">{user && <ShowPosts userId={user.id} />}</div>
    </div>
  );
}
