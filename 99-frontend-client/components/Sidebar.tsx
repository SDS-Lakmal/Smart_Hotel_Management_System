"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/housekeeping', label: 'Overview' }, // Or Dashboard
    { href: '/housekeeping/rooms', label: 'Rooms Management' },
    { href: '/housekeeping/tasks', label: 'Housekeeping Tasks' },
    { href: '/housekeeping/staff', label: 'Staff Directory' },
    { href: '/housekeeping/schedule', label: 'Cleaning Schedule' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-20 sticky top-0 md:h-screen flex-shrink-0 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="p-6 md:p-8 flex-shrink-0 border-b border-slate-800/60 relative">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                        HS
                    </div>
                    <h1 className="text-xl font-black tracking-tight text-white">SMART HOTEL</h1>
                </div>
                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase ml-11">Housekeeping</p>
            </div>
            <nav className="flex flex-col flex-1 overflow-y-auto p-4 gap-1 relative z-10">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`px-4 py-3 text-sm font-semibold transition-all duration-300 rounded-xl relative overflow-hidden group ${isActive
                                ? 'text-white shadow-md shadow-blue-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            {isActive && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100 transition-opacity" />}
                            <span className="relative z-10">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    );
}
