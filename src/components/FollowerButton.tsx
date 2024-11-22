import { supabase } from "../lib/supabase";

interface FollowerButtonProps {
  currentUserId: string | null | undefined;
  followedId: string;
  isFollowing: boolean | null;
  onFollowChange: () => void;
}

const FollowerButton: React.FC<FollowerButtonProps> = ({
  currentUserId,
  followedId,
  isFollowing,
  onFollowChange,
}) => {
  const handleFollow = async () => {
    if (!currentUserId) return;

    const { error } = await supabase
      .from("follower")
      .insert([{ user_id: currentUserId, profile_id: followedId }]);

    if (error) {
      console.error("Error while following:", error);
    } else {
      setTimeout(onFollowChange, 500);
    }
  };

  const handleUnfollow = async () => {
    if (!currentUserId) return;

    const { error } = await supabase
      .from("follower")
      .delete()
      .match({ user_id: currentUserId, profile_id: followedId });

    if (error) {
      console.error("Error exiting the follow up:", error);
    } else {
      setTimeout(onFollowChange, 500);
    }
  };

  return (
    <button
      onClick={() => (isFollowing ? handleUnfollow() : handleFollow())}
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
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowerButton;
