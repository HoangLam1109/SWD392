import { createContext } from "react";
import type { User } from "@/types/Auth.types";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
