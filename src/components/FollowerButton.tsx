import { useState } from "react";
import { supabase } from "../lib/supabase";

interface FollowerButtonProps {
  currentUserId: string | null | undefined;
  followedId: string;
  isFollowing: boolean;
  onFollowChange: (isFollowing: boolean) => void;
}

const FollowerButton: React.FC<FollowerButtonProps> = ({
  currentUserId,
  followedId,
  isFollowing,
  onFollowChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFollow = async () => {
    if (!currentUserId) return;
    setIsLoading(true);

    try {
      if (isFollowing) {
        await supabase
          .from("follower")
          .delete()
          .eq("user_id", currentUserId)
          .eq("profile_id", followedId);
      } else {
        await supabase.from("follower").insert({
          user_id: currentUserId,
          profile_id: followedId,
        });
      }

      onFollowChange(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFollow}
      disabled={isLoading}
      style={{
        padding: "8px 20px",
        borderRadius: "20px",
        fontSize: "14px",
        backgroundColor: isFollowing ? "#ccc" : "#FF4D67",
        color: isFollowing ? "#000" : "#fff",
        transition: "all 0.3s",
        border: "none",
      }}
    >
      {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowerButton;
