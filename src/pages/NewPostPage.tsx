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

interface Post {
  img_url: string | null;
  text: string;
  user_id: string;
}

export default function NewPostPage() {
  const { user } = useUserContext();
  console.log(user);

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

  let imagePath: string | null = null;

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
      console.log(imagePath?.toString());
    }

    await supabase.from("posts").insert({
      img_url: imagePath,
      text: "",
      user_id: user.id,
    });
  };

  console.log(profileQuery.data?.img_url);
  const imageUrl = profileQuery.data?.img_url
    ? getStorageURL(profileQuery.data.img_url)
    : "";
  console.log(imageUrl);
  return (
    <div>
      <h1>New Post</h1>
      <img src="" alt="Upload" className="uploadArea" />
      <form onSubmit={handleUpload}>
        <input type="file" name="" id="" ref={fileRef} />
        <img src={imageUrl!} alt={profile.name!} />
        <button>Upload</button>
      </form>
    </div>
  );
}
