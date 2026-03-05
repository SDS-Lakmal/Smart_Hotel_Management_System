"use client";

import { useEffect, useState } from 'react';
import { Bed, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { Room, HousekeepingTask } from '@/types';

export default function Dashboard() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [tasks, setTasks] = useState<HousekeepingTask[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomsRes, tasksRes] = await Promise.all([
                    api.get<Room[]>('/rooms'),
                    api.get<HousekeepingTask[]>('/tasks')
                ]);
                setRooms(roomsRes.data);
                setTasks(tasksRes.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalRooms = rooms.length;
    const dirtyRooms = rooms.filter(r => r.status === 'DIRTY').length;
    const inProgressRooms = rooms.filter(r => r.status === 'IN_PROGRESS').length;
    const completedToday = tasks.filter(t => t.status === 'COMPLETED').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const stats = [
        { label: 'Total Rooms', value: totalRooms, icon: Bed, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Dirty Rooms', value: dirtyRooms, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
        { label: 'In Progress', value: inProgressRooms, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Completed Today', value: completedToday, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center card p-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Housekeeping Overview</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Real-time System Status</p>
                </div>
                <div className="text-right mt-4 sm:mt-0">
                    <p className="font-bold text-sm text-slate-800 tracking-wide uppercase">Housekeeping Dept</p>
                    <div className="flex items-center gap-1.5 justify-end text-sm text-emerald-600 font-bold mt-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div> Online
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="card p-6 flex flex-col gap-4 group">
                        <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-all duration-500 group-hover:opacity-40 ${stat.bg.replace('bg-', 'bg-')}`} />
                        <div className="flex items-center justify-between relative z-10">
                            <span className="font-bold text-slate-500">{stat.label}</span>
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-110 shadow-sm border border-white/50`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-4xl font-black text-slate-800 tracking-tight relative z-10">
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card p-6">
                    <h2 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        Recent Rooms Needing Attention
                    </h2>
                    {rooms.filter(r => r.status === 'DIRTY').length > 0 ? (
                        <div className="space-y-4">
                            {rooms.filter(r => r.status === 'DIRTY').slice(0, 5).map(room => (
                                <div key={room.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors shadow-sm hover:shadow-md group/item">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover/item:scale-110 transition-transform">
                                            <Bed className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-800">Room {room.roomNumber}</p>
                                            <p className="text-xs font-medium text-slate-500 mt-0.5">Floor {room.floor} • {room.type}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] uppercase font-bold tracking-wider rounded-full border border-red-100/50 shadow-sm">
                                        Dirty
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-[hsl(var(--muted-foreground))]">
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-emerald-500 opacity-20" />
                            <p>No dirty rooms at the moment. Great job!</p>
                        </div>
                    )}
                </div>

                <div className="card p-6 flex flex-col">
                    <h2 className="text-lg font-bold mb-6 text-slate-800">Quick Actions</h2>
                    <div className="space-y-3 flex-1 flex flex-col justify-center">
                        <button className="w-full btn btn-primary flex justify-between items-center group">
                            <span>Assign New Task</span>
                            <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">→</span>
                        </button>
                        <button className="w-full btn bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/50 flex justify-between items-center group">
                            <span>View Daily Schedule</span>
                            <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-bold">→</span>
                        </button>
                        <button className="w-full btn bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/50 flex justify-between items-center group">
                            <span>Add Staff Member</span>
                            <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-bold">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
