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
      className={`follower-btn ${isFollowing ? "following" : ""}`}
      onClick={handleToggleFollow}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowerButton;
