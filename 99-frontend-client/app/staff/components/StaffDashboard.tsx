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
    { label: string; icon: string; bg: string; text: string; border: string }
> = {
    ADMIN: { label: "Administrator", icon: "👑", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
    MANAGER: { label: "Manager", icon: "🛂", bg: "bg-teal-100", text: "text-teal-700", border: "border-teal-200" },
    STAFF: { label: "Staff", icon: "👤", bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
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
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
            {/* Toast */}
            {toast && (
                <div
                    className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border transition-all duration-300 ${toast.type === "success"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-red-50 border-red-200 text-red-800"
                        }`}
                >
                    <span className="text-lg">{toast.type === "success" ? "✅" : "❌"}</span>
                    <span className="text-sm font-medium">{toast.msg}</span>
                </div>
            )}

            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <span className="text-xl">🏨</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 leading-tight">Staff Management</h1>
                        <p className="text-slate-500 text-xs">Smart Hotel Control Panel</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${rb.bg} ${rb.border} ${rb.text} text-sm font-medium`}>
                        <span>{rb.icon}</span>
                        <span>{rb.label}</span>
                        <span className="text-slate-400 hidden sm:inline">|</span>
                        <span className="hidden sm:inline text-xs font-semibold">{authUser.username}</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-800 text-sm font-medium transition-all shadow-sm"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Permissions banner */}
            <div className="px-6 pt-6 pb-2">
                <div className={`flex flex-wrap items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm`}>
                    <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                        <span className="p-1.5 rounded-md bg-slate-100">{rb.icon}</span>
                        {rb.label} Permissions:
                    </span>
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
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${activeTab === tab
                            ? "bg-blue-600 text-white shadow-blue-500/30"
                            : "bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200"
                            }`}
                    >
                        {tab === "list" ? "👥 Staff List" : "📊 Statistics"}
                    </button>
                ))}
            </div>

            <div className="flex-1 px-6 py-6 space-y-6">
                {activeTab === "list" ? (
                    <>
                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="relative flex-1 w-full">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or role…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm font-medium"
                                />
                            </div>
                            <div className="w-full sm:w-48 relative">
                                <select
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all appearance-none"
                                >
                                    {uniqueRoles.map((r) => (
                                        <option key={r} value={r}>
                                            {r === "All" ? "Filter: All Roles" : r}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
                            </div>
                            {canCreate(authUser.role) && (
                                <button
                                    onClick={() => setModalState({ open: true, mode: "add" })}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all text-sm whitespace-nowrap"
                                >
                                    <span>＋</span> Add Staff
                                </button>
                            )}
                        </div>

                        {/* Summary chips */}
                        <div className="flex flex-wrap gap-2 px-1">
                            <Chip label={`${staffList.length} Total`} color="bg-blue-50 text-blue-700 border-blue-200" />
                            <Chip label={`${filtered.length} Shown`} color="bg-slate-100 text-slate-600 border-slate-200" />
                            {search && <Chip label={`Filter: "${search}"`} color="bg-amber-50 text-amber-700 border-amber-200" />}
                        </div>

                        {/* Table / Error / Loader */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
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
                        </div>
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
            className={`text-xs px-3 py-1.5 rounded-lg font-bold border ${allowed
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-50 text-slate-400 border-slate-200 opacity-70"
                }`}
        >
            <span className="mr-1">{allowed ? "✓" : "✕"}</span> {label}
        </span>
    );
}

function Chip({ label, color }: { label: string; color: string }) {
    return (
        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${color}`}>
            {label}
        </span>
    );
}

function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-500 text-sm font-medium">Loading staff records…</p>
        </div>
    );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-3xl">⚠️</div>
            <div className="text-center">
                <p className="text-red-600 font-bold">Failed to load staff</p>
                <p className="text-slate-500 text-sm mt-1">{message}</p>
            </div>
            <button
                onClick={onRetry}
                className="px-5 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold rounded-xl text-sm transition"
            >
                Retry Request
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
        "bg-blue-50 text-blue-700 border-blue-200",
        "bg-teal-50 text-teal-700 border-teal-200",
        "bg-violet-50 text-violet-700 border-violet-200",
        "bg-amber-50 text-amber-700 border-amber-200",
        "bg-rose-50 text-rose-700 border-rose-200",
        "bg-indigo-50 text-indigo-700 border-indigo-200",
        "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Total Staff" value={total} icon="👥" color="bg-blue-600" />
                <StatCard label="Job Roles" value={present.length} icon="🏷️" color="bg-slate-800" />
                <StatCard
                    label="Most Common"
                    value={present.sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—"}
                    icon="⭐"
                    color="bg-blue-500"
                />
                <StatCard label="System" value="Online" icon="🟢" color="bg-emerald-600" />
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-slate-800 font-bold mb-5 flex items-center gap-2 text-lg">
                    <span>📊</span> Staff by Job Role
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.entries(stats.byRole).map(([role, count], i) => (
                        <div
                            key={role}
                            className={`p-5 rounded-xl border ${colors[i % colors.length]} ${count === 0 ? "opacity-50 grayscale" : ""}`}
                        >
                            <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">{role}</p>
                            <p className="text-3xl font-black">{count}</p>
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
            className={`${color} rounded-2xl p-6 shadow-md text-white`}
        >
            <div className="text-2xl mb-3">{icon}</div>
            <p className="text-white/80 text-xs font-bold uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-black mt-1">{value}</p>
        </div>
    );
}
