import { create } from "zustand";
import type { Benefit } from "@/components/BenefitsSection";

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
      const res = await fetch("http://localhost:3000/benefits");
      if (!res.ok) throw new Error("Failed to fetch benefits");
      const data = await res.json();

      let arr: Benefit[] = [];
      if (Array.isArray(data)) {
        arr = data as Benefit[];
      } else if (Array.isArray(data.benefits)) {
        arr = data.benefits as Benefit[];
      }
      set({
        benefits: arr,
        loading: false,
      });
    } catch (err) {
      let message = "Unknown error";
      if (err instanceof Error) message = err.message;
      set({ error: message, loading: false, benefits: [] });
    }
  },
}));
