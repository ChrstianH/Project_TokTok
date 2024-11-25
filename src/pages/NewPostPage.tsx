import { useState, useRef } from "react";
import { useUserContext } from "../context/userContext";
import { getStorageURL, supabase } from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router-dom";

import arrowLeft from "/icons/arrow_left.svg";
import BackButton from "../components/BackButton";

interface Profile {
  img_url: string | null | undefined;
  user_name: string | null | undefined;
}

export default function NewPostPage() {
  const { user } = useUserContext();
  const navigate = useNavigate();

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("none");

  const filters = [
    { name: "Original", value: "none" },
    { name: "Vintage", value: "sepia(60%) contrast(0.8)" },
    { name: "Blue Skies", value: "hue-rotate(200deg) brightness(1.2)" },
    { name: "B&W", value: "grayscale(100%)" },
    { name: "Sweet", value: "brightness(1.2) saturate(1.5)" },
  ];

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = "";
    e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
  };

  const handleFileChange = () => {
    const file = fileRef.current?.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setOriginalUrl(objectUrl);
      setPreviewUrl(objectUrl);

      const img = new Image();
      img.src = objectUrl;

      img.onload = () => {
        drawImageWithFilter(img, selectedFilter);
      };
    }
  };

  const drawImageWithFilter = (img: HTMLImageElement, filter: string) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = filter;
        ctx.drawImage(img, 0, 0);
        const filteredImageUrl = canvas.toDataURL();
        setPreviewUrl(filteredImageUrl);
      }
    }
  };

  const handleFilterSelect = (filterValue: string) => {
    setSelectedFilter(filterValue);

    if (originalUrl) {
      const img = new Image();
      img.src = originalUrl;
      img.onload = () => {
        drawImageWithFilter(img, filterValue);
      };
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    // const file = fileRef.current?.files?.[0] || null;
    if (!user) {
      return;
    }

    let filteredImagePath: string | null = null;
    if (canvasRef.current) {
      const filteredImageDataUrl = canvasRef.current.toDataURL();
      const blob = await (await fetch(filteredImageDataUrl)).blob();
      const uploadResult = await supabase.storage
        .from("post_img")
        .upload(`${user.id}/${crypto.randomUUID()}`, blob, { upsert: true });
      filteredImagePath = uploadResult.data?.path || null;
      if (uploadResult.error) {
        throw uploadResult.error;
      }
      filteredImagePath = `post_img/${uploadResult.data?.path || null}`;
    }

    const { data, error } = await supabase.from("posts").insert({
      img_url: filteredImagePath,
      text: postTextRef.current?.value || "",
      user_id: user.id,
    });
    if (error) {
      throw error; // Hata varsa yakala
    }

    console.log("Post successfully inserted:", data);
    navigate("/home");
  };

  const imageUrl = profileQuery.data?.img_url
    ? getStorageURL(profileQuery.data.img_url)
    : "";

  return (
    <div className="main-container">
      <div className="profile-header">
        <div>
          <BackButton />
          <h2>New Post</h2>
        </div>
      </div>
      <div className="new-post">
        <img src="" alt="Upload" className="uploadArea" />
        <form onSubmit={handleUpload} className="newPostForm">
          <input
            type="file"
            name=""
            id=""
            onChange={handleFileChange}
            ref={fileRef}
          />
          {originalUrl && (
            <div className="filter-options">
              {filters.map((filter, index) => (
                <div
                  key={index}
                  className={`filter-option ${
                    selectedFilter === filter.value ? "selected" : ""
                  }`}
                  onClick={() => handleFilterSelect(filter.value)}
                >
                  <img
                    src={originalUrl}
                    alt={filter.name}
                    style={{
                      filter: filter.value,
                      width: "50px",
                      height: "50px",
                    }}
                  />
                  <p>{filter.name}</p>
                </div>
              ))}
            </div>
          )}
          <div>
            <img src={imageUrl!} alt={profile.user_name!} className="avatar" />
            <textarea
              className="text-f"
              placeholder="Write a caption..."
              ref={postTextRef}
              onInput={handleInput}
            ></textarea>
            <div>
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
              <img
                src={previewUrl ?? imageUrl!}
                alt={profile.user_name!}
                className="preview"
              />
            </div>
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
