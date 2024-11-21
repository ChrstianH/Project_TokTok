import { getStorageURL, supabase } from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../context/userContext";

interface Post {
  created_at: string;
  id: string;
  img_url: string | null;
  text: string;
  user_id: string;
}

export default function HomePage() {
  const { user } = useUserContext();

  if (!user) {
  }

  const postQuery = useQuery({
    queryKey: [],
    queryFn: async () => {
      const result = await supabase.from("posts").select("*");
      //        .eq("user_id", user?.id!);
      if (result.error) {
        throw result.error;
      }
      return result.data;
    },
  });

  const profileQuery = useQuery({
    queryKey: [],
    queryFn: async () => {
      const result = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id!)
        .single();
      if (result.error) {
        throw result.error;
      }
      return result.data;
    },
  });

  const posts = postQuery.data;
  const profile = profileQuery.data;
  const imageUrl = profile?.img_url ? getStorageURL(profile.img_url) : "";

  return (
    <div>
      {posts &&
        posts.map((post: Post) => (
          <div>
            <div>
              <img src={imageUrl!} alt={profile?.name!} className="avatar" />
              <b>{profile?.user_name}</b>
              <p>{profile?.occupation}</p>
            </div>
            <div>
              <button></button>
            </div>
            <img src={getStorageURL(post.img_url!) || ""} alt={post.text} />
            <p>Likes: viele</p>
            <p>Comments: nicht ganz so viele</p>
          </div>
        ))}
    </div>
  );
}
