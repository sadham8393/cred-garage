import { create } from "zustand";
import db from "../../db.json";

export interface Benefit {
  id: number;
  title: string;
  description: string;
}

interface BenefitsStoreState {
  benefits: Benefit[];
  loading: boolean;
  error: string | null;
  fetchBenefits: () => Promise<void>;
}

export const benefitsStore = create<BenefitsStoreState>((set) => ({
  benefits: [],
  loading: true,
  error: null,
  fetchBenefits: async () => {
    set({ loading: true, error: null });
    try {
      let data;
      if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        // Use local db.json directly in dev
        data = db.benefits;
      } else {
        const res = await fetch("/api/mock-data");
        if (!res.ok) throw new Error("Failed to fetch benefits");
        const apiData = await res.json();
        data = apiData.benefits;
      }
      set({ benefits: data, loading: false });
    } catch (err) {
      let message = "Unknown error";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }
  },
}));
