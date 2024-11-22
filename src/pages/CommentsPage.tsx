import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getStorageURL } from "../lib/supabase";
import HashtagText from "../components/HashtagText";
import { useUserContext } from "../context/userContext";

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  text: string;
  created_at: string;
  profiles: {
    user_name: string;
    img_url: string | null;
  };
}

interface PostWithProfile {
  id: string;
  img_url: string | null;
  text: string;
  user_id: string;
  created_at: string;
  profiles: {
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
              user_name,
              img_url
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

    const commentsSubscription = supabase
      .channel("public:comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          setComments((prevComments) => [
            payload.new as Comment,
            ...prevComments,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(commentsSubscription);
    };
  }, [postId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newComment.trim() === "") {
      return;
    }

    try {
      if (user) {
        const { error } = await supabase.from("comments").insert({
          post_id: postId ?? "",
          text: newComment,
          user_id: user.id,
        });

        if (error) {
          console.error("Error adding comment:", error);
        } else {
          setNewComment("");
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
      {post && (
        <div>
          <div className="post-header">
            <img
              src={getStorageURL(post.profiles.img_url!) || ""}
              alt={post.profiles.user_name}
              className="avatar"
            />
            <div>
              <b>{post.profiles.user_name}</b>
              <p>{post.profiles.occupation}</p>
            </div>
          </div>
          <div className="post-container">
            <img
              src={getStorageURL(post.img_url!) || ""}
              className="post-img"
            />
            <HashtagText text={post.text} />
          </div>
        </div>
      )}
      <div>
        <h2>Kommentare</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write comment..."
          />
          <button type="submit">Post</button>
        </form>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <div className="comment-header">
                <img
                  src={getStorageURL(comment.profiles.img_url!) || ""}
                  alt={comment.profiles.user_name}
                  className="avatar"
                />
                <b>{comment.profiles.user_name}</b>
              </div>
              <p>{comment.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
