import { create } from "zustand";

export interface UserProfileData {
  avatarUrl: string;
  name: string;
  level: number;
  xp: number;
  xpMax: number;
}

export interface UserStoreState {
  user: UserProfileData | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
}

export const userStore = create<UserStoreState>((set) => ({
  user: null,
  loading: true,
  error: null,
  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:3000/user");
      if (!res.ok) throw new Error("Failed to fetch user data");
      const data: UserProfileData = await res.json();
      set({ user: data, loading: false });
    } catch (err) {
      let message = "Unknown error";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }
  },
}));
