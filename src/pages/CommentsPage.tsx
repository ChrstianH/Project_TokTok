import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getStorageURL } from "../lib/supabase";
import HashtagText from "../components/HashtagText";
import { useUserContext } from "../context/userContext";
import BackButton from "../components/BackButton";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  text: string;
  created_at: string;
  profiles: {
    user_name: string;
    img_url: string | null;
    occupation: string | null;
  };
}

interface PostWithProfile {
  id: string;
  img_url: string | null;
  text: string;
  user_id: string;
  created_at: string;
  profiles: {
    id: string | null;
    user_name: string;
    img_url: string | null;
    occupation: string | null;
  };
}

export default function CommentsPage() {
  const { postId } = useParams();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [post, setPost] = useState<PostWithProfile | null>(null);
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        const { data, error } = await supabase
          .from("posts")
          .select(
            `
            id, 
            img_url, 
            text, 
            user_id, 
            created_at,
            profiles (
              id,
              user_name, 
              img_url,
              occupation
            )
          `
          )
          .eq("id", postId)
          .single();

        if (error) {
          console.error("Error fetching post:", error);
        } else {
          setPost(data as PostWithProfile);
        }
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    const fetchComments = async () => {
      if (postId) {
        const { data, error } = await supabase
          .from("comments")
          .select(
            `
            id,
            post_id,
            user_id,
            text,
            created_at,
            profiles (
              id,
              user_name,
              img_url,
              occupation
            )
          `
          )
          .eq("post_id", postId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching comments:", error);
        } else {
          setComments(data as Comment[]);
        }
      }
    };

    fetchComments();
  }, [postId]);

  const [_userImgUrl, setUserImgUrl] = useState("");

  useEffect(() => {
    const fetchUserImgUrl = async () => {
      if (user?.img_url) {
        const url = await getStorageURL(user.img_url);
        setUserImgUrl(url ?? "");
      }
    };
    fetchUserImgUrl();
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newComment.trim() === "") {
      return;
    }

    try {
      if (user) {
        const { data, error } = await supabase
          .from("comments")
          .insert({
            post_id: postId ?? "",
            text: newComment,
            user_id: user.id,
          })
          .single();

        if (error) {
          console.error("Error adding comment:", error);
        } else {
          setNewComment("");
          setComments([data as Comment, ...comments]);
        }
      } else {
        console.error("No user logged in");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="main-container">
      <div className="profile-header">
        <div>
          <BackButton />
          <h2>{post?.profiles.user_name}'s post</h2>
        </div>
      </div>

      {post && (
        <div>
          <div
            className="post-header"
            onClick={() => {
              navigate(`/other-profile/${post?.profiles.id}`);
            }}
          >
            <img
              src={getStorageURL(post.profiles.img_url!) || ""}
              alt={post.profiles.user_name}
              className="avatar"
            />
            <div>
              <h6 className="user-name">{post.profiles.user_name}</h6>
              <p className="user-occ">{post.profiles.occupation}</p>
            </div>
          </div>
          <div className="post-container">
            <img
              src={getStorageURL(post.img_url!) || ""}
              className="post-img"
            />
            <HashtagText text={post.text} />
            <p className="comment-time">
              {formatDistanceToNow(new Date(post.created_at))} ago
            </p>
          </div>
        </div>
      )}
      <div>
        <hr />
        <form className="comment-form" onSubmit={handleSubmit}>
          <img
            className="avatar"
            src={user ? getStorageURL(user.img_url!) || "" : ""}
            alt="user image"
          />
          <input
            required
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Your comment..."
          />
          <button type="submit">Post</button>
        </form>
        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id}>
              <div className="post-header">
                <img
                  src={getStorageURL(comment.profiles.img_url!) || ""}
                  alt={comment.profiles.user_name}
                  className="avatar"
                />
                <div>
                  <h6 className="user-name">{comment.profiles.user_name}</h6>
                  <p className="user-occ">{comment.profiles.occupation}</p>
                </div>
              </div>
              <p className="comment-text">{comment.text}</p>
              <p className="comment-time">
                {formatDistanceToNow(new Date(comment.created_at))} ago
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
