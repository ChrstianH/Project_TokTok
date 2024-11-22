import { useRef } from "react";
import { useUserContext } from "../context/userContext";
import { getStorageURL, supabase } from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";

import arrowLeft from "/icons/arrow_left.svg";

interface Profile {
  img_url: string | null | undefined;
  user_name: string | null | undefined;
}

export default function NewPostPage() {
  const { user } = useUserContext();

  let profile: Profile | null = {
    img_url: null,
    user_name: null,
  };

  const profileQuery = useQuery({
    queryKey: [],
    queryFn: async () => {
      const result = await supabase
        .from("profiles")
        .select("img_url, user_name")
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0] || null;
    if (!user) {
      return;
    }

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
    <div className="main-container">
      <div className="profile-header">
        <div>
          <NavLink to={"/home"}>
            <img src={arrowLeft} alt="back home button" />
          </NavLink>
          <h2>New Post</h2>
        </div>
      </div>
      <div className="new-post">
        <img src="" alt="Upload" className="uploadArea" />
        <form onSubmit={handleUpload} className="newPostForm">
          <input type="file" name="" id="" ref={fileRef} />
          <div>
            <img src={imageUrl!} alt={profile.user_name!} className="avatar" />
            <textarea
              className="text-f"
              placeholder="Write a caption..."
              ref={postTextRef}
              onInput={handleInput}
            ></textarea>
            <img src={imageUrl!} alt={profile.user_name!} className="preview" />
          </div>
          <button>Upload</button>
        </form>
        <p className="location newPostForm">Add Location</p>
        <div className="also-post newPostForm">
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
    </div>
  );
}
