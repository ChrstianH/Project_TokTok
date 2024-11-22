import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useUserContext } from "../context/userContext";
import CommentCount from "./CommentCount";
import heart from "/icons/heart_icon.svg";
import comment from "/icons/comment_icon.svg";
import { useQuery } from "@tanstack/react-query";

interface Props {
  postId: string;
}

const PostInteraction = ({ postId }: Props) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("likes")
          .select("id")
          .eq("post_id", postId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          if (error.code !== "PGRST116") {
            console.error("Error fetching likes:", error);
          }
        } else {
          setIsLiked(data !== null);
        }
      }
    };
    fetchLikes();
  }, [postId, user]);

  useEffect(() => {
    const updateLikes = async () => {
      if (user) {
        if (isLiked) {
          const { error } = await supabase
            .from("likes")
            .insert({ post_id: postId, user_id: user.id });

          if (error) {
            console.error("Error adding like:", error);
          }
        } else {
          const { error } = await supabase
            .from("likes")
            .delete()
            .eq("post_id", postId)
            .eq("user_id", user.id);

          if (error) {
            console.error("Error removing like:", error);
          }
        }
      }
    };
    updateLikes();
  }, [postId, user, isLiked]);

  useEffect(() => {
    const fetchLikeCount = async () => {
      const { count, error } = await supabase
        .from("likes")
        .select("id", { count: "exact" })
        .eq("post_id", postId);

      if (error) {
        console.error("Error fetching like count:", error);
      } else {
        setLikes(count ?? 0);
      }
    };

    fetchLikeCount();
  }, [postId, isLiked]);

  const handleCommentClick = () => {
    navigate(`/comments/${postId}`);
  };

  const { refetch } = useQuery({
    queryKey: ["likes", postId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("likes")
        .select("id", { count: "exact" })
        .eq("post_id", postId);

      if (error) {
        throw error;
      }
      return count ?? 0;
    },
  });

  const handleLikeClick = async () => {
    setIsLiked((prevIsLiked) => !prevIsLiked);
    await refetch();
  };

  return (
    <div className="interaction-container">
      <div className="mini-flex">
        <button onClick={handleLikeClick} className="comment-like-btn">
          <img src={heart} alt="like" />
        </button>
        <p>{likes} Likes</p>
      </div>
      <div className="mini-flex">
        <button onClick={handleCommentClick} className="comment-like-btn">
          <img src={comment} alt="comment" />
        </button>
        <CommentCount postId={postId} />
      </div>
    </div>
  );
};

export default PostInteraction;
