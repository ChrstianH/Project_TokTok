import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Database } from "../types/supabase-types";

type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];
type UserProfileWithImage = UserProfile & { imageUrl: string };

export default function SearchPage() {
  // const users = [
  //   {
  //     username: "angelinaa_",
  //     role: "Web Designer",
  //     image: "/placeholder.svg?height=40&width=40",
  //     following: false,
  //   },
  //   {
  //     username: "angelina_tamara",
  //     role: "President of Sales",
  //     image: "/placeholder.svg?height=40&width=40",
  //     following: true,
  //   },
  //   {
  //     username: "angelina_77",
  //     role: "Web Designer",
  //     image: "/placeholder.svg?height=40&width=40",
  //     following: false,
  //   },
  //   {
  //     username: "angelina_angie",
  //     role: "Nursing Assistant",
  //     image: "/placeholder.svg?height=40&width=40",
  //     following: true,
  //   },
  //   {
  //     username: "angelina_hawky",
  //     role: "Dog Trainer",
  //     image: "/placeholder.svg?height=40&width=40",
  //     following: false,
  //   },
  //   {
  //     username: "angelina_cooper",
  //     role: "Medical Assistant",
  //     image: "/placeholder.svg?height=40&width=40",
  //     following: false,
  //   },
  //   {
  //     username: "angelina_nguyen",
  //     role: "Marketing Coordinator",
  //     image: "/placeholder.svg?height=40&width=40",
  //     following: false,
  //   },
  //   {
  //     username: "angelina_lane",
  //     role: "Software Engineer",
  //     image: "/placeholder.svg?height=40&width=40",
  //     following: false,
  //   },
  // ];
  const [searchText, setSearchText] = useState<string>("");
  const [user, setUser] = useState<UserProfile[]>([]);

  // fetch users from the supabase
  const fetchUsers = async (searchText: string = "") => {
    let query = supabase.from("profiles").select("*");
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

        return {
          ...user,
          imageUrl: imageData?.publicUrl || "",
        };
      });
      setUser(usersWithImage);
    }
  };

  useEffect(() => {
    fetchUsers(searchText);
  }, [searchText]);

  return (
    <div className="search-page" style={{ padding: "20px" }}>
      <div
        className="search-bar"
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: "90%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "20px",
            fontSize: "16px",
            outline: "none",
          }}
        />
      </div>
      <div
        className="user-list"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        {user.map((user, index) => (
          <div
            key={index}
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
                alt={user.user_name}
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
            <button
              style={{
                padding: "8px 20px",
                borderRadius: "20px",
                fontSize: "14px",
                backgroundColor: "#FF4D67",
                color: "white",
                transition: "all 0.3s",
                border: "none",
              }}
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
