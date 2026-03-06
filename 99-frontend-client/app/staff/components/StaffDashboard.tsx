"use client";

import { useEffect, useState, useCallback } from "react";
import type { AuthUser, Role } from "../page";
import {
    getAllStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    canCreate,
    canEdit,
    canDelete,
    type StaffMember,
} from "../lib/staffApi";
import StaffModal from "./StaffModal";
import StaffTable from "./StaffTable";
import ConfirmDialog from "./ConfirmDialog";

const ROLE_BADGE: Record<
    Role,
    { label: string; icon: string; bg: string; text: string }
> = {
    ADMIN: { label: "Administrator", icon: "👑", bg: "bg-violet-500/20", text: "text-violet-300" },
    MANAGER: { label: "Manager", icon: "🛂", bg: "bg-blue-500/20", text: "text-blue-300" },
    STAFF: { label: "Staff", icon: "👤", bg: "bg-emerald-500/20", text: "text-emerald-300" },
};

const JOB_ROLES = [
    "Receptionist",
    "Housekeeping",
    "Chef",
    "Waiter",
    "Security",
    "Maintenance",
    "Manager",
    "Accountant",
];

export default function StaffDashboard({
    authUser,
    onLogout,
}: {
    authUser: AuthUser;
    onLogout: () => void;
}) {
    const [staffList, setStaffList] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("All");
    const [modalState, setModalState] = useState<{
        open: boolean;
        mode: "add" | "edit";
        staff?: StaffMember;
    }>({ open: false, mode: "add" });
    const [confirmDelete, setConfirmDelete] = useState<StaffMember | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [activeTab, setActiveTab] = useState<"list" | "stats">("list");

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchStaff = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getAllStaff(authUser);
            setStaffList(data);
        } catch (e: unknown) {
            if (e instanceof Error) setError(e.message);
        }
        setLoading(false);
    }, [authUser]);

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

    const handleSave = async (data: StaffMember) => {
        try {
            if (modalState.mode === "add") {
                await createStaff(authUser, data);
                showToast("Staff member added successfully!", "success");
            } else if (modalState.mode === "edit" && modalState.staff?.id != null) {
                await updateStaff(authUser, modalState.staff.id, data);
                showToast("Staff member updated successfully!", "success");
            }
            setModalState({ open: false, mode: "add" });
            fetchStaff();
        } catch (e: unknown) {
            if (e instanceof Error) showToast(e.message, "error");
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete?.id) return;
        try {
            await deleteStaff(authUser, confirmDelete.id);
            showToast("Staff member deleted.", "success");
            setConfirmDelete(null);
            fetchStaff();
        } catch (e: unknown) {
            if (e instanceof Error) showToast(e.message, "error");
        }
    };

    const filtered = staffList.filter((s) => {
        const matchSearch =
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase()) ||
            s.role.toLowerCase().includes(search.toLowerCase());
        const matchRole = filterRole === "All" || s.role === filterRole;
        return matchSearch && matchRole;
    });

    const uniqueRoles = ["All", ...Array.from(new Set(staffList.map((s) => s.role)))];

    const stats = {
        total: staffList.length,
        byRole: JOB_ROLES.reduce((acc, r) => {
            acc[r] = staffList.filter((s) => s.role === r).length;
            return acc;
        }, {} as Record<string, number>),
    };

    const rb = ROLE_BADGE[authUser.role];

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            {/* Toast */}
            {toast && (
                <div
                    className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border transition-all duration-300 ${toast.type === "success"
                            ? "bg-emerald-900/80 border-emerald-500/40 text-emerald-200"
                            : "bg-red-900/80 border-red-500/40 text-red-200"
                        } backdrop-blur-md`}
                >
                    <span className="text-lg">{toast.type === "success" ? "✅" : "❌"}</span>
                    <span className="text-sm font-medium">{toast.msg}</span>
                </div>
            )}

            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <span className="text-xl">🏨</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white leading-tight">Staff Management</h1>
                        <p className="text-slate-500 text-xs">Smart Hotel Control Panel</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${rb.bg} ${rb.text} text-sm font-medium`}>
                        <span>{rb.icon}</span>
                        <span>{rb.label}</span>
                        <span className="text-slate-500 hidden sm:inline">·</span>
                        <span className="text-slate-400 hidden sm:inline text-xs">{authUser.username}</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-400 hover:text-white text-sm transition-all"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Permissions banner */}
            <div className="px-6 pt-4">
                <div className={`flex flex-wrap items-center gap-3 p-3 rounded-xl ${rb.bg} border border-white/5`}>
                    <span className="text-sm font-semibold text-white">{rb.icon} {rb.label} Permissions:</span>
                    <PermBadge allowed={true} label="View Staff" />
                    <PermBadge allowed={canCreate(authUser.role)} label="Add Staff" />
                    <PermBadge allowed={canEdit(authUser.role)} label="Edit Staff" />
                    <PermBadge allowed={canDelete(authUser.role)} label="Delete Staff" />
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-4 flex gap-2">
                {(["list", "stats"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                                ? "bg-violet-600 text-white"
                                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                            }`}
                    >
                        {tab === "list" ? "👥 Staff List" : "📊 Statistics"}
                    </button>
                ))}
            </div>

            <div className="flex-1 px-6 py-4 space-y-4">
                {activeTab === "list" ? (
                    <>
                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or role…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                                />
                            </div>
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                            >
                                {uniqueRoles.map((r) => (
                                    <option key={r} value={r}>
                                        {r === "All" ? "All Roles" : r}
                                    </option>
                                ))}
                            </select>
                            {canCreate(authUser.role) && (
                                <button
                                    onClick={() => setModalState({ open: true, mode: "add" })}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-900/30 transition-all text-sm"
                                >
                                    <span>＋</span> Add Staff
                                </button>
                            )}
                        </div>

                        {/* Summary chips */}
                        <div className="flex flex-wrap gap-2">
                            <Chip label={`${staffList.length} Total`} color="bg-slate-700" />
                            <Chip label={`${filtered.length} Shown`} color="bg-violet-700/50" />
                            {search && <Chip label={`Filter: "${search}"`} color="bg-amber-700/40" />}
                        </div>

                        {/* Table / Error / Loader */}
                        {loading ? (
                            <LoadingState />
                        ) : error ? (
                            <ErrorState message={error} onRetry={fetchStaff} />
                        ) : (
                            <StaffTable
                                staff={filtered}
                                authRole={authUser.role}
                                onEdit={(s) => setModalState({ open: true, mode: "edit", staff: s })}
                                onDelete={(s) => setConfirmDelete(s)}
                            />
                        )}
                    </>
                ) : (
                    <StatsView stats={stats} total={staffList.length} />
                )}
            </div>

            {/* Modals */}
            {modalState.open && (
                <StaffModal
                    mode={modalState.mode}
                    initialData={modalState.staff}
                    jobRoles={JOB_ROLES}
                    onSave={handleSave}
                    onClose={() => setModalState({ open: false, mode: "add" })}
                />
            )}
            {confirmDelete && (
                <ConfirmDialog
                    name={confirmDelete.name}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </div>
    );
}

function PermBadge({ allowed, label }: { allowed: boolean; label: string }) {
    return (
        <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${allowed
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-red-500/10 text-red-400 border border-red-500/20 line-through opacity-60"
                }`}
        >
            {allowed ? "✓" : "✗"} {label}
        </span>
    );
}

function Chip({ label, color }: { label: string; color: string }) {
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${color}`}>
            {label}
        </span>
    );
}

function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading staff records…</p>
        </div>
    );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-3xl">⚠️</div>
            <div className="text-center">
                <p className="text-red-400 font-medium">Failed to load staff</p>
                <p className="text-slate-500 text-sm mt-1">{message}</p>
            </div>
            <button
                onClick={onRetry}
                className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-sm hover:bg-red-500/30 transition"
            >
                Retry
            </button>
        </div>
    );
}

function StatsView({
    stats,
    total,
}: {
    stats: { total: number; byRole: Record<string, number> };
    total: number;
}) {
    const present = Object.entries(stats.byRole).filter(([, c]) => c > 0);
    const colors = [
        "from-violet-500 to-purple-600",
        "from-blue-500 to-cyan-600",
        "from-emerald-500 to-teal-600",
        "from-amber-500 to-orange-600",
        "from-rose-500 to-pink-600",
        "from-sky-500 to-indigo-600",
        "from-fuchsia-500 to-pink-600",
        "from-lime-500 to-green-600",
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Total Staff" value={total} icon="👥" color="from-violet-600 to-purple-700" />
                <StatCard label="Job Roles" value={present.length} icon="🏷️" color="from-blue-600 to-cyan-700" />
                <StatCard
                    label="Most Common"
                    value={present.sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—"}
                    icon="⭐"
                    color="from-amber-600 to-orange-700"
                />
                <StatCard label="System" value="Online" icon="🟢" color="from-emerald-600 to-teal-700" />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <span>📊</span> Staff by Job Role
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(stats.byRole).map(([role, count], i) => (
                        <div
                            key={role}
                            className={`p-4 rounded-xl bg-gradient-to-br ${colors[i % colors.length]} opacity-${count > 0 ? "100" : "30"}`}
                        >
                            <p className="text-white/80 text-xs font-medium">{role}</p>
                            <p className="text-white text-3xl font-bold mt-1">{count}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatCard({
    label,
    value,
    icon,
    color,
}: {
    label: string;
    value: number | string;
    icon: string;
    color: string;
}) {
    return (
        <div
            className={`bg-gradient-to-br ${color} rounded-2xl p-5 shadow-xl`}
        >
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{label}</p>
            <p className="text-white text-2xl font-bold mt-1">{value}</p>
        </div>
    );
}
