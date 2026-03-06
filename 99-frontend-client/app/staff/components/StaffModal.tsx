"use client";

import { useState, useEffect } from "react";
import type { StaffMember } from "../lib/staffApi";

export default function StaffModal({
    mode,
    initialData,
    jobRoles,
    onSave,
    onClose,
}: {
    mode: "add" | "edit";
    initialData?: StaffMember;
    jobRoles: string[];
    onSave: (data: StaffMember) => Promise<void>;
    onClose: () => void;
}) {
    const [form, setForm] = useState<StaffMember>({
        name: "",
        role: jobRoles[0],
        email: "",
    });
    const [saving, setSaving] = useState(false);
    const [fieldErr, setFieldErr] = useState<Partial<StaffMember>>({});

    useEffect(() => {
        if (initialData) setForm(initialData);
    }, [initialData]);

    const validate = () => {
        const errors: Partial<StaffMember> = {};
        if (!form.name.trim()) errors.name = "Name is required";
        if (!form.email.trim()) errors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            errors.email = "Enter a valid email";
        if (!form.role) errors.role = "Role is required";
        setFieldErr(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        await onSave(form);
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-violet-900/40 to-purple-900/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-white font-bold text-lg">
                                {mode === "add" ? "➕ Add New Staff" : "✏️ Edit Staff Member"}
                            </h2>
                            <p className="text-slate-400 text-sm mt-0.5">
                                {mode === "add"
                                    ? "Fill in the details for the new staff member"
                                    : `Editing: ${initialData?.name}`}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all text-lg"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g. Kasun Perera"
                            className={`w-full px-4 py-3 bg-slate-800 border ${fieldErr.name ? "border-red-500" : "border-slate-700"
                                } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-sm`}
                        />
                        {fieldErr.name && (
                            <p className="text-red-400 text-xs mt-1">{fieldErr.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="kasun@smarthotel.lk"
                            className={`w-full px-4 py-3 bg-slate-800 border ${fieldErr.email ? "border-red-500" : "border-slate-700"
                                } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-sm`}
                        />
                        {fieldErr.email && (
                            <p className="text-red-400 text-xs mt-1">{fieldErr.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Job Role <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-sm"
                        >
                            {jobRoles.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-900/30 transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving…
                                </>
                            ) : mode === "add" ? (
                                "Add Staff Member"
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
