// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User, LoginDTO, SignupDTO } from "../lib/auth";
import {
  getCurrentAuth,
  login as authLogin,
  signup as authSignup,
  logout as authLogout,
  updateCurrentUserProfile,
  changePassword,
  deleteCurrentAccount,
} from "../lib/auth";

type AuthContextValue = {
  user: User | null;
  isAuthed: boolean;
  login: (dto: LoginDTO) => Promise<void>;
  signup: (dto: SignupDTO) => Promise<void>;
  logout: () => void;
  refresh: () => void;
  updateProfile: (patch: { nickname?: string; email?: string }) => Promise<void>;
  changePassword: (input: { currentPassword: string; newPassword: string }) => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getCurrentAuth();
    if (auth?.user) setUser(auth.user);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthed: !!user,
      async login(dto) {
        const { user: u } = await authLogin(dto);
        setUser(u);
      },
      async signup(dto) {
        const { user: u } = await authSignup(dto);
        setUser(u);
      },
      logout() {
        authLogout();
        setUser(null);
      },
      refresh() {
        const auth = getCurrentAuth();
        setUser(auth?.user ?? null);
      },
      async updateProfile(patch) {
        const u = await updateCurrentUserProfile(patch);
        setUser(u);
      },
      async changePassword(input) {
        await changePassword(input);
      },
      async deleteAccount() {
        await deleteCurrentAccount();
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext가 초기화되지 않았습니다.");
  return ctx;
}
