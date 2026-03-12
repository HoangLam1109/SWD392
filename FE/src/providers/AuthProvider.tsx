import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "@/context/auth.context";
import { useRefreshToken } from "@/hooks/auth/userRefreshToken";
import type { User } from "@/types/Auth.types";

const AUTH_USER_KEY = "auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const { mutateAsync: refreshToken } = useRefreshToken();

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (stored) setUserState(JSON.parse(stored));
  }, []);

  // Khi có token, thử refresh để lấy access token mới. Nếu refresh lỗi thì giữ nguyên token/user (không đăng xuất).
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    refreshToken()
      .then((data) => {
        if (data?.accessToken) {
          localStorage.setItem("token", data.accessToken);
        }
        if (data?.user) {
          setUserState(data.user);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
        }
      })
      .catch(() => {
        // Refresh thất bại → không xóa token/user, giữ đăng nhập; khi gọi API 401 thì interceptor sẽ thử refresh.
      });
  }, [refreshToken]);

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
