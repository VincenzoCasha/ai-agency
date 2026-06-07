import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { adminAuth, adminTokens } from '../lib/adminApi';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(() => adminTokens.user);

  const login = useCallback(async (email, password) => {
    const data = await adminAuth.login(email, password);
    adminTokens.save(data);
    setUser(data.admin || null);
    return data;
  }, []);

  const logout = useCallback(async () => {
    const refresh = adminTokens.refresh;
    adminTokens.clear();
    setUser(null);
    if (refresh) await adminAuth.logout(refresh);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user && adminTokens.access), login, logout }),
    [user, login, logout],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth debe usarse dentro de AdminAuthProvider');
  return ctx;
}
