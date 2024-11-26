import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Database } from "../types/supabase-types";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import FollowerButton from "../components/FollowerButton";

import searchIcon from "/icons/search.svg";
import userIcon from "/icons/user_icon.svg";

type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];
type UserProfileWithImage = UserProfile & {
  imageUrl: string;
  isFollowing: boolean;
};

export default function SearchPage() {
  // Search Section

  const [searchText, setSearchText] = useState<string>("");
  const [users, setUsers] = useState<UserProfileWithImage[]>([]);
  const navigate = useNavigate();
  // fetch users from the supabase
  const fetchUsers = async (searchText: string = "") => {
    if (!searchText) {
      setUsers([]);
      return;
    }
    if (!currentUserId) {
      setUsers([]);
      return;
    }
    let query = supabase
      .from("profiles")
      .select(
        `*,
    follower:follower_profile_id_fkey(user_id)`
      )
      .neq("id", currentUserId);
    if (searchText) {
      query = query.ilike("user_name", `%${searchText}%`);
    }
    query = query.order("created_at", { ascending: false });
    const { data, error } = await query;
    if (error) {
      console.error("error", error);
    }
    if (data) {
      const usersWithImage: UserProfileWithImage[] = data.map((user) => {
        let filePath = user.img_url || "";
        if (filePath.startsWith("profile_img/")) {
          filePath = filePath.replace("profile_img/", "");
        }
        const { data: imageData } = supabase.storage
          .from("profile_img")
          .getPublicUrl(filePath);

        const isFollowing = user.follower.some(
          (follow: any) => follow.user_id === currentUserId
        );

        return {
          ...user,
          imageUrl: imageData?.publicUrl || "",
          isFollowing,
        };
      });
      setUsers(usersWithImage);
    }
  };

  useEffect(() => {
    fetchUsers(searchText);
  }, [searchText]);

  // fetch Session Section

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getCurrentSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      setSession(session);
    };

    getCurrentSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const currentUserId = session?.user?.id;

  return (
    <div className="main-container">
      <div className="search-bar">
        <div className="search-input-container">
          <img src={searchIcon} alt="Search Icon" className="search-icon" />
          <input
            className="search-input"
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <div className="user-list">
        <img src={userIcon} alt="user-list-icon" className="user-icon" />
        <hr className="search-hr" />
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div
              className="user-info"
              onClick={() => {
                navigate(`/other-profile/${user.id}`);
              }}
            >
              <img
                src={user.imageUrl || "https://via.placeholder.com/50"}
                alt={user.user_name || "user avatar"}
                className="search-avatar"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://via.placeholder.com/50";
                }}
              />

              <div className="user-details">
                <h6 className="user-name">{user.user_name}</h6>
                <p className="user-occ">{user.occupation}</p>
              </div>
            </div>
            {user.id !== currentUserId && (
              <FollowerButton
                currentUserId={currentUserId}
                followedId={user.id}
                isFollowing={user.isFollowing}
                onFollowChange={() => fetchUsers(searchText)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
