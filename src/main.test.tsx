import { describe, it, expect, vi, beforeEach } from "vitest";

// Hoisted mocks must use top-level variables
const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));
vi.mock("react-dom/client", () => ({
  createRoot: createRootMock,
}));

describe("main.tsx entrypoint", () => {
  beforeEach(() => {
    renderMock.mockClear();
    createRootMock.mockClear();
  });
  it("renders App into #root", async () => {
    const rootEl = document.createElement("div");
    rootEl.id = "root";
    document.body.appendChild(rootEl);

    // Import after mocks
    await import("./main");

    expect(createRootMock).toHaveBeenCalledWith(rootEl);
    expect(renderMock).toHaveBeenCalled();

    document.body.removeChild(rootEl);
  });
});
