import { getStorageURL, supabase } from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../context/userContext";

interface PostWithProfile {
  id: string;
  img_url: string | null;
  text: string;
  user_id: string;
  created_at: string;
  profiles: {
    user_name: string;
    img_url: string | null;
  };
}

export default function HomePage() {
  //den userContext brauchen wir dann später wieder wenn wir followen und kommentieren wollen
  const { user } = useUserContext();

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
            img_url
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
      {postsWithProfiles.map((post: PostWithProfile) => (
        <div key={post.id}>
          <div>
            <img
              src={getStorageURL(post.profiles.img_url!) || ""}
              alt={post.profiles.user_name}
              className="avatar"
            />
            <b>{post.profiles.user_name}</b>
            <button>♡</button>
          </div>

          <img
            src={getStorageURL(post.img_url!) || ""}
            // alt={post.text}
            className="homepage-img"
          />
          <p>{post.text}</p>
          <p>Likes: viele</p>
          <p>Comments: nicht ganz so viele</p>
        </div>
      ))}
    </div>
  );
}
