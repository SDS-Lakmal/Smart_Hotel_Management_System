"use client";

import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, ClipboardList, Bed, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { CleaningSchedule, Room, HousekeepingTask } from '@/types';

export default function SchedulePage() {
    const [schedules, setSchedules] = useState<CleaningSchedule[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [tasks, setTasks] = useState<HousekeepingTask[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSchedule = async () => {
        try {
            const [scheduleRes, roomsRes, tasksRes] = await Promise.all([
                api.get<CleaningSchedule[]>('/schedule/today'),
                api.get<Room[]>('/rooms'),
                api.get<HousekeepingTask[]>('/tasks')
            ]);
            setSchedules(scheduleRes.data);
            setRooms(roomsRes.data);
            setTasks(tasksRes.data);
        } catch (error) {
            console.error('Failed to fetch schedule', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const getRoom = (id: number) => rooms.find(r => r.id === id);
    const getTask = (id: number) => tasks.find(t => t.id === id);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center card p-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Daily Cleaning Schedule</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Today&apos;s scheduled activities and priorities.</p>
                </div>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <div className="text-right hidden sm:block mr-4 border-r border-slate-200 pr-4">
                        <p className="font-bold text-sm text-slate-800 tracking-wide uppercase">Housekeeping Dept</p>
                        <div className="flex items-center gap-1.5 justify-end text-sm text-emerald-600 font-bold mt-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div> Online
                        </div>
                    </div>
                    <button className="btn btn-primary gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        Plan Tomorrow
                    </button>
                </div>
            </div>

            <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6 mt-8 space-y-8">
                {loading ? (
                    <div className="pl-6 text-center text-[hsl(var(--muted-foreground))] flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin mb-4"></div>
                        Loading schedule...
                    </div>
                ) : schedules.length === 0 ? (
                    <div className="pl-6 card p-12 text-center flex flex-col items-center justify-center min-h-[300px] ml-4 border-l-0 border-dashed bg-slate-50">
                        <div className="w-16 h-16 bg-white shadow-sm text-blue-500 rounded-full flex items-center justify-center mb-6">
                            <CalendarIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-slate-800">No schedule for today</h3>
                        <p className="text-slate-500 max-w-sm mb-8">There are no cleaning tasks scheduled for today. Kick back and relax, or assign some tasks manually.</p>
                        <button className="btn btn-primary gap-1.5 shadow-sm"><Plus className="w-4 h-4" /> Add Schedule Item</button>
                    </div>
                ) : (
                    schedules.map((schedule) => {
                        const room = getRoom(schedule.roomId);
                        const task = getTask(schedule.taskId);
                        return (
                            <div key={schedule.id} className="relative pl-8 md:pl-10 group/timeline">
                                <div className="absolute -left-[11px] top-6 w-5 h-5 rounded-full border-4 border-white bg-blue-500 shadow-sm transition-transform duration-300 group-hover:scale-125" />
                                <div className="card p-6 md:p-8 bg-white">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-100 p-2 rounded-md text-slate-600 font-semibold flex items-center gap-2">
                                                <Bed className="w-5 h-5" /> Room {room?.roomNumber || 'Unknown'}
                                            </div>
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${schedule.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                schedule.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                {schedule.status}
                                            </span>
                                        </div>
                                    </div>

                                    {task && (
                                        <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-white p-2 text-slate-500 rounded-md border border-slate-200">
                                                    <ClipboardList className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800 text-base">{task.taskDescription}</p>
                                                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Priority: <span className={task.priority === 'HIGH' ? 'font-bold text-red-500' : task.priority === 'MEDIUM' ? 'font-bold text-amber-500' : 'font-bold text-slate-500'}>{task.priority}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
