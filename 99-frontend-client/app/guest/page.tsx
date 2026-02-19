"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Link from "next/link"; // Imported Link

interface Guest {
  guestId?: number;
  name: string;
  nic: string;
  phone: string;
  email: string;
  checkInTime?: string;
}

export default function GuestManagement() {
  // --- STATE ---
  const [view, setView] = useState("checkin");
  const [guests, setGuests] = useState<Guest[]>([]); // Guest List
  const [stats, setStats] = useState({ total: 0, today: 0 }); // Real Stats

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    nic: "",
    email: "",
    phone: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  // --- FUNCTIONS ---

  // 1. Load Data & Calculate Stats
  const fetchGuestsAndStats = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/guests");
      if (response.ok) {
        const data = await response.json();
        setGuests(data);

        // --- REAL TIME CALCULATIONS ---
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

  // Fetch Data on Page Load
  useEffect(() => {
    fetchGuestsAndStats();
  }, []);

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
        fetchGuestsAndStats(); // Refresh stats immediately
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
    <div className="min-h-screen bg-slate-50 flex font-sans">

      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-blue-400">SMART HOTEL</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Guest Manager</p>
        </div>

        <nav className="mt-6 flex-1 space-y-2">

          {/* 1. Main Menu Link (NEW) */}
          <Link href="/" className="flex items-center py-3 px-6 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            <span className="mr-3">🏠</span>
            <span className="font-medium">Main Menu</span>
          </Link>

          <hr className="border-slate-800 my-2" />

          {/* 2. Guest Check-In Button */}
          <button
            onClick={() => setView("checkin")}
            className={`w-full flex items-center py-3 px-6 transition-colors ${view === "checkin" ? "bg-blue-600 border-r-4 border-blue-300 text-white" : "text-slate-400 hover:bg-slate-800"
              }`}
          >
            <span className="mr-3">📝</span>
            <span className="font-medium">Guest Check-In</span>
          </button>

          {/* 3. Guest History Button */}
          <button
            onClick={() => { setView("history"); fetchGuestsAndStats(); }}
            className={`w-full flex items-center py-3 px-6 transition-colors ${view === "history" ? "bg-blue-600 border-r-4 border-blue-300 text-white" : "text-slate-400 hover:bg-slate-800"
              }`}
          >
            <span className="mr-3">📜</span>
            <span className="font-medium">Guest History</span>
          </button>

        </nav>

        <div className="p-4 text-xs text-slate-600 text-center">
          Guest Module v1.2
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{view === "checkin" ? "Guest Registration" : "Guest Database"}</h2>
            <p className="text-slate-500 text-sm mt-1">Real-time System Status</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-700">Reception Desk</p>
            <p className="text-xs text-green-600 font-semibold flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
            </p>
          </div>
        </header>

        {view === "checkin" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FORM */}
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

            {/* REAL STATS PANEL */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h4 className="text-slate-500 text-xs font-bold uppercase mb-4 border-b pb-2">Today&apos;s Summary</h4>

                {/* 1. New Arrivals / Today */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-600 font-medium">New Arrivals / Today</span>
                  <span className="font-bold text-white text-lg bg-green-500 px-3 py-1 rounded shadow-sm">
                    {stats.today}
                  </span>
                </div>

                {/* 2. Total Guests */}
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Total Guests</span>
                  <span className="font-bold text-slate-800 text-lg bg-slate-100 px-3 py-1 rounded border border-slate-200">
                    {stats.total}
                  </span>
                </div>

              </div>

              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 text-sm text-blue-800">
                💡 <b>System Note:</b> These counts are updated in real-time from the database.
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
      </main>
    </div>
  );
}
