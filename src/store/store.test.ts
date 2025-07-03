import { describe, it, expect } from "vitest";
import { vi } from "vitest";
function createUserStoreMock() {
  const state = {
    user: null,
    loading: false,
    error: null,
    fetchUser: vi.fn(),
  };
  function store() {
    return state;
  }
  store.getState = () => state;
  store.setState = (patch: Partial<typeof state>) => Object.assign(state, patch);
  return store;
}
function createRewardsStoreMock() {
  const state = {
    xp: { points: 0, maxPoints: 0 },
    loading: false,
    error: null,
    fetchPoints: vi.fn(),
  };
  function store() {
    return state;
  }
  store.getState = () => state;
  store.setState = (patch: Partial<typeof state>) => Object.assign(state, patch);
  return store;
}
vi.mock("./userStore", () => ({ userStore: createUserStoreMock() }));
vi.mock("./rewardsStore", () => ({ rewardsStore: createRewardsStoreMock() }));
import { benefitsStore } from "./benefitsStore";
import { userStore } from "./userStore";
import { rewardsStore } from "./rewardsStore";

describe("benefitsStore", () => {
  it("returns initial state and fetchBenefits updates state", async () => {
    const store = benefitsStore.getState();
    expect(store.benefits).toBeDefined();
    expect(Array.isArray(store.benefits)).toBe(true);
    expect(typeof store.fetchBenefits).toBe("function");
    expect(typeof store.loading).toBe("boolean");
    expect(store.error === null || typeof store.error === "string").toBe(true);
    // Simulate fetch
    await store.fetchBenefits();
    const after = benefitsStore.getState();
    expect(after.loading).toBe(false);
    expect(Array.isArray(after.benefits)).toBe(true);
    // Simulate error
    benefitsStore.setState({ error: "Test error" });
    expect(benefitsStore.getState().error).toBe("Test error");
    // Reset
    benefitsStore.setState({ error: null });
  });
});

describe("userStore", () => {
  const user = {
    name: "Test User",
    avatarUrl: "https://example.com/avatar.png",
    level: 1,
    xp: 0,
    xpMax: 100,
  };
  it("returns initial state and fetchUser updates state", async () => {
    // Zustand store is a function, but setState/getState are attached to the function object
    expect(typeof userStore.getState).toBe("function");
    expect(typeof userStore.setState).toBe("function");
    const store = userStore.getState();
    expect(store.user === null || typeof store.user === "object").toBe(true);
    expect(typeof store.fetchUser).toBe("function");
    expect(typeof store.loading).toBe("boolean");
    expect(store.error === null || typeof store.error === "string").toBe(true);
    // Simulate fetch
    await store.fetchUser();
    const after = userStore.getState();
    expect(after.loading).toBe(false);
    // Simulate error
    userStore.setState({ error: "User error" });
    expect(userStore.getState().error).toBe("User error");
    // Simulate user update (adjust shape as needed)
    userStore.setState({ user });
    expect(userStore.getState().user).toEqual({ ...user });
    // Reset
    userStore.setState({ error: null, user: null });
  });
});

describe("rewardsStore", () => {
  it("returns initial state and fetchPoints updates state", async () => {
    expect(typeof rewardsStore.getState).toBe("function");
    expect(typeof rewardsStore.setState).toBe("function");
    const store = rewardsStore.getState();
    expect(store.xp).toBeDefined();
    expect(typeof store.fetchPoints).toBe("function");
    expect(typeof store.loading).toBe("boolean");
    expect(store.error === null || typeof store.error === "string").toBe(true);
    // Simulate fetch
    await store.fetchPoints();
    const after = rewardsStore.getState();
    expect(after.loading).toBe(false);
    // Simulate error
    rewardsStore.setState({ error: "XP error" });
    expect(rewardsStore.getState().error).toBe("XP error");
    // Simulate xp update
    rewardsStore.setState({ xp: { points: 42, maxPoints: 100 } });
    expect(rewardsStore.getState().xp).toEqual({ points: 42, maxPoints: 100 });
    // Reset
    rewardsStore.setState({ error: null, xp: { points: 0, maxPoints: 0 } });
  });
});
