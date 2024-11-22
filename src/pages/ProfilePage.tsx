import { useEffect, useState } from "react";
import { getStorageURL, supabase } from "../lib/supabase";
import { useUserContext } from "../context/userContext";
import { NavLink, useNavigate } from "react-router-dom";

import logo from "../../public/Logo.svg";
import addIcon from "../../public/icons/plus_icon.svg";
import editIcon from "../../public/icons/edit_icon.svg";
import moreIcon from "../../public/icons/more_icon.svg";
import placeholderImg from "/placeholder-profileImg.png";
import FollowerInfo from "../components/FollowerInfo";

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
  follower: { user_id: string }[];
}

export default function ProfilePage() {
  const { user, setUser } = useUserContext();
  const [profile, setProfile] = useState<Profile>();
  const [postCount, setPostCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  1;

  const imageUrl = profile?.img_url ? getStorageURL(profile.img_url) : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select(
            `
            *, 
            follower!follower_profile_id_fkey(
              user_id
            )
          `
          )
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error loading user profile:", error);
        } else {
          setProfile(data);
        }
      }
    };

    const fetchPostCount = async () => {
      if (user) {
        const { count, error } = await supabase
          .from("posts")
          .select("*", { count: "exact" })
          .eq("user_id", user.id);
        if (error) {
          console.error("Error loading post count:", error);
        } else {
          setPostCount(count || 0);
        }
      }
    };

    const fetchFollowerCount = async () => {
      if (user) {
        const { count, error } = await supabase
          .from("follower")
          .select("*", { count: "exact" })
          .eq("profile_id", user.id); // Abfrage für Follower
        if (error) {
          console.error("Error loading follower count:", error);
        } else {
          setFollowerCount(count || 0);
        }
      }
    };

    const fetchFollowingCount = async () => {
      if (user) {
        const { count, error } = await supabase
          .from("follower")
          .select("*", { count: "exact" })
          .eq("user_id", user.id); // Abfrage für Following
        if (error) {
          console.error("Error loading following count:", error);
        } else {
          setFollowingCount(count || 0);
        }
      }
    };

    if (user) {
      fetchProfile();
      fetchPostCount();
      fetchFollowerCount(); // Separate Abfrage für Follower
      fetchFollowingCount(); // Separate Abfrage für Following
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(undefined);
      navigate("/login");
      setUser(null);
    } catch (error) {
      console.error("Error logging out", error);
    }
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
          {profile && (
            <FollowerInfo
              userId={user!.id}
              postCount={postCount}
              followerCount={followerCount}
              followingCount={followingCount}
              followers={profile?.follower}
            />
          )}
        </div>
      </div>
      <div className="user-posts">{/* <UserPosts/> */}</div>
    </div>
  );
}
