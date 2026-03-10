import React, { useEffect, useState } from "react";
import { MinimalUvCard } from "./widgets/MinimalUvCard";
import { SimpleStatCard } from "./widgets/SimpleStatCard";
import { ProCard } from "./widgets/ProCard";
import { LocationCard } from "./widgets/LocationCard";

export type DashboardData = {
  minimalUv: number;
  time: string;
  peakUvTime: string;
  cloudCover: number;
  burnRisk: string;
  sunscreenNeed: string;
  vitaminDStatus: string;
  uvExposureStatus: string;
};

const initialData: DashboardData = {
  minimalUv: 0,
  time: "--:--",
  peakUvTime: "1:30 pm",
  cloudCover: 0,
  burnRisk: "No Risk",
  sunscreenNeed: "No Need",
  vitaminDStatus: "No intake currently",
  uvExposureStatus: "No risk currently"
};

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uvForecast, setUvForecast] = useState<number[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let lat: number | undefined;
        let lon: number | undefined;

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
          } catch (err) {
            console.error("[Dashboard] geolocation failed, using server defaults:", err instanceof Error ? err.message : err);
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
          fetch(dashboardUrl),
          uvForecastUrl ? fetch(uvForecastUrl) : Promise.resolve(null)
        ]);

        if (!dashRes.ok) {
          console.error("[Dashboard] dashboard fetch failed:", dashRes.status, dashRes.statusText);
          setError("Could not load data");
          return;
        }

        const json = (await dashRes.json()) as DashboardData;
        setData(json);

        if (forecastRes && forecastRes.ok) {
          const forecastJson = (await forecastRes.json()) as {
            points?: { uv: number }[];
          };
          const values = (forecastJson.points ?? [])
            .map((p) => (typeof p.uv === "number" ? p.uv : 0))
            .slice(0, 24);
          setUvForecast(values.length > 1 ? values : null);
        } else {
          if (forecastRes && !forecastRes.ok) {
            console.error("[Dashboard] uv-forecast fetch failed:", forecastRes.status, forecastRes.statusText);
          }
          setUvForecast(null);
        }
      } catch (err) {
        console.error("[Dashboard] fetch error:", err instanceof Error ? err.message : err);
        setError("Could not load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              ? "Loading from your location…"
              : error
              ? error
              : (
                  <>
                    Last updated at{" "}
                    <span className="font-medium">{data.time}</span>
                  </>
                )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="ios-card px-3 py-2 text-xs flex items-center gap-1">
            🔁 <span>Refresh</span>
          </button>
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
          value={data.sunscreenNeed}
          variant="sunscreen"
        />
        <ProCard
          title="UV Forecast"
          subtitle="Next 24 hours. Orange intensity = UV strength."
          accent="Peak UV typically midday."
          chartValues={uvForecast ?? undefined}
        />
        <ProCard
          title="UV Exposure"
          subtitle={data.uvExposureStatus}
          accent="No risk of sunburn at the moment."
        />
      </section>

      <LocationCard />
    </div>
  );
};

