import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">

      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-slate-900 mb-2">SMART HOTEL</h1>
        <p className="text-slate-500 text-lg uppercase tracking-widest">Management System Portal</p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">

        {/* Card 1: Guest Service (This is working now) */}
        <Link href="/guest" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600">Guest Management</h3>
            <p className="text-slate-500 mt-2 text-sm">Register guests, view history, and manage profiles.</p>
          </div>
        </Link>

        {/* Card 2: Housekeeping (Friend needs to build this) */}
        <Link href="/housekeeping" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
              <span className="text-2xl">🧹</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-orange-600">Housekeeping</h3>
            <p className="text-slate-500 mt-2 text-sm">Manage room cleaning, tasks, and staff assignments.</p>
          </div>
        </Link>

        {/* Card 3: Restaurant (Friend needs to build this) */}
        <Link href="/restaurant" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
              <span className="text-2xl">🍽️</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-green-600">Restaurant</h3>
            <p className="text-slate-500 mt-2 text-sm">Manage food orders, menus, and dining services.</p>
          </div>
        </Link>

        {/* Can add more Cards here if needed... */}

      </div>

      <div className="mt-12 text-slate-400 text-sm">
        © 2026 Smart Hotel System | Global Architecture Team
      </div>
    </div>
  );
}