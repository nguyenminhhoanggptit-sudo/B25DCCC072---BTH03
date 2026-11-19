import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const STORAGE_KEY = "shopmini-user";
const VALID_PASSWORD = "123456";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const isUser = (value: unknown): value is User =>
  typeof value === "object" &&
  value !== null &&
  "username" in value &&
  typeof value.username === "string";

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    return isUser(parsed) ? { username: parsed.username } : null;
  } catch {
    return null;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(getStoredUser);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, [user]);

  const login = useCallback((username: string, password: string): boolean => {
    const trimmed = username.trim();
    if (trimmed === "" || password !== VALID_PASSWORD) {
      return false;
    }
    setUser({ username: trimmed });
    return true;
  }, []);

  const logout = useCallback((): void => {
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, login, logout }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được dùng bên trong <AuthProvider>.");
  }
  return context;
}
