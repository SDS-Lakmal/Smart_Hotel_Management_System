"use client";

import type { Role } from "../page";
import { canEdit, canDelete, type StaffMember } from "../lib/staffApi";

const ROLE_AVATAR_COLORS = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-sky-500 to-indigo-600",
];

function getColor(name: string) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return ROLE_AVATAR_COLORS[Math.abs(h) % ROLE_AVATAR_COLORS.length];
}

export default function StaffTable({
    staff,
    authRole,
    onEdit,
    onDelete,
}: {
    staff: StaffMember[];
    authRole: Role;
    onEdit: (s: StaffMember) => void;
    onDelete: (s: StaffMember) => void;
}) {
    if (staff.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl">
                    👥
                </div>
                <p className="text-slate-400 font-medium">No staff found</p>
                <p className="text-slate-600 text-sm">Try adjusting your search or add a new member</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-800/70 text-left">
                            <th className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                #
                            </th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Staff Member
                            </th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Job Role
                            </th>
                            {(canEdit(authRole) || canDelete(authRole)) && (
                                <th className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {staff.map((s, idx) => (
                            <tr
                                key={s.id}
                                className="hover:bg-slate-800/40 transition-colors group"
                            >
                                <td className="px-5 py-4 text-slate-600 text-sm">{idx + 1}</td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getColor(s.name)} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                                        >
                                            {s.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{s.name}</p>
                                            <p className="text-slate-500 text-xs">ID #{s.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="text-slate-300 text-sm">{s.email}</span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                                        {s.role}
                                    </span>
                                </td>
                                {(canEdit(authRole) || canDelete(authRole)) && (
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {canEdit(authRole) && (
                                                <button
                                                    onClick={() => onEdit(s)}
                                                    className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 rounded-lg text-xs font-medium transition-all opacity-0 group-hover:opacity-100"
                                                    title="Edit staff member"
                                                >
                                                    ✏️ Edit
                                                </button>
                                            )}
                                            {canDelete(authRole) && (
                                                <button
                                                    onClick={() => onDelete(s)}
                                                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 rounded-lg text-xs font-medium transition-all opacity-0 group-hover:opacity-100"
                                                    title="Delete staff member"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-5 py-3 bg-slate-800/30 border-t border-slate-800">
                <p className="text-slate-500 text-xs">
                    Showing {staff.length} staff member{staff.length !== 1 ? "s" : ""}
                </p>
            </div>
        </div>
    );
}
