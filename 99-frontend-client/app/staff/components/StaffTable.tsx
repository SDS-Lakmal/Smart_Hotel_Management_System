"use client";

import type { Role } from "../page";
import { canEdit, canDelete, type StaffMember } from "../lib/staffApi";

const ROLE_AVATAR_COLORS = [
    "bg-blue-100 text-blue-700",
    "bg-teal-100 text-teal-700",
    "bg-indigo-100 text-indigo-700",
    "bg-purple-100 text-purple-700",
    "bg-rose-100 text-rose-700",
    "bg-emerald-100 text-emerald-700",
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
            <div className="flex flex-col items-center justify-center py-20 gap-3 border-t border-slate-200">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">
                    👥
                </div>
                <p className="text-slate-800 font-bold">No staff found</p>
                <p className="text-slate-500 text-sm">Try adjusting your search or add a new member</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-left">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            #
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Staff Member
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Job Role
                        </th>
                        {(canEdit(authRole) || canDelete(authRole)) && (
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {staff.map((s, idx) => (
                        <tr
                            key={s.id}
                            className="hover:bg-slate-50 transition-colors group"
                        >
                            <td className="px-6 py-4 text-slate-400 font-medium text-sm">{idx + 1}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-10 h-10 rounded-xl ${getColor(s.name)} flex items-center justify-center font-black text-sm shrink-0 shadow-sm`}
                                    >
                                        {s.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-slate-800 font-bold text-sm tracking-tight">{s.name}</p>
                                        <p className="text-slate-500 text-xs font-medium">ID #{s.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-slate-600 text-sm font-medium">{s.email}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                                    {s.role}
                                </span>
                            </td>
                            {(canEdit(authRole) || canDelete(authRole)) && (
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        {canEdit(authRole) && (
                                            <button
                                                onClick={() => onEdit(s)}
                                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-transparent hover:border-blue-200 rounded-lg text-xs font-bold transition-all sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                                                title="Edit staff member"
                                            >
                                                ✏️ Edit
                                            </button>
                                        )}
                                        {canDelete(authRole) && (
                                            <button
                                                onClick={() => onDelete(s)}
                                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-transparent hover:border-red-200 rounded-lg text-xs font-bold transition-all sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
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

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
                <p className="text-slate-500 text-xs font-medium">
                    Showing {staff.length} staff member{staff.length !== 1 ? "s" : ""}
                </p>
            </div>
        </div>
    );
}
