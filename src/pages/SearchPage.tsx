import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Database } from "../types/supabase-types";
import searchIcon from "../assets/Search.svg";
import { Session } from "@supabase/supabase-js";

type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];
type UserProfileWithImage = UserProfile & {
  imageUrl: string;
  isFollowing: boolean;
};

export default function SearchPage() {
  // Search Section

  const [searchText, setSearchText] = useState<string>("");
  const [users, setUsers] = useState<UserProfileWithImage[]>([]);

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

  // follow Section
  const handleFollow = async (followedId: string) => {
    if (!currentUserId) return;

    const { data, error } = await supabase
      .from("follower")
      .insert([{ user_id: currentUserId, profile_id: followedId }]);

    if (error) {
      console.error("Error while following:", error);
    } else {
      console.log("Following 1");
      fetchUsers(searchText);
      console.log("Following 2");
    }
  };

  //unfollow Section
  const handleUnfollow = async (followedId: string) => {
    if (!currentUserId) return;

    const { data, error } = await supabase
      .from("follower")
      .delete()
      .match({ user_id: currentUserId, profile_id: followedId });

    if (error) {
      console.error("Error exiting the follow up:", error);
    } else {
      console.log("Dropped from follow-up 1");
      fetchUsers(searchText);
      console.log("Dropped from follow-up 2");
    }
  };

  return (
    <div className="search-page" style={{ padding: "20px" }}>
      {/* <div>
        <h1>Current User ID: {currentUserId || "Not logged in"}</h1>
      </div> */}
      <div
        className="search-bar"
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <div
          className="search-input-container"
          style={{ position: "relative", width: "90%" }}
        >
          <img
            src={searchIcon}
            alt="Search Icon"
            className="search-icon"
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            className="search-input"
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: "100%",
              padding: "20px 20px 20px 40px",
              border: "1px solid #ccc",
              borderRadius: "20px",
              fontSize: "16px",
              outline: "none",
            }}
          />
        </div>
      </div>
      <div
        className="user-list"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        {users.map((user) => (
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
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <img
                src={user.imageUrl || "https://via.placeholder.com/50"}
                alt={user.user_name || "user avatar"}
                className="search-avatar"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://via.placeholder.com/50";
                }}
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
            {user.id !== currentUserId && (
              <button
                onClick={() =>
                  user.isFollowing
                    ? handleUnfollow(user.id)
                    : handleFollow(user.id)
                }
                style={{
                  padding: "8px 20px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  backgroundColor: user.isFollowing ? "#ccc" : "#FF4D67",
                  color: user.isFollowing ? "#000" : "#fff",
                  transition: "all 0.3s",
                  border: "none",
                }}
              >
                {user.isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
