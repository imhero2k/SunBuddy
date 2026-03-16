import { Router } from "express";
import { fetchOpenMeteoUvForecast } from "../clients/openMeteo";
import { fetchArpansaUv } from "../clients/arpansa";

export const uvForecastRouter = Router();

uvForecastRouter.get("/", async (req, res) => {
  const lat = req.query.lat ? Number(req.query.lat) : undefined;
  const lon = req.query.lon ? Number(req.query.lon) : undefined;
  const hours = req.query.hours ? Number(req.query.hours) : 24;

  if (lat == null || lon == null || !Number.isFinite(lat) || !Number.isFinite(lon)) {
    console.error("[uv-forecast] bad params: lat=", lat, "lon=", lon);
    res.status(400).json({ error: "lat and lon are required query params" });
    return;
  }

  const safeHours =
    Number.isFinite(hours) && hours > 0 && hours <= 168 ? Math.floor(hours) : 24;

  try {
    const points = await fetchOpenMeteoUvForecast(lat, lon, safeHours);
    res.json({ points });
  } catch (err) {
    console.error(
      "[uv-forecast] Open-Meteo UV forecast failed:",
      err instanceof Error ? err.message : err
    );

    // Graceful fallback: try ARPANSA current UV and build a flat forecast curve.
    try {
      const { uvi } = await fetchArpansaUv(lat, lon);
      const now = new Date();
      const points = Array.from({ length: safeHours }, (_, i) => {
        const t = new Date(now.getTime() + i * 60 * 60 * 1000);
        return {
          time: t.toISOString(),
          uv: uvi
        };
      });
      res.json({
        points,
        fallback: "arpansa-current"
      });
    } catch (fallbackErr) {
      console.error(
        "[uv-forecast] ARPANSA fallback failed:",
        fallbackErr instanceof Error ? fallbackErr.message : fallbackErr
      );
      res.status(502).json({
        error: "uv forecast provider failed",
        message: err instanceof Error ? err.message : String(err)
      });
    }
  }
});

