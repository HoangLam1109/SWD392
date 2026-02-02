import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "@/context/auth.context";
import type { User } from "@/types/Auth.types";

const AUTH_USER_KEY = "auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (stored) setUserState(JSON.parse(stored));
  }, []);

  const setUser = useCallback((user: User | null) => {
    setUserState(user);
    if (user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    else localStorage.clear();
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, setUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
