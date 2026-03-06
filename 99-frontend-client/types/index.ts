export interface Room {
    id: number;
    roomNumber: string;
    floor: number;
    type: string;
    status: 'CLEAN' | 'DIRTY' | 'IN_PROGRESS' | 'INSPECTED';
    lastCleaned: string;
}

export interface HousekeepingTask {
    id: number;
    roomId: number;
    taskDescription: string;
    assignedStaffId: number;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    priority: string;
    createdAt: string;
    completedAt: string;
}

export interface HousekeepingStaff {
    id: number;
    name: string;
    phone: string;
    shift: string;
    status: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY';
}

export interface CleaningSchedule {
    id: number;
    roomId: number;
    scheduledDate: string;
    taskId: number;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}
