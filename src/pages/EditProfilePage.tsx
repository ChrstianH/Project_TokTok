import { useRef } from "react";
import arrowLeft from "../../public/icons/arrow_left.svg";
import { useUserContext } from "../context/userContext";
import { supabase } from "../lib/supabase";
import { NavLink, useNavigate } from "react-router-dom";

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

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    if (!user) {
      return;
    }
    e.preventDefault();
    const file = imageInputRef.current?.files?.[0] || null;

    let imagePath: string | null = null;

    if (file) {
      const uploadResult = await supabase.storage
        .from("profile_img")
        .upload(`${user.id}/${crypto.randomUUID()}`, file, { upsert: true });
      imagePath = uploadResult.data?.fullPath || null;
    }

    await supabase
      .from("profiles")
      .update({
        name: nameInputRef.current!.value,
        user_name: userNameInputRef.current!.value,
        img_url: imagePath,
        occupation: occupationInputRef.current!.value,
        slogan: bioInputRef.current!.value,
        birthday: birthdayInputRef.current!.value,
        website: websiteInputRef.current!.value,
        gender: genderInputRef.current!.value,
      })
      .eq("id", user.id);
    navigate("/:userID/profile");
  };

  return (
    <div>
      <div className="profile-header">
        <div>
          <NavLink to={"/home"}>
            <img src={arrowLeft} alt="back home button" />
          </NavLink>
          <h2>Edit Profile</h2>
        </div>
      </div>
      <div className="details-container">
        <form onSubmit={handleSubmit}>
          <input
            ref={imageInputRef}
            type="file"
            name="image"
            placeholder="upload image"
          />
          <input
            ref={nameInputRef}
            type="text"
            name="name"
            placeholder="your name"
          />
          <input
            ref={userNameInputRef}
            type="text"
            name="userName"
            placeholder="your user name"
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
          />
          <select ref={genderInputRef} name="gender" id="gender">
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
      </div>
    </div>
  );
}
