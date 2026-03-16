import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Dashboard } from "./Dashboard";

// Mock firebase auth so apiFetch doesn't error
vi.mock("../firebase", () => ({
  auth: { currentUser: null }
}));

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      minimalUv: 3,
      time: "12:00",
      peakUvTime: "13:00",
      peakUvLevel: 5,
      cloudCover: 20,
      burnRisk: "Low",
      sunscreenNeed: "Recommended",
      sunscreenSpf: "SPF 30+",
      vitaminDStatus: "Good",
      uvExposureStatus: "Low risk"
    })
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Dashboard", () => {
  it("renders overview heading", async () => {
    render(<Dashboard />);
    const heading = screen.getByRole("heading", {
      name: /today's status/i
    });
    expect(heading).toBeTruthy();
    // Wait for async effects to settle to avoid act() warnings
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
  });
});
