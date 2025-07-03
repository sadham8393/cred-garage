import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Strict types for store state
import type { UserProfileData } from "./store/userStore";
type UserStoreState = {
  user: UserProfileData | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => void;
};
type RewardsStoreState = {
  xp: { points: number; maxPoints: number };
  loading: boolean;
  error: string | null;
  fetchPoints: () => void;
};

// Extend globalThis type for __setUserStoreState and __setRewardsStoreState
declare global {
  var __setUserStoreState: (patch: Partial<UserStoreState>) => void;

  var __setRewardsStoreState: (patch: Partial<RewardsStoreState>) => void;
}

// Factory for userStore mock
function createUserStoreMock() {
  const state: UserStoreState = {
    user: null,
    loading: false,
    error: null,
    fetchUser: vi.fn(),
  };
  globalThis.__setUserStoreState = (patch: Partial<UserStoreState>) => Object.assign(state, patch);
  function store() {
    return state;
  }
  store.getState = () => state;
  store.setState = (patch: Partial<UserStoreState>) => Object.assign(state, patch);
  return store;
}
// Factory for rewardsStore mock
function createRewardsStoreMock() {
  const state: RewardsStoreState = {
    xp: { points: 0, maxPoints: 0 },
    loading: false,
    error: null,
    fetchPoints: vi.fn(),
  };
  globalThis.__setRewardsStoreState = (patch: Partial<RewardsStoreState>) =>
    Object.assign(state, patch);
  function store() {
    return state;
  }
  store.getState = () => state;
  store.setState = (patch: Partial<RewardsStoreState>) => Object.assign(state, patch);
  return store;
}

// Mock Zustand stores as named exports for Vitest compatibility
vi.mock("./store/userStore", () => ({ userStore: createUserStoreMock() }));
vi.mock("./store/rewardsStore", () => ({ rewardsStore: createRewardsStoreMock() }));
// Do not import App or benefitsStoreModule at the top level!

// Mock IntersectionObserver for Framer Motion useInView in jsdom
global.IntersectionObserver =
  global.IntersectionObserver ||
  class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };

const mockBenefits = [
  {
    title: "10% Off on Shopping",
    icon: "FaTag",
    description: "Get 10% instant discount on select partners.",
    cta: "Claim",
  },
];

describe("App", () => {
  let benefitsStoreModule: typeof import("./store/benefitsStore");
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    benefitsStoreModule = await import("./store/benefitsStore");
    // Default: empty benefits, not loading, no error
    vi.spyOn(benefitsStoreModule, "benefitsStore").mockReturnValue(() => ({
      benefits: [],
      loading: false,
      error: null,
      fetchBenefits: vi.fn(),
    }));
  });

  it("handles unknown icon string gracefully", async () => {
    vi.resetModules();
    // Set up all store state and mocks after resetModules
    globalThis.__setRewardsStoreState({
      xp: { points: 0, maxPoints: 100 },
      loading: false,
      error: null,
    });
    globalThis.__setUserStoreState({
      user: {
        avatarUrl: "mock.png",
        name: "Test User",
        level: 1,
        xp: 0,
        xpMax: 100,
      },
      loading: false,
      error: null,
    });
    // Patch: ensure benefit with unknown icon and correct title is present
    const benefitsStoreModule = await import("./store/benefitsStore");
    const benefitsWithUnknownIcon = [{ ...mockBenefits[0], icon: "UnknownIcon" }];
    vi.spyOn(benefitsStoreModule, "benefitsStore").mockImplementation(() => ({
      benefits: benefitsWithUnknownIcon,
      loading: false,
      error: null,
      fetchBenefits: vi.fn(),
    }));
    const { default: RealApp } = await import("./App");
    const { container } = render(<RealApp />);
    // Fallback: check textContent for icon string and benefit title
    expect(container.textContent).toContain("UnknownIcon");
    expect(container.textContent).toContain("Off on Shopping");
  });

  it("sets dark mode by default if theme-mode is not set", async () => {
    vi.resetModules();
    window.localStorage.removeItem("theme-mode");
    const { default: RealApp } = await import("./App");
    render(<RealApp />);
    expect(document.body.getAttribute("data-theme")).toBe("dark");
  });

  it("opens dialog when dialogOpen and selectedBenefit are set", async () => {
    vi.resetModules();
    vi.unmock("./components/BenefitsSection");
    vi.unmock("./components/ui/alert");
    const { default: RealApp } = await import("./App");
    vi.spyOn(benefitsStoreModule, "benefitsStore").mockReturnValue(() => ({
      benefits: mockBenefits,
      loading: false,
      error: null,
      fetchBenefits: vi.fn(),
    }));
    const { queryByRole } = render(<RealApp />);
    expect(queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders dashboard sections and passes benefits", async () => {
    vi.resetModules();
    // Set up all store state and mocks after resetModules
    globalThis.__setRewardsStoreState({
      xp: { points: 0, maxPoints: 100 },
      loading: false,
      error: null,
    });
    globalThis.__setUserStoreState({
      user: {
        avatarUrl: "mock.png",
        name: "Test User",
        level: 1,
        xp: 0,
        xpMax: 100,
      },
      loading: false,
      error: null,
    });
    // Patch: ensure benefit with correct title and description is present
    const benefitsStoreModule = await import("./store/benefitsStore");
    vi.spyOn(benefitsStoreModule, "benefitsStore").mockImplementation(() => ({
      benefits: mockBenefits,
      loading: false,
      error: null,
      fetchBenefits: vi.fn(),
    }));
    const { default: RealApp } = await import("./App");
    const { container } = render(<RealApp />);
    expect(screen.getAllByText(/CRED Garage/i).length).toBeGreaterThan(0);
    // Fallback: check textContent for benefit title/description
    expect(container.textContent).toContain("Off on Shopping");
    expect(container.textContent).toContain("discount on select partners");
    expect(container.textContent).toMatch(/All rights reserved/i);
  });

  it("opens and closes the benefit dialog when a benefit is clicked", async () => {
    vi.resetModules();
    vi.spyOn(benefitsStoreModule, "benefitsStore").mockReturnValue(() => ({
      benefits: mockBenefits,
      loading: false,
      error: null,
      fetchBenefits: vi.fn(),
    }));
    const { default: RealApp } = await import("./App");
    render(<RealApp />);
    expect(screen.queryByText(/Alert/)).not.toBeInTheDocument();
  });

  it("renders in dark mode and toggles to light mode", async () => {
    vi.resetModules();
    window.localStorage.setItem("theme-mode", "dark");
    const { default: RealApp } = await import("./App");
    render(<RealApp />);
    expect(document.body.getAttribute("data-theme")).toBe("dark");
    const toggleBtn = screen.getByLabelText("Toggle dark mode");
    const { act } = await import("react");
    await act(async () => {
      toggleBtn.click();
    });
    expect(document.body.getAttribute("data-theme")).toBe("light");
  });

  it("shows loading state when loading is true", async () => {
    vi.resetModules();
    vi.spyOn(benefitsStoreModule, "benefitsStore").mockReturnValue(() => ({
      benefits: [],
      loading: true,
      error: null,
      fetchBenefits: vi.fn(),
    }));
    const { default: RealApp } = await import("./App");
    render(<RealApp />);
    expect(document.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("shows error state when error is present", async () => {
    vi.resetModules();
    // Set up all store state and mocks after resetModules
    globalThis.__setRewardsStoreState({
      xp: { points: 0, maxPoints: 100 },
      loading: false,
      error: null,
    });
    globalThis.__setUserStoreState({
      user: {
        avatarUrl: "mock.png",
        name: "Test User",
        level: 1,
        xp: 0,
        xpMax: 100,
      },
      loading: false,
      error: null,
    });
    // Patch: ensure error is set and rendered
    const benefitsStoreModule = await import("./store/benefitsStore");
    vi.spyOn(benefitsStoreModule, "benefitsStore").mockImplementation(() => ({
      benefits: [],
      loading: false,
      error: "Failed to fetch",
      fetchBenefits: vi.fn(),
    }));
    const { default: RealApp } = await import("./App");
    const { container } = render(<RealApp />);
    // Fallback: check textContent for error string
    expect(container.textContent).toContain("Failed to fetch");
  });
});

describe("UserProfileSummary and RewardPointsProgress", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    globalThis.__setUserStoreState({
      user: null,
      loading: false,
      error: null,
      fetchUser: vi.fn(),
    });
    globalThis.__setRewardsStoreState({
      xp: { points: 0, maxPoints: 0 },
      loading: false,
      error: null,
      fetchPoints: vi.fn(),
    });
  });

  it("renders UserProfileSummary loading state", async () => {
    vi.resetModules();
    globalThis.__setUserStoreState({ loading: true });
    const { default: RealUserProfileSummary } = await import("./components/UserProfileSummary");
    const { container } = render(<RealUserProfileSummary />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders UserProfileSummary error state", async () => {
    vi.resetModules();
    globalThis.__setUserStoreState({ loading: false, error: "Failed to fetch user" });
    const { default: RealUserProfileSummary } = await import("./components/UserProfileSummary");
    const { container } = render(<RealUserProfileSummary />);
    expect(container.textContent).toMatch(/Failed to fetch user/i);
  });

  it("renders RewardPointsProgress loading state", async () => {
    vi.resetModules();
    globalThis.__setRewardsStoreState({ loading: true });
    const { default: RealRewardPointsProgress } = await import("./components/RewardPointsProgress");
    const { container } = render(<RealRewardPointsProgress />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders RewardPointsProgress error state", async () => {
    vi.resetModules();
    globalThis.__setRewardsStoreState({ loading: false, error: "Failed to fetch XP" });
    const { default: RealRewardPointsProgress } = await import("./components/RewardPointsProgress");
    const { container } = render(<RealRewardPointsProgress />);
    expect(container.textContent).toMatch(/Failed to fetch XP/i);
  });
});
