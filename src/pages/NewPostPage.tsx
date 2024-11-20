import { useRef } from "react";
import { useUserContext } from "../context/userContext";
import { getStorageURL, supabase } from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";

interface Post {
  img_url: string | null;
  text: string;
  user_id: string;
}

export default function NewPostPage() {
  const { user } = useUserContext();

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

  return (
    <div>
      <h1>New Post</h1>
      <img src="" alt="Upload" className="uploadArea" />
      <form onSubmit={handleUpload}>
        <input type="file" name="" id="" ref={fileRef} />
        <button>Upload</button>
      </form>
    </div>
  );
}
