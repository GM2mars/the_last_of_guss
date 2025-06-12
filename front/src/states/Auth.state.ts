import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { q } from "@/utils";
import { UserRole } from "@/interfaces/interfaces";

const API_URL = import.meta.env.VITE_API_URL;

interface AuthActions {
  setUserName: (name: string) => void;
  setUserPassword: (pasword: string) => void;
  getUserName: () => string;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

interface AuthState {
  username: string;
  password: string;
  role: UserRole;
  token: string;
  error: string;
  actions: AuthActions
};

const useAuthStore = create<AuthState>()(persist((set, get) => ({
  username: null,
  password: null,
  role: UserRole.Survivor,
  token: null,
  error: null,

  actions: {
    setUserName: (name: string) => set({ username: name }),

    getUserName: () => get().username,

    setUserPassword: (password: string) => set({ password: password }),

    signIn: async () => {
      set({ error: null });

      const { username, password } = get();
      const result = await q.post(`${API_URL}/auth/login`, { username, password });
      const { error, user } = result || { error: 'Server error' };

      if (error) set({ error, token: null });
      else set({ token: user.id, username: user.username, role: user.role });
    },

    signOut: async () => {
      await q.get(`${API_URL}/auth/logout`);

      set({ username: null, password: null, token: null, error: null });

      useAuthStore.persist.clearStorage();
    }
  }
}), {
  name: "auth-storage",
  storage: createJSONStorage(() => sessionStorage),
  partialize: (state) => ({ username: state.username, token: state.token, role: state.role })
}));

export const useAuthUsername = () => useAuthStore(state => state.username);
export const useAuthToken = () => useAuthStore(state => state.token);
export const useAuthRole = () => useAuthStore(state => state.role);
export const useAuthActions = () => useAuthStore(state => state.actions);
export const useAuthError = () => useAuthStore(state => state.error);
