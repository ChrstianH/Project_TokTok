import { getStorageURL, supabase } from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";

import HashtagText from "../components/HashtagText";
import PostInteraction from "../components/PostInteraction";
import { hr } from "date-fns/locale";
import { Link } from "react-router-dom";

interface Post {
  id: string;
  img_url: string | null;
  text: string;
  user_id: string;
  created_at: string;
}

interface ShowPostsProps {
  userId: string;
}

const ShowPosts: React.FC<ShowPostsProps> = ({ userId }) => {
  const postsQuery = useQuery({
    queryKey: ["profilePosts", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id, 
          img_url, 
          text, 
          user_id, 
          created_at
        `
        )
        .eq("user_id", userId);

      if (error) {
        throw error;
      }
      return data;
    },
  });

  if (postsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (postsQuery.isError) {
    return <div>Error loading posts: {postsQuery.error.message}</div>;
  }

  const posts = postsQuery.data as Post[];

  return (
    <>
      <hr />
      <div className="show-post-container">
        {posts.map((post: Post) => (
          <div key={post.id}>
            <Link to={`/comments/${post.id}`}>
              <img
                src={getStorageURL(post.img_url!) || ""}
                className={`post-img ${post.img_url ? "post-img-profile" : ""}`}
              />
            </Link>{" "}
          </div>
        ))}
      </div>
    </>
  );
};

export default ShowPosts;
