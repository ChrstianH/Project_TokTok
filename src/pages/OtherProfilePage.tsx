import { useEffect, useState } from "react";
import { getStorageURL, supabase } from "../lib/supabase";
import { useUserContext } from "../context/userContext";
import { NavLink, useParams } from "react-router-dom";

import logo from "/Logo.svg";
import placeholderImg from "/placeholder-profileImg.png";
import { useQuery } from "@tanstack/react-query";
import ShowPosts from "../components/ShowPosts";
import FollowerButton from "../components/FollowerButton";
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
}

export default function OtherProfilePage() {
  const { user } = useUserContext();
  const [profile, setProfile] = useState<Profile>();
  const { profileID } = useParams();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

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
  }, [profileID]);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (user?.id && profileID) {
        try {
          const { data, error } = await supabase
            .from("follower")
            .select("user_id")
            .eq("user_id", user.id)
            .eq("profile_id", profileID)
            .single();

          if (error) {
            console.error("Error checking following status:", error);
          } else {
            setIsFollowing(!!data);
          }
        } catch (error) {
          console.error("Error checking following status:", error);
        }
      }
    };

    checkFollowingStatus();
  }, [user?.id, profileID]);

  const handleFollowChange = () => {
    setIsFollowing((prevIsFollowing) => !prevIsFollowing);
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
          <div className="follower-container">
            {profile && <FollowerInfo userId={profile.id} />}
          </div>
        </div>
        <FollowerButton
          currentUserId={user?.id}
          followedId={profileID!}
          isFollowing={isFollowing}
          onFollowChange={handleFollowChange}
        />
      </div>
      <div className="user-posts">
        {profileID && <ShowPosts userId={profileID} />}
      </div>
    </div>
  );
}
