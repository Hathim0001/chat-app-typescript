import {useState} from "react";
import ChatRoom from "../components/ChatRoom";
import RoomList from "../components/RoomList";

export default function Home() {
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

    const handleRoomSelect = (roomId: string) => {
        setSelectedRoomId(roomId);
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <div style={{ width: "300px", borderRight: "1px solid #ccc" }}>
                <RoomList onRoomSelect={handleRoomSelect} />
            </div>
            <div style={{ flex: 1, padding: "20px" }}>
                {selectedRoomId ? (
                    <ChatRoom roomId={selectedRoomId} />
                ) : (
                    <h2>Select a room to start chatting</h2>
                )}
            </div>
        </div>
    );
}