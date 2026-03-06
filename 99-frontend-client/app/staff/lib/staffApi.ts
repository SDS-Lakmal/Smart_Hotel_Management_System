import type { AuthUser, Role } from "../page";

const BASE = "http://localhost:8084/api/staff";

function authHeader(user: AuthUser) {
    return {
        Authorization: "Basic " + btoa(`${user.username}:${user.password}`),
        "Content-Type": "application/json",
    };
}

export interface StaffMember {
    id?: number;
    name: string;
    role: string;
    email: string;
}

export async function getAllStaff(user: AuthUser): Promise<StaffMember[]> {
    const res = await fetch(BASE, { headers: authHeader(user) });
    if (!res.ok) throw new Error(`Failed to fetch staff: ${res.status}`);
    return res.json();
}

export async function getStaffById(
    user: AuthUser,
    id: number
): Promise<StaffMember> {
    const res = await fetch(`${BASE}/${id}`, { headers: authHeader(user) });
    if (!res.ok) throw new Error(`Failed to fetch staff #${id}: ${res.status}`);
    return res.json();
}

export async function createStaff(
    user: AuthUser,
    data: StaffMember
): Promise<StaffMember> {
    if (user.role !== "ADMIN") throw new Error("Only ADMIN can create staff.");
    const res = await fetch(BASE, {
        method: "POST",
        headers: authHeader(user),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to create staff: ${res.status}`);
    return res.json();
}

export async function updateStaff(
    user: AuthUser,
    id: number,
    data: StaffMember
): Promise<StaffMember> {
    if (!["ADMIN", "MANAGER"].includes(user.role))
        throw new Error("Only ADMIN or MANAGER can update staff.");
    const res = await fetch(`${BASE}/${id}`, {
        method: "PUT",
        headers: authHeader(user),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to update staff: ${res.status}`);
    return res.json();
}

export async function deleteStaff(user: AuthUser, id: number): Promise<void> {
    if (user.role !== "ADMIN") throw new Error("Only ADMIN can delete staff.");
    const res = await fetch(`${BASE}/${id}`, {
        method: "DELETE",
        headers: authHeader(user),
    });
    if (!res.ok) throw new Error(`Failed to delete staff: ${res.status}`);
}

export function canCreate(role: Role) {
    return role === "ADMIN";
}
export function canEdit(role: Role) {
    return role === "ADMIN" || role === "MANAGER";
}
export function canDelete(role: Role) {
    return role === "ADMIN";
}
