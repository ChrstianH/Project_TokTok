import { getStorageURL, supabase } from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";

import HashtagText from "../components/HashtagText";
import PostInteraction from "../components/PostInteraction"; // Importierte Komponente

import logo from "/Logo.svg";

interface PostWithProfile {
  id: string;
  img_url: string | null;
  text: string;
  user_id: string;
  created_at: string;
  profiles: {
    user_name: string;
    img_url: string | null;
    occupation: string | null;
  };
}

export default function HomePage() {
  const postsWithProfilesQuery = useQuery({
    queryKey: ["postsWithProfiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select(`
          id, 
          img_url, 
          text, 
          user_id, 
          created_at,
          profiles (
            user_name, 
            img_url,
            occupation
          )
        `);
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
          <div className="post-header">
            <img
              src={getStorageURL(post.profiles.img_url!) || ""}
              alt={post.profiles.user_name}
              className="avatar"
            />
            <div>
              <b>{post.profiles.user_name}</b>
              <p>{post.profiles.occupation}</p>
            </div>
          </div>
          <div className="post-container">
            <img
              src={getStorageURL(post.img_url!) || ""}
              className="post-img"
            />
            <HashtagText text={post.text} />

            <PostInteraction postId={post.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
