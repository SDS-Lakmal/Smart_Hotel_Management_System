import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-6">
      <div className="text-center mb-10 mt-10">
        <h1 className="text-5xl font-bold text-slate-900 mb-2">SMART HOTEL</h1>
        <p className="text-slate-500 text-lg uppercase tracking-widest">Management System Portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full mx-auto">
        <Link href="/guest" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 h-full">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600">Guest Management</h3>
            <p className="text-slate-500 mt-2 text-sm">Register guests, view history, and manage profiles.</p>
          </div>
        </Link>

        <Link href="/rooms" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1 h-full">
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
              <span className="text-2xl">🛏️</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600">Room Management</h3>
            <p className="text-slate-500 mt-2 text-sm">Manage room inventory, pricing, and status updates.</p>
          </div>
        </Link>

        <Link href="/reservations" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1 h-full">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-600">Reservation System</h3>
            <p className="text-slate-500 mt-2 text-sm">Handle core booking logic linking guests to rooms.</p>
          </div>
        </Link>

        <Link href="/restaurant" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-green-500 transition-all duration-300 transform hover:-translate-y-1 h-full">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
              <span className="text-2xl">🍽️</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-green-600">Restaurant & Dining</h3>
            <p className="text-slate-500 mt-2 text-sm">Manage food orders, menus, and dining services.</p>
          </div>
        </Link>

        <Link href="/staff" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-teal-500 transition-all duration-300 transform hover:-translate-y-1 h-full">
            <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
              <span className="text-2xl">👨‍💼</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-600">Staff Management</h3>
            <p className="text-slate-500 mt-2 text-sm">Admin panel for handling employee records and roles.</p>
          </div>
        </Link>

        <Link href="/housekeeping" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-orange-500 transition-all duration-300 transform hover:-translate-y-1 h-full">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
              <span className="text-2xl">🧹</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-600">Housekeeping</h3>
            <p className="text-slate-500 mt-2 text-sm">Manage cleaning tasks and room hygiene status.</p>
          </div>
        </Link>

        <Link href="/billing" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-red-500 transition-all duration-300 transform hover:-translate-y-1 h-full">
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
              <span className="text-2xl">🧾</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-red-600">Billing & Invoicing</h3>
            <p className="text-slate-500 mt-2 text-sm">Generate final invoices calculating total amounts.</p>
          </div>
        </Link>

        <Link href="/inventory" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-1 h-full">
            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-600 transition-colors">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-amber-600">Inventory & Stock</h3>
            <p className="text-slate-500 mt-2 text-sm">Manage hotel supplies, quantities, and reorder levels.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}