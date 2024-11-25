import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Message {
  id?: string;
  created_at?: string;
  text: string;
  sender_id: string;
  recipient_id: string;
  read: boolean;
}

export default function MessagesPage() {
  const messageInputRef = useRef<HTMLInputElement>(null);
  const { senderId, recipientId } = useParams() as {
    senderId: string;
    recipientId: string;
  };

  const messagesQuery = useQuery({
    queryKey: ["supabase", "messages", senderId, recipientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${senderId},recipient_id.eq.${senderId}`)
        .eq("recipient_id", recipientId);
      if (error) {
        throw error;
      }
      return data as Message[];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInputRef.current) {
      return;
    }

    const newMessage: Message = {
      text: messageInputRef.current.value,
      sender_id: senderId,
      recipient_id: recipientId,
      read: false,
    };

    const result = await supabase.from("messages").insert(newMessage);
    if (result.error) {
      console.error(result.error);
    } else {
      messageInputRef.current.value = "";
      messagesQuery.refetch();
    }
  };
  if (messagesQuery.isError) {
    return console.log(messagesQuery.error.message);
  }

  if (messagesQuery.isPending) {
    return "Loading ...";
  }

  const messages = messagesQuery.data.map((message) => ({
    ...message,
    direction: message.sender_id === recipientId ? "received" : "sent",
  }));

  console.log(messages);
  return (
    <div className="main-container">
      <h1>Messages</h1>
      <div>
        {messages.map((items) => {
          return <div>{items.text}</div>;
        })}
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" ref={messageInputRef} required />
          <button>Send</button>
        </form>
      </div>
    </div>
  );
}
