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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-slate-800 font-bold text-lg">
                                {mode === "add" ? "➕ Add New Staff" : "✏️ Edit Staff Member"}
                            </h2>
                            <p className="text-slate-500 text-sm mt-0.5 font-medium">
                                {mode === "add"
                                    ? "Fill in the details for the new staff member"
                                    : `Editing: ${initialData?.name}`}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all text-lg shadow-sm"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g. Kasun Perera"
                            className={`w-full px-4 py-3 bg-white border ${fieldErr.name ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-300 focus:ring-blue-600/20 focus:border-blue-600"} rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm font-medium shadow-sm`}
                        />
                        {fieldErr.name && (
                            <p className="text-red-500 text-xs font-bold mt-1.5">{fieldErr.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="kasun@smarthotel.lk"
                            className={`w-full px-4 py-3 bg-white border ${fieldErr.email ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-300 focus:ring-blue-600/20 focus:border-blue-600"} rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm font-medium shadow-sm`}
                        />
                        {fieldErr.email && (
                            <p className="text-red-500 text-xs font-bold mt-1.5">{fieldErr.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">
                            Job Role <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm font-medium shadow-sm appearance-none"
                            >
                                {jobRoles.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 rounded-xl text-sm font-bold transition-all shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
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
