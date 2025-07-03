import { create } from "zustand";
import db from "../../db.json";

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
      let data: UserProfileData;
      if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        // Use local db.json directly in dev
        data = db.user;
      } else {
        const res = await fetch("/api/mock-data");
        if (!res.ok) throw new Error("Failed to fetch user data");
        const apiData = await res.json();
        data = apiData.user;
      }
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
