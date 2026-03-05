"use client";

import { useEffect, useState } from 'react';
import { Users, Plus, Phone, Clock, UserCheck, UserMinus, Activity } from 'lucide-react';
import { api } from '@/lib/api';
import { HousekeepingStaff } from '@/types';

export default function StaffPage() {
    const [staffMembers, setStaffMembers] = useState<HousekeepingStaff[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStaff = async () => {
        try {
            const res = await api.get<HousekeepingStaff[]>('/staff');
            setStaffMembers(res.data);
        } catch (error) {
            console.error('Failed to fetch staff', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'AVAILABLE': return <span className="bg-emerald-50 text-emerald-600 border-emerald-100 px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5"><UserCheck className="w-3 h-3" /> Available</span>;
            case 'BUSY': return <span className="bg-amber-50 text-amber-600 border-amber-100 px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5"><Activity className="w-3 h-3" /> Busy</span>;
            case 'OFF_DUTY': return <span className="bg-slate-50 text-slate-600 border-slate-200 px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5"><UserMinus className="w-3 h-3" /> Off Duty</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center card p-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Staff Directory</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Manage housekeeping personnel and shifts.</p>
                </div>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <div className="text-right hidden sm:block mr-4 border-r border-slate-200 pr-4">
                        <p className="font-bold text-sm text-slate-800 tracking-wide uppercase">Housekeeping Dept</p>
                        <div className="flex items-center gap-1.5 justify-end text-sm text-emerald-600 font-bold mt-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div> Online
                        </div>
                    </div>
                    <button className="btn btn-primary gap-2">
                        <Plus className="w-4 h-4" />
                        Add Staff Member
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading ? (
                    <div className="col-span-full p-12 text-center text-[hsl(var(--muted-foreground))] flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin mb-4"></div>
                        Loading staff...
                    </div>
                ) : staffMembers.length === 0 ? (
                    <div className="col-span-full card p-12 text-center flex flex-col items-center justify-center min-h-[300px] border-dashed bg-slate-50 border-slate-200">
                        <div className="w-16 h-16 bg-white shadow-sm text-blue-500 rounded-full flex items-center justify-center mb-6">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-slate-800">No staff members found</h3>
                        <p className="text-slate-500 max-w-sm mb-8">Add your housekeeping staff to start assigning them rooms and tasks.</p>
                        <button className="btn btn-primary gap-1.5 shadow-sm"><Plus className="w-4 h-4" /> Add Staff</button>
                    </div>
                ) : (
                    staffMembers.map((staff) => (
                        <div key={staff.id} className="card overflow-hidden flex flex-col">
                            <div className="h-20 bg-slate-100 border-b border-slate-200 relative flex items-center">
                                <div className="absolute -bottom-8 left-6 w-16 h-16 bg-blue-50 border-4 border-white rounded-full shadow-sm flex items-center justify-center text-xl font-bold text-blue-600">
                                    {staff.name.charAt(0)}
                                </div>
                            </div>
                            <div className="p-6 pt-12 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <h3 className="font-bold text-slate-800 text-lg">{staff.name}</h3>
                                    <p className="text-xs text-slate-500 mt-1">ID: #{staff.id}</p>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-700">{staff.phone || 'No phone number'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-700">Shift: <span className="font-medium text-slate-900">{staff.shift}</span></span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                    {getStatusBadge(staff.status)}
                                    <button className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors">View Profile</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
