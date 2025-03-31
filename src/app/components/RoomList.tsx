import React,{useState,useEffect} from "react";
import { supabase } from "../utils/supabaseClient";

const RoomList=({onRoomSelect}:{onRoomSelect:(roomId:string)=>void})=>{
    const [rooms,setRooms]=useState<any[]>([]);
    const [newRoomName,setNewRoomName]=useState<string>("");

    useEffect(()=>{
        const fetchRooms=async()=>{
            const {data,error}=await supabase
                .from("rooms")
                .select("*")
                .order("created_at",{ascending:true});
            if(error){
                console.error("Error fetching rooms:",error);
            }else{
                setRooms(data);
            }
        };
        fetchRooms();
    },[]);

    const createRoom=async()=>{
        await supabase.from("rooms").insert({
            name:newRoomName,
        });
        setNewRoomName("");
    };

    return(
        <div>
            <h2>Chat Rooms</h2>
            <ul>
                {rooms.map((room)=>(
                    <li key={room.id} onClick={()=>onRoomSelect(room.id)}>{room.name}</li>
                ))}
            </ul>
            <input
                type="text"
                value={newRoomName}
                onChange={(e)=>setNewRoomName(e.target.value)}
                placeholder="New room name"
            />
            <button onClick={createRoom}>Create Room</button>
        </div>
    );
};
export default RoomList;