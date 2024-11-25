import { useRef, useState, useEffect } from "react";
import { useUserContext } from "../context/userContext";
import { getStorageURL, supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

import editIcon from "/icons/editImg.svg";
import placeholderImg from "/placeholder-profileImg.png";
import BackButton from "../components/BackButton";

export default function EditProfilePage() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const userNameInputRef = useRef<HTMLInputElement>(null);
  const occupationInputRef = useRef<HTMLInputElement>(null);
  const bioInputRef = useRef<HTMLInputElement>(null);
  const birthdayInputRef = useRef<HTMLInputElement>(null);
  const websiteInputRef = useRef<HTMLInputElement>(null);
  const genderInputRef = useRef<HTMLSelectElement>(null);

  const { user } = useUserContext();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<{
    birthday?: string;
    gender?: string;
    user_name?: string;
    name?: string;
  }>({});

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("birthday, gender, user_name, name")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile data:", error);
        } else {
          const convertedData = {
            birthday: data.birthday || undefined,
            gender: data.gender || undefined,
            user_name: data.user_name || undefined,
            name: data.name || undefined,
          };
          setProfileData(convertedData);
        }
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    if (!user) {
      return;
    }
    e.preventDefault();

    const updates: {
      name?: string;
      user_name?: string;
      img_url?: string | null;
      occupation?: string;
      slogan?: string;
      birthday?: string;
      website?: string;
      gender?: string;
    } = {};

    const file = imageInputRef.current?.files?.[0];
    if (file) {
      const uploadResult = await supabase.storage
        .from("profile_img")
        .upload(`${user.id}/${crypto.randomUUID()}`, file, { upsert: true });
      updates.img_url = uploadResult.data?.fullPath || null;
    }

    if (nameInputRef.current!.value) {
      updates.name = nameInputRef.current!.value;
    }
    if (userNameInputRef.current!.value) {
      updates.user_name = userNameInputRef.current!.value;
    }
    if (occupationInputRef.current!.value) {
      updates.occupation = occupationInputRef.current!.value;
    }
    if (bioInputRef.current!.value) {
      updates.slogan = bioInputRef.current!.value;
    }
    if (birthdayInputRef.current!.value) {
      updates.birthday = birthdayInputRef.current!.value;
    }
    if (websiteInputRef.current!.value) {
      updates.website = websiteInputRef.current!.value;
    }
    if (genderInputRef.current!.value) {
      updates.gender = genderInputRef.current!.value;
    }

    if (Object.keys(updates).length > 0) {
      await supabase.from("profiles").update(updates).eq("id", user.id);
    }

    navigate(`/${user.id}/profile`);
  };

  return (
    <div>
      <div className="profile-header">
        <div>
          <BackButton />
          <h2>Edit Profile</h2>
        </div>
      </div>
      <div className="details-container">
        {isLoading ? (
          <p>Loading profile data...</p>
        ) : (
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="profile-picture-container">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profilbild Vorschau"
                  className="profile-picture"
                />
              ) : (
                <div className="placeholder-picture">
                  {user?.img_url ? (
                    <img
                      src={
                        user?.img_url ? getStorageURL(user.img_url) ?? "" : ""
                      }
                      alt="profile-picture"
                      className="profile-picture"
                    />
                  ) : (
                    <img src={placeholderImg} alt="" />
                  )}
                </div>
              )}
              <label htmlFor="profile-picture-upload" className="upload-button">
                <img src={editIcon} alt="" />
              </label>
              <input
                ref={imageInputRef}
                type="file"
                name="image"
                placeholder="upload image"
                id="profile-picture-upload"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <input
              ref={nameInputRef}
              type="text"
              name="name"
              placeholder="your name"
              defaultValue={profileData.name || ""}
              disabled={!!profileData.name}
            />
            <input
              ref={userNameInputRef}
              type="text"
              name="userName"
              placeholder="your user name"
              defaultValue={profileData.user_name || ""}
              disabled={!!profileData.user_name}
            />
            <input
              ref={occupationInputRef}
              type="text"
              name="occupation"
              placeholder="your jobtitle"
            />
            <input
              ref={bioInputRef}
              type="text"
              name="bio"
              placeholder="tell us sth about yourself"
            />
            <input
              ref={birthdayInputRef}
              type="date"
              name="birthday"
              id="birthday"
              placeholder="your birthdate"
              defaultValue={profileData.birthday || ""}
              disabled={!!profileData.birthday}
            />
            <select
              ref={genderInputRef}
              name="gender"
              id="gender"
              defaultValue={profileData.gender || ""}
              disabled={!!profileData.gender}
            >
              <option value="male">male</option>
              <option value="female">female</option>
              <option value="divers">divers</option>
            </select>
            <input
              ref={websiteInputRef}
              type="text"
              name="website"
              placeholder="your website"
            />
            <button>Update</button>
          </form>
        )}
      </div>
    </div>
  );
}
