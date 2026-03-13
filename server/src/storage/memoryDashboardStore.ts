import type { DashboardData } from "../types";
import { fetchOpenMeteoCurrentWeather } from "../clients/openMeteo";

function classifyFromUv(uvi: number): Pick<
  DashboardData,
  "burnRisk" | "sunscreenNeed" | "sunscreenSpf" | "vitaminDStatus" | "uvExposureStatus"
> {
  if (uvi < 3) {
    return {
      burnRisk: "No Risk",
      sunscreenNeed: "No Need",
      sunscreenSpf: "SPF 15+",
      vitaminDStatus: "Low intake currently",
      uvExposureStatus: "No risk currently"
    };
  }

  if (uvi < 6) {
    return {
      burnRisk: "Moderate",
      sunscreenNeed: "Recommended",
      sunscreenSpf: "SPF 30+",
      vitaminDStatus: "Good exposure",
      uvExposureStatus: "Be cautious in direct sun"
    };
  }

  if (uvi < 8) {
    return {
      burnRisk: "High",
      sunscreenNeed: "Strongly recommended",
      sunscreenSpf: "SPF 50+",
      vitaminDStatus: "High exposure",
      uvExposureStatus: "Limit unprotected time"
    };
  }

  return {
    burnRisk: "Very High",
    sunscreenNeed: "Essential",
    sunscreenSpf: "SPF 50+",
    vitaminDStatus: "Very high exposure",
    uvExposureStatus: "Avoid midday sun"
  };
}

const DEFAULT_LAT = -33.87;
const DEFAULT_LON = 151.21;

export async function getDashboardSnapshot(
  lat?: number,
  lon?: number
): Promise<DashboardData> {
  const now = new Date();
  const time = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });

  const useLat = lat ?? DEFAULT_LAT;
  const useLon = lon ?? DEFAULT_LON;

  try {
    const { uv, cloudCover } = await fetchOpenMeteoCurrentWeather(useLat, useLon);
    const classification = classifyFromUv(uv);

    return {
      minimalUv: uv,
      time,
      peakUvTime: "—",
      peakUvLevel: 0,
      cloudCover,
      ...classification
    };
  } catch (err) {
    console.error("[dashboard] Open-Meteo current weather failed:", err instanceof Error ? err.message : err);
    return {
      minimalUv: 0,
      time,
      peakUvTime: "—",
      peakUvLevel: 0,
      cloudCover: 0,
      burnRisk: "No Risk",
      sunscreenNeed: "No Need",
      sunscreenSpf: "SPF 15+",
      vitaminDStatus: "No intake currently",
      uvExposureStatus: "No risk currently"
    };
  }
}

