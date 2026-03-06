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
        color: "from-violet-600 to-purple-700",
        desc: "Full system access · Add, Edit, Delete staff",
    },
    MANAGER: {
        label: "Manager",
        icon: "🛂",
        color: "from-blue-600 to-cyan-600",
        desc: "View & Edit staff · No delete permission",
    },
    STAFF: {
        label: "Staff",
        icon: "👤",
        color: "from-emerald-600 to-teal-600",
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            {/* Glow orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-2xl mb-4">
                        <span className="text-3xl">🏨</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Smart Hotel</h1>
                    <p className="text-slate-400 mt-1 text-sm tracking-wide">
                        Staff Management System
                    </p>
                </div>

                {/* Card */}
                <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-white font-semibold text-lg mb-1">
                        Sign In to your account
                    </h2>
                    <p className="text-slate-400 text-sm mb-6">
                        Access is controlled by your role
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin / manager / staff"
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                                <span className="text-red-400 text-sm">⚠️ {error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-900/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    <div className="mt-6 pt-6 border-t border-slate-700">
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-3">
                            Quick Demo Login
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {(Object.entries(ROLE_CONFIG) as [Role, (typeof ROLE_CONFIG)[Role]][]).map(
                                ([role, conf]) => (
                                    <button
                                        key={role}
                                        onClick={() => quickLogin(role)}
                                        className={`flex flex-col items-center gap-1 p-2.5 bg-gradient-to-b ${conf.color} opacity-80 hover:opacity-100 rounded-xl transition-all text-white`}
                                    >
                                        <span className="text-xl">{conf.icon}</span>
                                        <span className="text-xs font-semibold">{conf.label}</span>
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Role permission guide */}
                <div className="mt-4 space-y-2">
                    {(Object.entries(ROLE_CONFIG) as [Role, (typeof ROLE_CONFIG)[Role]][]).map(
                        ([role, conf]) => (
                            <div
                                key={role}
                                className="flex items-center gap-3 px-4 py-2 bg-slate-800/30 rounded-xl border border-slate-700/30"
                            >
                                <span>{conf.icon}</span>
                                <div>
                                    <span className="text-white text-xs font-semibold">
                                        {conf.label}
                                    </span>
                                    <span className="text-slate-500 text-xs"> · {conf.desc}</span>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
