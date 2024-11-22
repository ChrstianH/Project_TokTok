import { useEffect, useState } from "react";
import { getStorageURL, supabase } from "../lib/supabase";
import { useUserContext } from "../context/userContext";
import { NavLink, useNavigate } from "react-router-dom";

import logo from "/Logo.svg";
import addIcon from "/icons/plus_icon.svg";
import editIcon from "/icons/edit_icon.svg";
import moreIcon from "/icons/more_icon.svg";
import placeholderImg from "/placeholder-profileImg.png";

import { Tables } from "../types/supabase-types";

interface Follower {
  profile_id: string;
  user_id: string;
}
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
  follower: Follower[];
  following: Follower[];
}

export default function ProfilePage() {
  const { user, setUser } = useUserContext();
  const [profile, setProfile] = useState<Profile>();
  const [following, setFollowing] = useState<Tables<"follower">[]>();
  const imageUrl = profile?.img_url ? getStorageURL(profile.img_url) : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select(`*, follower:follower_profile_id_fkey(*)`)
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error loading user profile:", error);
        } else {
          setProfile(data);
        }
      }
    };

    const fetchFollowing = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("follower")
          .select("*")
          .eq("user_id", user.id);
        if (error) {
          console.error("Error loading user profile:", error);
        } else {
          setFollowing(data);
        }
      }
    };

    fetchProfile();
    fetchFollowing();
  }, [user]);

  useEffect(() => {
    console.log("*******");
    console.log(profile);
  }, [profile]);

  console.log(user);
  console.log(imageUrl);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(undefined);
      navigate("/login");
      setUser(null);
    } catch (error) {
      console.error("Fehler beim Logout:", error);
    }
  };

  const handleFollowersClick = () => {
    navigate(`/${user?.id}/profile/followers`, {
      state: { followers: profile?.follower },
    });
  };

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
          <button onClick={handleLogout} className="logoutBtn">
            <img src={moreIcon} alt="settings" />
          </button>
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
          <div className="follower-container-info">
            <p>0</p>
            <p>Posts</p>
          </div>

          <span className="follower-container-span"></span>

          <div
            className="follower-container-info"
            onClick={handleFollowersClick}
          >
            <p>{profile?.follower.length}</p>
            <p>Followers</p>
          </div>
          <span className="follower-container-span"></span>
          <div className="follower-container-info">
            <p>{following ? following.length : 0}</p>
            <p>Following</p>
          </div>
        </div>
      </div>
      <div className="user-posts">{/* <UserPosts/> */}</div>
    </div>
  );
}
