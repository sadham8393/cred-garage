import { create } from "zustand";
import db from "../../db.json";

interface XpState {
  points: number;
  maxPoints: number;
}

export interface RewardsStoreState {
  xp: XpState;
  loading: boolean;
  error: string | null;
  fetchPoints: () => Promise<void>;
}

export const rewardsStore = create<RewardsStoreState>((set) => ({
  xp: {
    points: 0,
    maxPoints: 0,
  },
  loading: true,
  error: null,
  fetchPoints: async () => {
    set({ loading: true, error: null });
    try {
      let data;
      if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        // Use local db.json directly in dev
        data = db.xpPoints;
      } else {
        const res = await fetch("/api/mock-data");
        if (!res.ok) throw new Error("Failed to fetch XP points");
        const apiData = await res.json();
        data = apiData.xpPoints;
      }
      if (!data) throw new Error("XP Points not found in response");
      set({ xp: { points: data.points, maxPoints: data.maxPoints }, loading: false });
    } catch (err) {
      let message = "Unknown error";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }
  },
}));
