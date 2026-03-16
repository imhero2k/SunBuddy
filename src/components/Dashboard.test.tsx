import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dashboard } from "./Dashboard";

describe("Dashboard", () => {
  it("renders overview heading", () => {
    render(<Dashboard />);
    const heading = screen.getByRole("heading", {
      name: /today's status/i
    });
    expect(heading).toBeTruthy();
  });
});

