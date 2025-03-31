import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

// Define a type for rooms
interface Room {
    id: number;
    name: string;
    created_at: string;
}

interface RoomListProps {
    onRoomSelect: (roomId: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ onRoomSelect }) => {
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        const fetchRooms = async () => {
            const { data, error } = await supabase
                .from("rooms")
                .select("*")
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Error fetching rooms:", error);
            } else {
                setRooms(data as Room[]);
            }
        };

        fetchRooms();
    }, []);

    return (
        <div>
            <h2>Available Rooms</h2>
            <ul>
                {rooms.map((room) => (
                    <li key={room.id} onClick={() => onRoomSelect(room.id.toString())} style={{ cursor: "pointer" }}>
                        {room.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RoomList;
