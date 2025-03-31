import React,{useEffect,useState} from "react";
import { supabase } from "../utils/supabaseClient";

const ChatRoom = ({roomId}:{roomId:String}) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    
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
            setMessages(data);
        }
        };
    
        fetchMessages();
    
    
    const subscription = supabase
        .channel('realtime:messages')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
            setMessages((prevMessages) => [...prevMessages, payload.new]);
            new Audio("/notifications.mp3").play();
        })
        .subscribe();

    return () => {
        supabase.removeChannel(subscription);
    };
}, [roomId]);

    const sendMessage=async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        await
        supabase.from("messages").insert({
            room_id: roomId,
            user_id: user.id,
            content: newMessage,
        });
        setNewMessage("");
    };
    const[typing,setTyping]=useState(false);
    const handleTyping=async (e:any)=>{
        if(e.key==="Enter"){
            await sendMessage();
        }else{
            setTyping(true);
        }
    };
    <input
    value={newMessage}
    onChange={(e)=>setNewMessage(e.target.value)}
    onKeyDown={handleTyping}
   />;
        {typing && <span>User is typing...</span>}
    return(
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
                placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};
export default ChatRoom;