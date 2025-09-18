"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: { role: string | null } | null;
  token: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ role: string | null } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("auth-token");
    const storedRole = localStorage.getItem("user-role");
    if (storedToken && storedRole) {
      setToken(storedToken);
      setUser({ role: storedRole });
    }
  }, []);

  const login = (newToken: string, newRole: string) => {
    localStorage.setItem("auth-token", newToken);
    localStorage.setItem("user-role", newRole);
    setToken(newToken);
    setUser({ role: newRole });
    
    if (newRole === 'Manager') {
      router.push('/manager/dashboard');
    } else if (newRole === 'Staff') {
      router.push('/staff/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-role");
    setToken(null);
    setUser(null);
    router.push('/');
  };

  const value = { user, token, login, logout, isAuthenticated: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
