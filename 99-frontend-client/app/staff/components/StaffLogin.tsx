"use client";

import { useState } from "react";
import type { AuthUser, Role } from "../page";

const CREDENTIALS: Record<string, { password: string; role: Role }> = {
    admin: { password: "admin123", role: "ADMIN" },
    manager: { password: "manager123", role: "MANAGER" },
    staff: { password: "staff123", role: "STAFF" },
};

const ROLE_CONFIG: Record<
    Role,
    { label: string; icon: string; color: string; desc: string }
> = {
    ADMIN: {
        label: "Admin",
        icon: "👑",
        color: "bg-blue-600 text-white",
        desc: "Full system access · Add, Edit, Delete staff",
    },
    MANAGER: {
        label: "Manager",
        icon: "🛂",
        color: "bg-teal-600 text-white",
        desc: "View & Edit staff · No delete permission",
    },
    STAFF: {
        label: "Staff",
        icon: "👤",
        color: "bg-slate-600 text-white",
        desc: "View-only access to staff records",
    },
};

export default function StaffLogin({
    onLogin,
}: {
    onLogin: (u: AuthUser) => void;
}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const cred = CREDENTIALS[username.toLowerCase()];
        if (!cred || cred.password !== password) {
            setError("Invalid username or password.");
            setLoading(false);
            return;
        }

        // Verify against backend
        try {
            const res = await fetch("http://localhost:8084/api/staff", {
                headers: {
                    Authorization:
                        "Basic " + btoa(`${username.toLowerCase()}:${password}`),
                },
            });
            if (res.ok || res.status === 403) {
                onLogin({
                    username: username.toLowerCase(),
                    password,
                    role: cred.role,
                });
            } else {
                setError("Backend authentication failed. Is the server running?");
            }
        } catch {
            setError(
                "Cannot reach backend at localhost:8084. Please start the staff service."
            );
        }
        setLoading(false);
    };

    const quickLogin = (role: Role) => {
        const entry = Object.entries(CREDENTIALS).find(
            ([, v]) => v.role === role
        )!;
        setUsername(entry[0]);
        setPassword(entry[1].password);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/5 rounded-full blur-3xl" />

            <div className="relative w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20 mb-4">
                        <span className="text-3xl text-white">🏨</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-800">Smart Hotel</h1>
                    <p className="text-slate-500 font-bold mt-1 text-sm tracking-wide uppercase">
                        Staff Management System
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-slate-800 font-bold text-lg mb-1">
                        Sign In to your account
                    </h2>
                    <p className="text-slate-500 text-sm font-medium mb-6">
                        Access is controlled by your role
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin / manager / staff"
                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium shadow-sm"
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                                <span className="text-red-600 text-sm font-bold">⚠️ {error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in…
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Quick login buttons */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 text-center">
                            Quick Demo Login
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            {(Object.entries(ROLE_CONFIG) as [Role, (typeof ROLE_CONFIG)[Role]][]).map(
                                ([role, conf]) => (
                                    <button
                                        key={role}
                                        onClick={() => quickLogin(role)}
                                        className={`flex flex-col items-center gap-1.5 p-3 ${conf.color} hover:brightness-110 shadow-sm rounded-xl transition-all`}
                                    >
                                        <span className="text-xl">{conf.icon}</span>
                                        <span className="text-xs font-bold">{conf.label}</span>
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Role permission guide */}
                <div className="mt-6 space-y-3">
                    {(Object.entries(ROLE_CONFIG) as [Role, (typeof ROLE_CONFIG)[Role]][]).map(
                        ([role, conf]) => (
                            <div
                                key={role}
                                className="flex items-center gap-4 px-5 py-3 bg-white shadow-sm rounded-xl border border-slate-200"
                            >
                                <span className="p-2 bg-slate-50 rounded-lg">{conf.icon}</span>
                                <div>
                                    <span className="text-slate-800 text-sm font-bold block mb-0.5">
                                        {conf.label}
                                    </span>
                                    <span className="text-slate-500 text-xs font-medium">{conf.desc}</span>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
