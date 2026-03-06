import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link"; // Sidebar 

const inter = Inter({
  variable: "--font-geist-sans", // Keep variable name so css doesn't break
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Hotel Management",
  description: "Global Architecture Portal by Team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased flex h-screen overflow-hidden bg-slate-50 text-slate-900`}
      >

        {/* --- GLOBAL SIDEBAR*/}
        <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col shadow-2xl h-screen flex-shrink-0 z-50">
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-2xl font-bold text-blue-400">SMART HOTEL</h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Global Dashboard</p>
          </div>

          <nav className="mt-4 flex-1 px-2 space-y-1 overflow-y-auto pb-6">
            <Link href="/" className="flex items-center py-2.5 px-4 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
              <span className="mr-3">🏠</span><span className="font-medium text-sm">Main Menu</span>
            </Link>

            <div className="pt-4 pb-2 px-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hotel Modules</p>
            </div>

            {/* Links for All 8 Modules */}
            <Link href="/guest" className="flex items-center py-2.5 px-4 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"><span className="mr-3">👥</span><span className="font-medium text-sm">Guest Management</span></Link>
            <Link href="/staff" className="flex items-center py-2.5 px-4 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"><span className="mr-3">🏷️</span><span className="font-medium text-sm">Staff Management</span></Link>
            <Link href="/rooms" className="flex items-center py-2.5 px-4 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"><span className="mr-3">🛏️</span><span className="font-medium text-sm">Room Management</span></Link>
            <Link href="/reservations" className="flex items-center py-2.5 px-4 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"><span className="mr-3">📅</span><span className="font-medium text-sm">Reservations</span></Link>
            <Link href="/restaurant" className="flex items-center py-2.5 px-4 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"><span className="mr-3">🍽️</span><span className="font-medium text-sm">Restaurant & Dining</span></Link>
            <Link href="/housekeeping" className="flex items-center py-2.5 px-4 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"><span className="mr-3">🧹</span><span className="font-medium text-sm">Housekeeping</span></Link>
            <Link href="/billing" className="flex items-center py-2.5 px-4 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"><span className="mr-3">🧾</span><span className="font-medium text-sm">Billing & Invoicing</span></Link>
            <Link href="/inventory" className="flex items-center py-2.5 px-4 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"><span className="mr-3">📦</span><span className="font-medium text-sm">Inventory & Stock</span></Link>
          </nav>
        </aside>

        {/* --- DYNAMIC MAIN CONTENT --- */}

        <main className="flex-1 h-screen overflow-y-auto">
          {children}
        </main>

      </body>
    </html>
  );
}