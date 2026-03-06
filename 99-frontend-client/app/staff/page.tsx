"use client";

import { useEffect, useState } from "react";
import StaffDashboard from "./components/StaffDashboard";
import StaffLogin from "./components/StaffLogin";

export type Role = "ADMIN" | "MANAGER" | "STAFF";

export interface AuthUser {
  username: string;
  password: string;
  role: Role;
}

export default function StaffPage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("staff_auth");
    if (stored) {
      setAuthUser(JSON.parse(stored));
    }
  }, []);

  const handleLogin = (user: AuthUser) => {
    sessionStorage.setItem("staff_auth", JSON.stringify(user));
    setAuthUser(user);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("staff_auth");
    setAuthUser(null);
  };

  if (!authUser) {
    return <StaffLogin onLogin={handleLogin} />;
  }

  return <StaffDashboard authUser={authUser} onLogout={handleLogout} />;
}
