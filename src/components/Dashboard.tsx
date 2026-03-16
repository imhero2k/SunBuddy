import React, { useEffect, useState } from "react";
import { MinimalUvCard } from "./widgets/MinimalUvCard";
import { SimpleStatCard } from "./widgets/SimpleStatCard";
import { ProCard } from "./widgets/ProCard";
import { LocationSelector } from "./widgets/LocationSelector";
import { apiFetch } from "../api";

export type DashboardData = {
  minimalUv: number;
  time: string;
  peakUvTime: string;
  peakUvLevel: number;
  cloudCover: number;
  burnRisk: string;
  sunscreenNeed: string;
  sunscreenSpf: string;
  vitaminDStatus: string;
  uvExposureStatus: string;
};

const initialData: DashboardData = {
  minimalUv: 0,
  time: "--:--",
  peakUvTime: "—",
  peakUvLevel: 0,
  cloudCover: 0,
  burnRisk: "No Risk",
  sunscreenNeed: "No Need",
  sunscreenSpf: "SPF 15+",
  vitaminDStatus: "No intake currently",
  uvExposureStatus: "No risk currently"
};

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uvForecast, setUvForecast] = useState<number[] | null>(null);
  const [peakUvInfo, setPeakUvInfo] = useState<{ level: number; time: string } | null>(null);
  const [selectedLat, setSelectedLat] = useState<number | undefined>(undefined);
  const [selectedLon, setSelectedLon] = useState<number | undefined>(undefined);
  const [lastUpdatedSydney, setLastUpdatedSydney] = useState<string>("--:--");

  const handleLocationChange = (lat: number, lon: number) => {
    setSelectedLat(lat);
    setSelectedLon(lon);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let lat: number | undefined = selectedLat;
        let lon: number | undefined = selectedLon;

        // If no location selected, try geolocation as fallback
        if (lat == null || lon == null) {
          if ("geolocation" in navigator) {
            try {
              const position = await new Promise<GeolocationPosition>(
                (resolve, reject) => {
                  navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: false,
                    timeout: 8000
                  });
                }
              );
              lat = position.coords.latitude;
              lon = position.coords.longitude;
              // Update selected location to match geolocation
              setSelectedLat(lat);
              setSelectedLon(lon);
            } catch (err) {
              console.error("[Dashboard] geolocation failed, using server defaults:", err instanceof Error ? err.message : err);
            }
          }
        }

        const params = new URLSearchParams();
        if (lat != null && lon != null) {
          params.set("lat", lat.toString());
          params.set("lon", lon.toString());
        }

        const base = import.meta.env.VITE_API_BASE ?? "/api";
        const dashboardUrl =
          params.size > 0
            ? `${base}/dashboard?${params.toString()}`
            : `${base}/dashboard`;

        const uvForecastUrl =
          params.size > 0
            ? `${base}/uv-forecast?${params.toString()}&hours=24`
            : null;

        const [dashRes, forecastRes] = await Promise.all([
          apiFetch(dashboardUrl),
          uvForecastUrl ? apiFetch(uvForecastUrl) : Promise.resolve(null)
        ]);

        if (!dashRes.ok) {
          console.error("[Dashboard] dashboard fetch failed:", dashRes.status, dashRes.statusText);
          setError("Could not load data");
          return;
        }

        const json = (await dashRes.json()) as DashboardData;
        setData(json);

        const nowSydney = new Date().toLocaleTimeString("en-AU", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Australia/Sydney"
        });
        setLastUpdatedSydney(nowSydney);

        if (forecastRes && forecastRes.ok) {
          const forecastJson = (await forecastRes.json()) as {
            points?: { uv: number; time?: string }[];
          };
          const points = forecastJson.points ?? [];
          const values = points
            .map((p) => (typeof p.uv === "number" ? p.uv : 0))
            .slice(0, 24);
          setUvForecast(values.length > 1 ? values : null);

          // Calculate peak UV level and time
          if (points.length > 0) {
            let maxUv = 0;
            let maxIndex = 0;
            points.slice(0, 24).forEach((p, idx) => {
              const uv = typeof p.uv === "number" ? p.uv : 0;
              if (uv > maxUv) {
                maxUv = uv;
                maxIndex = idx;
              }
            });

            const peakTimeValue = points[maxIndex]?.time;
            if (maxUv > 0 && typeof peakTimeValue === "string") {
              const peakTime = new Date(peakTimeValue);
              const formattedTime = peakTime.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
              });
              setPeakUvInfo({ level: maxUv, time: formattedTime });
            } else {
              setPeakUvInfo(null);
            }
          } else {
            setPeakUvInfo(null);
          }
        } else {
          if (forecastRes && !forecastRes.ok) {
            console.error("[Dashboard] uv-forecast fetch failed:", forecastRes.status, forecastRes.statusText);
          }
          setUvForecast(null);
          setPeakUvInfo(null);
        }
      } catch (err) {
        console.error("[Dashboard] fetch error:", err instanceof Error ? err.message : err);
        setError("Could not load data");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Auto-refresh every 2 minutes (120000ms)
    const intervalId = setInterval(() => {
      fetchData();
    }, 120000);

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [selectedLat, selectedLon]);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs tracking-wide text-slate-500 uppercase">
            Overview
          </p>
          <h1 className="text-xl font-semibold text-slate-900 mt-1">
            Today&apos;s status
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {loading
              ? "Loading forecast…"
              : error
              ? error
              : (
                  <>
                    Last updated at{" "}
                    <span className="font-medium">{lastUpdatedSydney}</span>
                    {" • "}
                    <span className="text-slate-400">Auto-refreshes every 2 minutes</span>
                  </>
                )}
          </p>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MinimalUvCard value={data.minimalUv} />
        <SimpleStatCard
          title="Cloud Cover"
          value={`${data.cloudCover ?? 0} %`}
          variant="cloud"
        />
        <SimpleStatCard
          title="Burn Risk"
          value={data.burnRisk}
          variant="burn"
        />
        <SimpleStatCard
          title="Sunscreen"
          value={data.sunscreenSpf || "SPF 15+"}
          subtitle={data.sunscreenNeed}
          variant="sunscreen"
        />
        <ProCard
          title="UV Forecast"
          subtitle={peakUvInfo 
            ? `Peak: ${peakUvInfo.level.toFixed(1)} at ${peakUvInfo.time}`
            : "Next 24 hours. Orange intensity = UV strength."}
          accent={peakUvInfo ? "Next 24 hours forecast" : "Peak UV typically midday."}
          chartValues={uvForecast ?? undefined}
        />
        <ProCard
          title="UV Exposure"
          subtitle={data.uvExposureStatus}
          accent=""
        />
      </section>

      <LocationSelector
        onLocationChange={handleLocationChange}
        currentLat={selectedLat}
        currentLon={selectedLon}
      />
    </div>
  );
};

