"use client";

import { useEffect, useState } from 'react';
import { ClipboardList, Plus, UserCircle, Bed, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { HousekeepingTask, Room, HousekeepingStaff } from '@/types';

export default function TasksPage() {
    const [tasks, setTasks] = useState<HousekeepingTask[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [staff, setStaff] = useState<HousekeepingStaff[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tasksRes, roomsRes, staffRes] = await Promise.all([
                api.get<HousekeepingTask[]>('/tasks'),
                api.get<Room[]>('/rooms'),
                api.get<HousekeepingStaff[]>('/staff')
            ]);
            setTasks(tasksRes.data);
            setRooms(roomsRes.data);
            setStaff(staffRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateTaskStatus = async (id: number, status: string) => {
        try {
            await api.put(`/tasks/${id}/status?status=${status}`);
            fetchData();
        } catch (error) {
            console.error('Failed to update task status', error);
        }
    };

    const getStaffName = (id: number) => {
        return staff.find(s => s.id === id)?.name || 'Unassigned';
    };

    const getRoomNumber = (id: number) => {
        return rooms.find(r => r.id === id)?.roomNumber || 'Unknown';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center card p-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Housekeeping Tasks</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Real-time System Status</p>
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
                        Create Task
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full p-12 text-center text-[hsl(var(--muted-foreground))] flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin mb-4"></div>
                        Loading tasks...
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="col-span-full card p-12 text-center flex flex-col items-center justify-center min-h-[300px] border-dashed bg-slate-50 border-slate-200">
                        <div className="w-16 h-16 bg-white shadow-sm text-blue-500 rounded-full flex items-center justify-center mb-6">
                            <ClipboardList className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-slate-800">No tasks assigned</h3>
                        <p className="text-slate-500 max-w-sm mb-8">Create a new housekeeping task to start assigning work to your staff.</p>
                        <button className="btn btn-primary gap-1.5 shadow-sm"><Plus className="w-4 h-4" /> Create Task</button>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} className="card p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${task.priority === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100' :
                                        task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            'bg-slate-50 text-slate-600 border-slate-100'
                                        }`}>
                                        {task.priority || 'NORMAL'}
                                    </span>

                                    <select
                                        className={`text-xs p-1.5 rounded-md border text-center font-medium outline-none transition-colors ${task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            task.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                task.status === 'CANCELLED' ? 'bg-slate-50 text-slate-600 border-slate-100' :
                                                    'bg-blue-50 text-blue-600 border-blue-100'
                                            } cursor-pointer hover:bg-white`}
                                        value={task.status}
                                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>

                                <h3 className="font-semibold text-lg mb-1 text-slate-800">{task.taskDescription}</h3>

                                <div className="space-y-2 mt-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Bed className="w-4 h-4 text-blue-500" />
                                        <span>Room <span className="font-semibold text-slate-800">{getRoomNumber(task.roomId)}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                                        <UserCircle className="w-4 h-4 text-emerald-500" />
                                        <span>{getStaffName(task.assignedStaffId)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                                        <Clock className="w-4 h-4 text-amber-500" />
                                        <span>Started: {new Date(task.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
