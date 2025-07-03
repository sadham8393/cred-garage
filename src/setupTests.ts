// --- Chart.js and react-chartjs-2 mocks for jsdom ---
import { vi } from "vitest";

vi.mock("react-chartjs-2", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  const MockChart = () => React.createElement("div", { "data-testid": "mock-chart" }, "MockChart");
  return {
    __esModule: true,
    Bar: MockChart,
    Line: MockChart,
    Pie: MockChart,
    Doughnut: MockChart,
    Radar: MockChart,
    PolarArea: MockChart,
    Bubble: MockChart,
    Scatter: MockChart,
    defaults: {},
  };
});

vi.mock("chart.js", () => {
  const Chart = function () {
    return {
      destroy: vi.fn(),
      update: vi.fn(),
      toBase64Image: vi.fn(),
      resize: vi.fn(),
      reset: vi.fn(),
      render: vi.fn(),
      stop: vi.fn(),
      clear: vi.fn(),
      toDataURL: vi.fn(),
      getDatasetMeta: vi.fn(),
      getElementAtEvent: vi.fn(),
      getElementsAtEvent: vi.fn(),
      getElementsAtXAxis: vi.fn(),
      getElementsAtYAxis: vi.fn(),
      getDatasetAtEvent: vi.fn(),
      ctx: {},
      canvas: {},
    };
  };
  Chart.register = vi.fn();
  // Provide all required exports for ChartJS.register(...)
  return {
    __esModule: true,
    Chart,
    ChartJS: { register: vi.fn() },
    ArcElement: {},
    Tooltip: {},
    Legend: {},
    register: vi.fn(),
    registerables: [],
    defaults: {},
  };
});
// --- Mock canvas for Chart.js in jsdom ---
if (typeof HTMLCanvasElement !== "undefined") {
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    value: () => ({
      fillRect: () => {},
      clearRect: () => {},
      getImageData: () => ({ data: [] }),
      putImageData: () => {},
      createImageData: () => [],
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      arcTo: () => {},
      measureText: () => ({ width: 0 }),
      transform: () => {},
      rect: () => {},
      clip: () => {},
    }),
  });
}

// --- Zustand store hook mocks for all tests (for ESM dynamic imports too) ---


import type { UserStoreState } from "./store/userStore";
import type { RewardsStoreState } from "./store/rewardsStore";

let mockUserStoreState: UserStoreState = {
  user: null,
  loading: false,
  error: null,
  fetchUser: vi.fn(async () => {}),
};
let mockRewardsStoreState: RewardsStoreState = {
  xp: { points: 0, maxPoints: 0 },
  loading: false,
  error: null,
  fetchPoints: vi.fn(async () => {}),
};

vi.mock("./store/userStore", () => ({
  __esModule: true,
  default: (selector: (s: UserStoreState) => unknown = (s) => s) => selector(mockUserStoreState),
}));
vi.mock("./store/rewardsStore", () => ({
  __esModule: true,
  default: (selector: (s: RewardsStoreState) => unknown = (s) => s) =>
    selector(mockRewardsStoreState),
}));

declare global {
  var __setUserStoreState: (patch: Partial<UserStoreState>) => void;
  var __setRewardsStoreState: (patch: Partial<RewardsStoreState>) => void;
}

globalThis.__setUserStoreState = (patch: Partial<UserStoreState>) => {
  // Always coerce fetchUser to async fn if present
  const next = { ...patch };
  if (typeof next.fetchUser === "function") {
    next.fetchUser = vi.fn(async (...args: any[]) => (next.fetchUser as any)(...args));
  }
  mockUserStoreState = { ...mockUserStoreState, ...next };
};
globalThis.__setRewardsStoreState = (patch: Partial<RewardsStoreState>) => {
  // Always coerce fetchPoints to async fn if present
  const next = { ...patch };
  if (typeof next.fetchPoints === "function") {
    next.fetchPoints = vi.fn(async (...args: any[]) => (next.fetchPoints as any)(...args));
  }
  mockRewardsStoreState = { ...mockRewardsStoreState, ...next };
};
// Vitest setup file for jest-dom matchers
import "@testing-library/jest-dom";
