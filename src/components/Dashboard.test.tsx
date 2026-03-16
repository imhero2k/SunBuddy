import React from "react";
import { render, screen } from "@testing-library/react";
import { Dashboard } from "./Dashboard";

describe("Dashboard", () => {
  it("renders overview heading", () => {
    render(<Dashboard />);
    expect(
      screen.getByRole("heading", { name: /today's status/i })
    ).toBeInTheDocument();
  });
});

