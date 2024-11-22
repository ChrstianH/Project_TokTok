import { NavLink, useNavigate } from "react-router-dom";

interface FollowerInfoProps {
  userId: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  followers: { user_id: string }[] | undefined;
}

const FollowerInfo: React.FC<FollowerInfoProps> = ({
  postCount,
  followerCount,
  followingCount,
  followers,
}) => {
  const navigate = useNavigate();

  const handleFollowersClick = () => {
    const pathParts = window.location.pathname.split("/");
    const userId = pathParts[1];

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
