import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

// Define a type for messages
interface Message {
    id: number;
    room_id: string;
    user_id: string;
    content: string;
    created_at: string;
}

const ChatRoom = ({ roomId }: { roomId: string }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [typing, setTyping] = useState(false);

    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("room_id", roomId)
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Error fetching messages:", error);
            } else {
                setMessages(data as Message[]);
            }
        };

        fetchMessages();

        const channel = supabase
            .channel("public:messages")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
                setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
                new Audio("/notification.mp3").play();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId]);

    const sendMessage = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        await supabase.from("messages").insert({
            room_id: roomId,
            user_id: user.id,
            content: newMessage,
        });
        setNewMessage("");
        setTyping(false);
    };

    const handleTyping = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            await sendMessage();
        } else {
            setTyping(true);
        }
    };

    return (
        <div>
            <div>
                {messages.map((message) => (
                    <div key={message.id} className="message">
                        <strong>{message.user_id}</strong>: {message.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleTyping}
                placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
            {typing && <p>User is typing...</p>}
        </div>
    );
};

export default ChatRoom;
