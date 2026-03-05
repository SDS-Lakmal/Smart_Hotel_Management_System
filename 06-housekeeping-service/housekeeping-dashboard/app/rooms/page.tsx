"use client";

import { useEffect, useState } from 'react';
import { Bed, Plus, CheckCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { Room } from '@/types';

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const res = await api.get<Room[]>('/rooms');
            setRooms(res.data);
        } catch (error) {
            console.error('Failed to fetch rooms', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const updateRoomStatus = async (id: number, status: Room['status']) => {
        try {
            const roomToUpdate = rooms.find(r => r.id === id);
            if (!roomToUpdate) return;
            await api.put(`/rooms/${id}`, { ...roomToUpdate, status });
            fetchRooms(); // refresh list
        } catch (error) {
            console.error('Failed to update room status', error);
        }
    };

    const getStatusIcon = (status: Room['status']) => {
        switch (status) {
            case 'CLEAN': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            case 'DIRTY': return <AlertTriangle className="w-4 h-4 text-red-500" />;
            case 'IN_PROGRESS': return <Clock className="w-4 h-4 text-amber-500" />;
            case 'INSPECTED': return <CheckCircle className="w-4 h-4 text-blue-500" />;
        }
    };

    const getStatusBadgeClass = (status: Room['status']) => {
        switch (status) {
            case 'CLEAN': return 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm';
            case 'DIRTY': return 'bg-red-50 text-red-600 border-red-100 shadow-sm';
            case 'IN_PROGRESS': return 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm';
            case 'INSPECTED': return 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center card p-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Rooms Management</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Real-time System Status</p>
                </div>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <div className="text-right hidden sm:block mr-4 border-r border-slate-200 pr-4">
                        <p className="font-bold text-sm text-slate-800 tracking-wide uppercase">Housekeeping Dept</p>
                        <div className="flex items-center gap-1.5 justify-end text-sm text-emerald-600 font-bold mt-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div> Online
                        </div>
                    </div>
                    <button onClick={fetchRooms} className="btn bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm p-2 w-10 h-10" title="Refresh">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} />
                    </button>
                    <button className="btn btn-primary gap-2">
                        <Plus className="w-4 h-4" />
                        Add Room
                    </button>
                </div>
            </div>

            <div className="card">
                {loading ? (
                    <div className="p-8 text-center text-[hsl(var(--muted-foreground))]">Loading rooms...</div>
                ) : rooms.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <Bed className="w-12 h-12 text-[hsl(var(--muted-foreground))] mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-[hsl(var(--foreground))]">No rooms found</h3>
                        <p className="text-[hsl(var(--muted-foreground))] mb-6">Get started by creating a new room.</p>
                        <button className="btn btn-primary gap-2"><Plus className="w-4 h-4" /> Add Room</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-slate-50/50 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-bold tracking-wider">Room</th>
                                    <th scope="col" className="px-6 py-4 font-bold tracking-wider">Type</th>
                                    <th scope="col" className="px-6 py-4 font-bold tracking-wider">Floor</th>
                                    <th scope="col" className="px-6 py-4 font-bold tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-4 font-bold tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rooms.map((room) => (
                                    <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-slate-100 text-slate-600 rounded-md">
                                                    <Bed className="w-4 h-4" />
                                                </div>
                                                {room.roomNumber}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[hsl(var(--muted-foreground))]">
                                            {room.type}
                                        </td>
                                        <td className="px-6 py-4 text-[hsl(var(--muted-foreground))]">
                                            {room.floor}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${getStatusBadgeClass(room.status)}`}>
                                                {getStatusIcon(room.status)}
                                                {room.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-32 p-2 cursor-pointer outline-none shadow-sm hover:border-slate-300 transition-colors"
                                                value={room.status}
                                                onChange={(e) => updateRoomStatus(room.id, e.target.value as Room['status'])}
                                            >
                                                <option value="CLEAN">Clean</option>
                                                <option value="DIRTY">Dirty</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="INSPECTED">Inspected</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
