import { useEffect, useState } from "react";
import { getStorageURL, supabase } from "../lib/supabase";
import { useUserContext } from "../context/userContext";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import logo from "/Logo.svg";
import addIcon from "/icons/plus_icon.svg";
import editIcon from "/icons/edit_icon.svg";
import moreIcon from "/icons/more_icon.svg";
import placeholderImg from "/placeholder-profileImg.png";
import { useQuery } from "@tanstack/react-query";

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

export default function OtherProfilePage() {
  const { user, setUser } = useUserContext();
  const [profile, setProfile] = useState<Profile>();
  const { profileID } = useParams();

  const imageUrl = profile?.img_url ? getStorageURL(profile.img_url) : null;

  useEffect(() => {
    const fetchProfile = async () => {
      if (profileID) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", profileID)
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

  const postCountQuery = useQuery({
    queryKey: [],
    queryFn: async () => {
      if (profileID) {
        console.log("entered query 1");
        const posts = await supabase
          .from("posts")
          .select("id", { count: "exact" })
          .eq("user_id", profileID)
          .limit(1);

        console.log(posts);
        return posts;
      }
    },
  });

  const followingCountQuery = useQuery({
    queryKey: [],
    queryFn: async () => {
      if (profileID) {
        console.log("entered query 2");
        const following = await supabase
          .from("follower")
          .select("id", { count: "exact" })
          .eq("user_id", profileID)
          .limit(1);
        console.log(following);
        return following;
      }
    },
  });

  const followerCountQuery = useQuery({
    queryKey: [],
    queryFn: async () => {
      if (profileID) {
        console.log("entered query 3");
        const follower = await supabase
          .from("follower")
          .select("id", { count: "exact" })
          .eq("profile_id", profileID)
          .limit(1);
        console.log(follower);
        return follower;
      }
    },
  });

  console.log(user);
  console.log(imageUrl);

  const navigate = useNavigate();

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
        <div className="other-follower-container">
          <div className="other-follower-headlines">
            <p>{postCountQuery.data?.count}</p>
            <p>{followerCountQuery.data?.count}</p>
            <p>{followingCountQuery.data?.count}</p>
          </div>
          <div className="other-follower-headlines">
            <p>Posts</p>
            <p>Followers</p>
            <p>Following</p>
          </div>
        </div>
        <button className="follow-btn">Follow</button>
      </div>
      <div className="user-posts">{/* <UserPosts/> */}</div>
    </div>
  );
}
