import { useRef } from "react";
import { useUserContext } from "../context/userContext";
import { getStorageURL, supabase } from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";

interface Profile {
  id?: string;
  img_url: string | null | undefined;
  name: string | null | undefined;
  user_name: string | null | undefined;
  birthday: string | null | undefined;
  occupation: string | null | undefined;
  slogan: string | null | undefined;
  created_at?: string;
  phone: string | null | undefined;
  gender: string | null | undefined;
  website: string | null | undefined;
}

export default function NewPostPage() {
  const { user } = useUserContext();

  let profile: Profile | null = {
    id: "",
    img_url: null,
    name: null,
    user_name: null,
    birthday: null,
    occupation: null,
    slogan: null,
    phone: null,
    gender: null,
    website: null,
    created_at: "",
  };

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

  const fileRef = useRef<HTMLInputElement>(null);
  const postTextRef = useRef<HTMLTextAreaElement>(null);

  let imagePath: string | null = null;

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = "";
    e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
  };

  const file = fileRef.current?.files?.[0] || null;
  const handleUpload = async (e: React.FormEvent) => {
    if (!user) {
      return;
    }

    e.preventDefault();
    if (file) {
      const uploadResult = await supabase.storage
        .from("post_img")
        .upload(`${user.id}/${crypto.randomUUID()}`, file, { upsert: true });
      imagePath = uploadResult.data?.fullPath || null;
    }

    await supabase.from("posts").insert({
      img_url: imagePath,
      text: postTextRef.current?.value || "",
      user_id: user.id,
    });
  };

  const imageUrl = profileQuery.data?.img_url
    ? getStorageURL(profileQuery.data.img_url)
    : "";
  return (
    <div className="new-post">
      <h1>New Post</h1>
      <img src="" alt="Upload" className="uploadArea" />
      <form onSubmit={handleUpload} className="newPostForm">
        <input type="file" name="" id="" ref={fileRef} />
        <div>
          <img src={imageUrl!} alt={profile.name!} className="avatar" />
          <textarea
            className="text-f"
            placeholder="Write a caption..."
            ref={postTextRef}
            onInput={handleInput}
          ></textarea>
          <img src={imageUrl!} alt={profile.name!} className="preview" />
        </div>
        <button>Upload</button>
      </form>
      <p className="location new-post-form">Add Location</p>
      <div className="also-post new-post-form">
        <p>Also post to</p>
        <div>
          <p>Facebook</p>
        </div>
        <div>
          <p>X (Twitter)</p>
        </div>
        <div>
          <p>Tumblr</p>
        </div>
      </div>
    </div>
  );
}
