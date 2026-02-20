'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminSession } from '@/types';
import { validateAdminLogin } from '@/data';

interface AdminAuthContextType {
  admin: AdminSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('adminSession');
    if (stored) {
      setAdmin(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const validAdmin = validateAdminLogin(email, password);
    if (validAdmin) {
      const session: AdminSession = {
        id: validAdmin.id,
        email: validAdmin.email,
        name: validAdmin.name,
        role: validAdmin.role,
      };
      setAdmin(session);
      localStorage.setItem('adminSession', JSON.stringify(session));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    localStorage.removeItem('adminSession');
    router.push('/admin/login');
  }, [router]);

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
