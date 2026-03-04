"use client"; // Next.js වල interactive වැඩ වලට මේක ඕනේ
import { useEffect, useState } from "react";

export default function RoomDashboard() {
  // Room දත්ත වලට අදාළ interface එකක් හදාගමු
interface Room {
  id: number;
  roomNumber: string;
  type: string;
  price: number;
  status: string;
}

// useState එකට <Room[]> කියන එක එකතු කරන්න
const [rooms, setRooms] = useState<Room[]>([]);
  // Backend එකෙන් Data ගේන විදිය
  useEffect(() => {
    fetch("http://localhost:8082/api/rooms") // ඔයාගේ Spring Boot API එක
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Smart Hotel Room Dashboard</h1>
      
      {/* Grid View එක */}
      <div className="grid grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`p-5 rounded-lg border-2 text-white font-bold ${
              room.status === "Available" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <h2>Room No: {room.roomNumber}</h2>
            <p>Type: {room.type}</p>
            <p>Price: ${room.price}</p>
            <p>Status: {room.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}