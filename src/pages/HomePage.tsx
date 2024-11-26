import { getStorageURL, supabase } from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router-dom";

import HashtagText from "../components/HashtagText";
import PostInteraction from "../components/PostInteraction";

import logo from "/Logo.svg";
import { formatDistanceToNow } from "date-fns";

interface PostWithProfile {
  id: string;
  img_url: string | null;
  text: string;
  user_id: string;
  created_at: string;
  profiles: {
    id: string;
    user_name: string;
    img_url: string | null;
    occupation: string | null;
  };
}

export default function HomePage() {
  const navigate = useNavigate();

  const postsWithProfilesQuery = useQuery({
    queryKey: ["postsWithProfiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id, 
          img_url, 
          text, 
          user_id, 
          created_at,
          profiles (
            id,
            user_name, 
            img_url,
            occupation
          )
        `
        )
        .order("created_at", { ascending: false });
      if (error) {
        throw error;
      }
      return data;
    },
  });

  if (postsWithProfilesQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (postsWithProfilesQuery.isError) {
    return (
      <div>Error loading posts: {postsWithProfilesQuery.error.message}</div>
    );
  }

  const postsWithProfiles = postsWithProfilesQuery.data as PostWithProfile[];

  return (
    <div className="main-container">
      <div className="home-header">
        <div>
          <NavLink to={"/home"}>
            <img src={logo} alt="toktok_logo" />
          </NavLink>
        </div>
        <h1>TokTok</h1>
      </div>
      {postsWithProfiles.map((post: PostWithProfile) => (
        <div key={post.id}>
          <div
            className="post-header"
            onClick={() => {
              navigate(`/other-profile/${post.profiles.id}`);
            }}
          >
            <img
              src={getStorageURL(post.profiles.img_url!) || ""}
              alt={post.profiles.user_name}
              className="avatar"
            />
            <div>
              <h6 className="user-name">{post.profiles.user_name}</h6>
              <p className="user-occ">{post.profiles.occupation}</p>
            </div>
          </div>
          <div className="post-container">
            <img
              src={getStorageURL(post.img_url!) || ""}
              className="post-img"
            />
            <HashtagText text={post.text} />
            <p className="comment-time">
              {formatDistanceToNow(new Date(post.created_at))} ago
            </p>
            <PostInteraction postId={post.id} />

            <hr />
          </div>
        </div>
      ))}
    </div>
  );
}
