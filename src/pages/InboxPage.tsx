import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../context/userContext";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Message {
  id?: string;
  created_at?: string;
  text: string;
  sender_id: string;
  recipient_id: string;
  read: boolean;
}

export default function InboxPage() {
  const { user } = useUserContext();

  const messagesQuery = useQuery({
    queryKey: ["supabase", "inbox", user?.id],
    queryFn: async () => {
      if (!user) {
        return [];
      }
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);
      if (error) {
        throw error;
      }
      return data as Message[];
    },
  });

  if (messagesQuery.isLoading) {
    return "Loading...";
  }

  if (messagesQuery.isError) {
    return "Error loading messages";
  }

  const messages = messagesQuery.data;

  if (!messages) {
    return "No messages found";
  }

  const conversations: { [userId: string]: Message[] } = {};
  messages.forEach((message) => {
    const otherUserId =
      message.sender_id === user?.id ? message.recipient_id : message.sender_id;
    if (!conversations[otherUserId]) {
      conversations[otherUserId] = [];
    }
    conversations[otherUserId].push(message);
  });

  return (
    <div className="main-container">
      <h1>Inbox</h1>
      <div>
        {Object.entries(conversations).map(([userId, messages]) => {
          const lastMessage = messages[messages.length - 1];
          return (
            <Link to={`/messages/${user?.id}/${userId}`} key={userId}>
              <div className="conversation">
                <div>
                  {/* <img src={getProfileImage(userId)} alt="Profilbild" /> */}
                  {/* <h3>{getUserName(userId)}</h3> */}
                </div>
                <div>
                  <p>{lastMessage.text}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
