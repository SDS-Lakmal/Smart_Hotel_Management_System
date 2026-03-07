"use client";

import { useEffect, useState } from "react";

// Proposal එකේ තිබුණු විදියට Room interface එක [cite: 49]
interface Room {
  roomNumber: string;
  type: string;
  price: number;
  status: string;
}

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  // useState පාවිච්චි කරලා Form input handle කිරීම 
  const [newRoom, setNewRoom] = useState<Room>({
    roomNumber: "",
    type: "Non-AC",
    price: 0,
    status: "Available"
  });

  // Backend එකෙන් ඩේටා ලබා ගැනීම (GET /api/rooms) [cite: 42, 52]
  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:8082/api/rooms");
      const data = await res.json();
      setRooms(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // අලුත් කාමරයක් ඇතුළත් කිරීම (POST /api/rooms) [cite: 41, 51]
  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8082/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });
      
      if (res.ok) {
        setNewRoom({ roomNumber: "", type: "Non-AC", price: 0, status: "Available" });
        fetchRooms(); // List එක update කිරීම
        alert("Room added successfully!");
      }
    } catch (err) {
      alert("Failed to add room");
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-blue-900 uppercase tracking-wide">
          Module 02: Room Management System
        </h1>
        <p className="text-gray-500 mt-2">Smart Hotel Management System [cite: 9]</p>
      </header>

      {/* Add New Room Form  */}
      <section className="max-w-4xl mx-auto mb-12 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Add New Room to Inventory [cite: 47, 51]</h2>
        <form onSubmit={handleAddRoom} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Room Number</label>
            <input 
              type="text" 
              placeholder="e.g. 101"
              value={newRoom.roomNumber} 
              onChange={(e) => setNewRoom({...newRoom, roomNumber: e.target.value})} 
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Room Type [cite: 49]</label>
            <select 
              value={newRoom.type} 
              onChange={(e) => setNewRoom({...newRoom, type: e.target.value})} 
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Price (Rs.) [cite: 49]</label>
            <input 
              type="number" 
              value={isNaN(newRoom.price) ? "" : newRoom.price} 
              onChange={(e) => setNewRoom({...newRoom, price: e.target.value === "" ? 0 : parseFloat(e.target.value)})} 
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            + Add Room
          </button>
        </form>
      </section>

      {/* Grid View Dashboard  */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Room Inventory Dashboard [cite: 47]</h2>
        {loading ? (
          <div className="text-center py-10">Loading rooms...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rooms.map((room) => (
              <div 
                key={room.roomNumber} 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`h-2 ${room.status === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-black text-gray-800">Room {room.roomNumber} [cite: 49]</h3>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                      room.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {room.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-500 flex justify-between">
                      <span>Type:</span> <span className="font-semibold text-gray-800">{room.type}</span>
                    </p>
                    <p className="text-gray-500 flex justify-between">
                      <span>Daily Rate:</span> <span className="font-bold text-blue-600">Rs. {room.price.toLocaleString()}</span>
                    </p>
                  </div>
                  <button className="w-full mt-6 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    Update Details [cite: 53]
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {rooms.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">No rooms found in the system.</p>
          </div>
        )}
      </section>
    </div>
  );
}