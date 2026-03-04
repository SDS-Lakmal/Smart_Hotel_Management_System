"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface Guest {
  guestId?: number;
  name: string;
  nic: string;
  phone: string;
  email: string;
  checkInTime?: string;
}

export default function GuestManagement() {
  const [view, setView] = useState("checkin");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState({ total: 0, today: 0 });

  const [formData, setFormData] = useState({ name: "", nic: "", email: "", phone: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const fetchGuestsAndStats = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/guests");
      if (response.ok) {
        const data = await response.json();
        setGuests(data);

        const totalCount = data.length;
        const todayStr = new Date().toISOString().split('T')[0];
        const todayCount = data.filter((g: Guest) =>
          g.checkInTime && g.checkInTime.startsWith(todayStr)
        ).length;

        setStats({ total: totalCount, today: todayCount });
      }
    } catch {
      console.error("Error fetching data");
    }
  };

  useEffect(() => { fetchGuestsAndStats(); }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "loading", message: "Processing Check-In..." });

    try {
      const response = await fetch("http://localhost:8080/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ type: "success", message: "🎉 Guest Checked-In Successfully!" });
        setFormData({ name: "", nic: "", email: "", phone: "" });
        fetchGuestsAndStats(); 
      } else {
        setStatus({ type: "error", message: "❌ Check-In Failed." });
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
          <h2 className="text-2xl font-bold text-slate-800">Guest Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage guest registrations and profiles</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-700">Reception Desk</p>
          <p className="text-xs text-green-600 font-semibold flex items-center justify-end gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
          </p>
        </div>
      </header>

      {/* --- PAGE TABS --- */}
      <div className="flex space-x-2 mb-8 border-b border-slate-200">
        <button 
          onClick={() => setView("checkin")} 
          className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${
            view === 'checkin' ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg'
          }`}
        >
          📝 Guest Check-In
        </button>
        <button 
          onClick={() => {setView("history"); fetchGuestsAndStats();}} 
          className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${
            view === 'history' ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg'
          }`}
        >
          📜 Guest History
        </button>
      </div>

      {/* --- TAB CONTENT --- */}
      {view === "checkin" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-700 mb-6 border-b pb-2">New Guest Entry</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Kasun Perera" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">NIC / Passport</label>
                  <input type="text" name="nic" value={formData.nic} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ID Number" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Email Address" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Phone Number" />
                </div>
              </div>
              {status.message && <div className={`p-3 rounded text-sm font-medium ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{status.message}</div>}
              <button type="submit" disabled={isLoading} className="w-full py-3 rounded-lg text-white font-bold bg-blue-600 hover:bg-blue-700 transition">{isLoading ? "Processing..." : "Check-In Guest"}</button>
            </form>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h4 className="text-slate-500 text-xs font-bold uppercase mb-4 border-b pb-2">Today's Summary</h4>
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-600 font-medium">New Arrivals / Today</span>
                <span className="font-bold text-white text-lg bg-green-500 px-3 py-1 rounded shadow-sm">{stats.today}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Total Guests</span>
                <span className="font-bold text-slate-800 text-lg bg-slate-100 px-3 py-1 rounded border border-slate-200">{stats.total}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "history" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-semibold text-slate-700">All Registered Guests</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">Total: {guests.length}</span>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">NIC</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {guests.map((g: Guest) => (
                <tr key={g.guestId} className="hover:bg-blue-50">
                  <td className="px-6 py-3 text-slate-500 font-mono text-xs">#{g.guestId}</td>
                  <td className="px-6 py-3 font-medium text-slate-800">{g.name}</td>
                  <td className="px-6 py-3 text-slate-600 text-sm">{g.nic}</td>
                  <td className="px-6 py-3 text-slate-400 text-xs">
                    {g.checkInTime ? new Date(g.checkInTime).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}