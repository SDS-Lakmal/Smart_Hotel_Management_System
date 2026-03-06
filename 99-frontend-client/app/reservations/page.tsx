"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface Reservation {
  reservationId?: number;
  guestId: number;
  roomNumber: number;
  checkIn: string;
  checkOut: string;
}

interface Guest {
  guestId: number;
  name: string;
}

interface Room {
  roomNumber: number;
  type: string;
  status: string;
}

export default function ReservationManagement() {
  const [view, setView] = useState("new");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formData, setFormData] = useState({ guestId: "", roomNumber: "", checkIn: "", checkOut: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const fetchReservations = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/reservations/active");
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch {
      console.error("Error fetching reservations");
    }
  };

  const fetchGuests = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/guests");
      if (response.ok) {
        const data = await response.json();
        setGuests(data);
      }
    } catch {
      console.error("Error fetching guests");
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/rooms");
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch {
      console.error("Error fetching rooms");
    }
  };

  useEffect(() => {
    fetchGuests();
    fetchRooms();
    if (view === "active") fetchReservations();
  }, [view]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "loading", message: "Creating Reservation..." });

    try {
      const response = await fetch("http://localhost:8080/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: parseInt(formData.guestId),
          roomNumber: parseInt(formData.roomNumber),
          checkIn: formData.checkIn,
          checkOut: formData.checkOut
        }),
      });

      if (response.ok) {
        setStatus({ type: "success", message: "🎉 Reservation Created Successfully!" });
        setFormData({ guestId: "", roomNumber: "", checkIn: "", checkOut: "" });
        fetchReservations();
      } else {
        setStatus({ type: "error", message: "❌ Reservation Failed." });
      }
    } catch {
      setStatus({ type: "error", message: "⚠️ Server Error." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Reservation System</h2>
          <p className="text-slate-500 text-sm mt-1">Manage bookings linking guests to rooms</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-700">Booking Desk</p>
          <p className="text-xs text-green-600 font-semibold flex items-center justify-end gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
          </p>
        </div>
      </header>

      {/* TABS */}
      <div className="flex space-x-2 mb-8 border-b border-slate-200">
        <button 
          onClick={() => setView("new")} 
          className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${
            view === 'new' ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg'
          }`}
        >
          📅 New Reservation
        </button>
        <button 
          onClick={() => {setView("active"); fetchReservations();}} 
          className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${
            view === 'active' ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg'
          }`}
        >
          📋 Active Reservations
        </button>
      </div>

      {/* TAB CONTENT */}
      {view === "new" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-700 mb-6 border-b pb-2">Create New Reservation</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Select Guest</label>
                <select name="guestId" value={formData.guestId} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Choose Guest</option>
                  {guests.map(g => <option key={g.guestId} value={g.guestId}>{g.name} (ID: {g.guestId})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Select Room</label>
                <select name="roomNumber" value={formData.roomNumber} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Choose Room</option>
                  {rooms.filter(r => r.status === 'available').map(r => <option key={r.roomNumber} value={r.roomNumber}>Room {r.roomNumber} ({r.type})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Check-In Date</label>
                <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Check-Out Date</label>
                <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            {status.message && <div className={`p-3 rounded text-sm font-medium ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{status.message}</div>}
            <button type="submit" disabled={isLoading} className="w-full py-3 rounded-lg text-white font-bold bg-blue-600 hover:bg-blue-700 transition">{isLoading ? "Creating..." : "Create Reservation"}</button>
          </form>
        </div>
      )}

      {view === "active" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-semibold text-slate-700">Active Reservations</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">Total: {reservations.length}</span>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Reservation ID</th>
                <th className="px-6 py-3">Guest ID</th>
                <th className="px-6 py-3">Room Number</th>
                <th className="px-6 py-3">Check-In</th>
                <th className="px-6 py-3">Check-Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservations.map((r: Reservation) => (
                <tr key={r.reservationId} className="hover:bg-blue-50">
                  <td className="px-6 py-3 text-slate-500 font-mono text-xs">#{r.reservationId}</td>
                  <td className="px-6 py-3 text-slate-800">{r.guestId}</td>
                  <td className="px-6 py-3 text-slate-600">{r.roomNumber}</td>
                  <td className="px-6 py-3 text-slate-400 text-xs">{r.checkIn}</td>
                  <td className="px-6 py-3 text-slate-400 text-xs">{r.checkOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}