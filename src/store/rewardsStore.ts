import { create } from "zustand";

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
      const res = await fetch("http://localhost:3000/xpPoints");
      if (!res.ok) throw new Error("Failed to fetch Xp Points data");
      const data = await res.json();

      // Expecting data.xpPoints: { points: number, maxPoints: number }
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
