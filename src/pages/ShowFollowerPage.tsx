import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import FollowerButton from "../components/FollowerButton";

import arrowLeft from "/icons/arrow_left.svg";

type UserProfileWithImage = {
  id: string;
  user_name: string | null;
  img_url: string | null;
  occupation: string | null;
  imageUrl: string;
  isFollowing: boolean | null;
};

export default function ShowFollowerPage() {
  const { userId } = useParams();
  const [usersIFollow, setUsersIFollow] = useState<UserProfileWithImage[]>([]);
  const [usersFollowingMe, setUsersFollowingMe] = useState<
    UserProfileWithImage[]
  >([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setCurrentUserId(session.user.id);
      }

      if (userId) {
        fetchUsersIFollow(userId);
        fetchUsersFollowingMe(userId);
      }
    };

    fetchUserData();
  }, [userId, currentUserId]);

  const fetchUsersIFollow = async (userId: string) => {
    const { data, error } = await supabase
      .from("follower")
      .select(
        `
        profile_id,
        profiles!follower_profile_id_fkey(
          id, 
          user_name, 
          img_url, 
          occupation
        )
      `
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching users I follow:", error);
      return;
    }

    const usersWithImage: UserProfileWithImage[] = await Promise.all(
      (data ?? []).map(async (item) => {
        const user = item.profiles;
        if (!user) {
          return {
            imageUrl: "",
            isFollowing: null,
            id: "",
            user_name: null,
            img_url: null,
            occupation: null,
          };
        }

        let filePath = user.img_url || "";
        if (filePath.includes("profile_img/")) {
          filePath = filePath.replace("profile_img/", "");
        }
        const { data: imageData } = supabase.storage
          .from("profile_img")
          .getPublicUrl(filePath);

        let isFollowing = null;

        if (currentUserId) {
          try {
            const { data: followingData } = await supabase
              .from("follower")
              .select("id")
              .eq("user_id", currentUserId)
              .eq("profile_id", user.id)
              .single();

            isFollowing = followingData ? true : false;
          } catch (error) {
            console.error("Error checking following status:", error);
          }
        }

        return {
          ...user,
          imageUrl: imageData?.publicUrl || "",
          isFollowing,
          id: user.id,
          user_name: user.user_name,
          img_url: user.img_url,
          occupation: user.occupation,
        };
      })
    );

    setUsersIFollow(usersWithImage);
  };

  const fetchUsersFollowingMe = async (userId: string) => {
    const { data, error } = await supabase
      .from("follower")
      .select(
        `
        user_id,
        profiles!follower_user_id_fkey1(
          id, 
          user_name, 
          img_url, 
          occupation
        )
      `
      )
      .eq("profile_id", userId);

    if (error) {
      console.error("Error fetching users following me:", error);
      return;
    }

    const usersWithImage: UserProfileWithImage[] = await Promise.all(
      (data ?? []).map(async (item) => {
        const user = item.profiles;
        if (!user) {
          return {
            imageUrl: "",
            isFollowing: null,
            id: "",
            user_name: null,
            img_url: null,
            occupation: null,
          };
        }

        let filePath = user.img_url || "";
        if (filePath.includes("profile_img/")) {
          filePath = filePath.replace("profile_img/", "");
        }
        const { data: imageData } = supabase.storage
          .from("profile_img")
          .getPublicUrl(filePath);

        let isFollowing = null;

        if (currentUserId) {
          try {
            const { data: followingData } = await supabase
              .from("follower")
              .select("id")
              .eq("user_id", currentUserId)
              .eq("profile_id", user.id)
              .single();

            isFollowing = followingData ? true : false;
          } catch (error) {
            console.error("Error checking following status:", error);
          }
        }

        return {
          ...user,
          imageUrl: imageData?.publicUrl || "",
          isFollowing,
          id: user.id,
          user_name: user.user_name,
          img_url: user.img_url,
          occupation: user.occupation,
        };
      })
    );

    setUsersFollowingMe(usersWithImage);
  };

  return (
    <div className="main-container">
      <div className="profile-header">
        <div>
          <NavLink to={`/${userId}/profile`}>
            <img src={arrowLeft} alt="back home button" />
          </NavLink>
          <h2>Follower</h2>
        </div>
      </div>
      <h2>Users I follow</h2>
      <div className="user-list">
        {usersIFollow.map((user) => (
          <div
            key={user.id}
            className="user-card"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="user-info"
              onClick={() => {
                navigate(`/other-profile/${user.id}`);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <img
                src={user.imageUrl}
                alt={user.user_name || "user avatar"}
                className="search-avatar"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <div className="user-details">
                <div style={{ fontSize: "18px" }}>{user.user_name}</div>
                <div style={{ fontSize: "14px" }}>{user.occupation}</div>
              </div>
            </div>
            {user.id && user.id !== currentUserId && (
              <FollowerButton
                currentUserId={currentUserId}
                followedId={user.id}
                isFollowing={user.isFollowing === true}
                onFollowChange={() => fetchUsersIFollow(userId!)}
              />
            )}
          </div>
        ))}
      </div>
      <h2>Users following me</h2>
      <div className="user-list">
        {usersFollowingMe.map((user) => (
          <div
            key={user.id}
            className="user-card"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="user-info"
              onClick={() => {
                navigate(`/other-profile/${user.id}`);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <img
                src={user.imageUrl}
                alt={user.user_name || "user avatar"}
                className="search-avatar"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <div className="user-details">
                <div style={{ fontSize: "18px" }}>{user.user_name}</div>
                <div style={{ fontSize: "14px" }}>{user.occupation}</div>
              </div>
            </div>
            {user.id && user.id !== currentUserId && (
              <FollowerButton
                currentUserId={currentUserId}
                followedId={user.id}
                isFollowing={user.isFollowing === true}
                onFollowChange={() => fetchUsersFollowingMe(userId!)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
