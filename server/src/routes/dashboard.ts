import { Router } from "express";
import { getDashboardSnapshot } from "../storage/memoryDashboardStore";

export const dashboardRouter = Router();

dashboardRouter.get("/", async (req, res) => {
  const lat = req.query.lat ? Number(req.query.lat) : undefined;
  const lon = req.query.lon ? Number(req.query.lon) : undefined;
  console.log("[dashboard] request lat=", lat, "lon=", lon);

  try {
    const data = await getDashboardSnapshot(lat, lon);
    res.json(data);
  } catch (err) {
    console.error("[dashboard] getDashboardSnapshot failed:", err instanceof Error ? err.message : err);
    res.status(500).json({ error: "Dashboard data failed" });
  }
});

