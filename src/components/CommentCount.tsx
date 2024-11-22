import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

interface Props {
  postId: string;
}

const CommentCount = ({ postId }: Props) => {
  const commentsQuery = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("id")
        .eq("post_id", postId);
      if (error) {
        throw error;
      }
      return data;
    },
  });

  if (commentsQuery.isLoading) {
    return <span>Loading comment count...</span>;
  }

  if (commentsQuery.isError) {
    return (
      <span>Error loading comment count: {commentsQuery.error.message}</span>
    );
  }

  const commentCount = commentsQuery.data?.length ?? 0;

  return <span>Comments: {commentCount}</span>;
};

export default CommentCount;
