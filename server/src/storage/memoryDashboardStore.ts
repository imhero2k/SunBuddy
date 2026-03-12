import type { DashboardData } from "../types";
import { fetchArpansaUv } from "../clients/arpansa";
import { fetchOpenMeteoCloudCover } from "../clients/openMeteo";

const DEFAULT_LAT = -33.87;
const DEFAULT_LON = 151.21;

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

  const usedUserCoords = useLat !== DEFAULT_LAT || useLon !== DEFAULT_LON;

  const cloudCoverPromise = (async () => {
    let cover = 0;
    try {
      cover = await fetchOpenMeteoCloudCover(useLat, useLon);
    } catch (err) {
      console.error("[dashboard] cloud cover fetch failed:", err instanceof Error ? err.message : err);
    }
    if (cover === 0 && usedUserCoords) {
      try {
        cover = await fetchOpenMeteoCloudCover(DEFAULT_LAT, DEFAULT_LON);
        console.log("[dashboard] cloud cover fallback (Sydney):", cover, "%");
      } catch (e) {
        console.error("[dashboard] cloud cover fallback failed:", e instanceof Error ? e.message : e);
      }
    }
    return cover;
  })();

  try {
    const [uvResult, cloudCover] = await Promise.all([
      fetchArpansaUv(useLat, useLon),
      cloudCoverPromise
    ]);

    const uvi = uvResult.uvi ?? 0;
    const classification = classifyFromUv(uvi);

    return {
      minimalUv: uvi,
      time,
      peakUvTime: "—",
      peakUvLevel: 0,
      cloudCover,
      arpansaStation: uvResult.station,
      ...classification
    };
  } catch (err) {
    console.error("[dashboard] ARPANSA UV fetch failed, using fallback:", err instanceof Error ? err.message : err);
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

