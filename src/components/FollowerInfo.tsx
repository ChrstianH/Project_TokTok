import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

interface FollowerInfoProps {
  userId: string;
}

const FollowerInfo: React.FC<FollowerInfoProps> = ({ userId }) => {
  const [postCount, setPostCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followers, setFollowers] = useState<{ user_id: string }[]>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostCount = async () => {
      const { count, error } = await supabase
        .from("posts")
        .select("*", { count: "exact" })
        .eq("user_id", userId);
      if (error) {
        console.error("Error loading post count:", error);
      } else {
        setPostCount(count || 0);
      }
    };

    const fetchFollowerCount = async () => {
      const { count, error } = await supabase
        .from("follower")
        .select("*", { count: "exact" })
        .eq("profile_id", userId);
      if (error) {
        console.error("Error loading follower count:", error);
      } else {
        setFollowerCount(count || 0);
      }
    };

    const fetchFollowingCount = async () => {
      const { count, error } = await supabase
        .from("follower")
        .select("*", { count: "exact" })
        .eq("user_id", userId);
      if (error) {
        console.error("Error loading following count:", error);
      } else {
        setFollowingCount(count || 0);
      }
    };

    const fetchFollowers = async () => {
      const { data, error } = await supabase
        .from("follower")
        .select("user_id")
        .eq("profile_id", userId);
      if (error) {
        console.error("Error loading followers:", error);
      } else {
        setFollowers(data);
      }
    };

    fetchPostCount();
    fetchFollowerCount();
    fetchFollowingCount();
    fetchFollowers();
  }, [userId]);

  const handleFollowersClick = () => {
    navigate(`/${userId}/profile/follower`, { state: { followers } });
  };

  return (
    <div className="follower-container">
      <div className="follower-container-info">
        <p>{postCount}</p> <p>Posts</p>
      </div>
      <span className="follower-container-span"></span>

      <div className="follower-container-info" onClick={handleFollowersClick}>
        <p>{followerCount}</p> <p>Follower</p>
      </div>
      <span className="follower-container-span"></span>
      <div className="follower-container-info">
        <p>{followingCount}</p> <p>Following</p>
      </div>
    </div>
  );
};

export default FollowerInfo;
