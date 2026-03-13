/**
 * Open-Meteo - free, no API key, global coverage.
 */

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

export type CurrentWeather = {
  uv: number;
  cloudCover: number;
};

/** Fetches current UV index and cloud cover in a single request. */
export async function fetchOpenMeteoCurrentWeather(
  lat: number,
  lon: number
): Promise<CurrentWeather> {
  const url = new URL(OPEN_METEO_URL);
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "uv_index,cloud_cover");
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "SunBuddy/1.0 (weather app)" }
  });
  if (!res.ok) {
    throw new Error(`Open-Meteo current ${res.status}: ${res.statusText}`);
  }
  const body = (await res.json()) as {
    current?: { uv_index?: number; cloud_cover?: number };
  };
  const uv = body.current?.uv_index;
  const cloud = body.current?.cloud_cover;
  console.log("[openmeteo] current uv:", uv, "cloud_cover:", cloud);
  return {
    uv: typeof uv === "number" && Number.isFinite(uv) ? uv : 0,
    cloudCover: typeof cloud === "number" ? Math.round(cloud) : 0
  };
}

export async function fetchOpenMeteoCloudCover(lat: number, lon: number): Promise<number> {
  const url = new URL(OPEN_METEO_URL);
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "cloud_cover");
  url.searchParams.set("hourly", "cloud_cover");
  url.searchParams.set("timezone", "auto");

  try {
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "SunBuddy/1.0 (weather app)" }
    });
    if (!res.ok) {
      const msg = `Open-Meteo cloud_cover ${res.status}: ${res.statusText}`;
      console.error("[openmeteo] cloud cover fetch fail:", msg);
      throw new Error(msg);
    }
    const body = (await res.json()) as {
      current?: { cloud_cover?: number; time?: string };
      hourly?: { time?: string[]; cloud_cover?: number[] };
      utc_offset_seconds?: number;
    };
    let cover = body.current?.cloud_cover;
    const hours = body.hourly;
    if (typeof cover !== "number" && Array.isArray(hours?.cloud_cover) && Array.isArray(hours?.time) && hours.cloud_cover.length > 0) {
      let idx = -1;
      if (body.current?.time) {
        const prefix = body.current.time.slice(0, 13);
        idx = hours.time.findIndex((t) => String(t).startsWith(prefix));
      }
      if (idx < 0 && body.utc_offset_seconds != null) {
        const epochSec = Math.floor(Date.now() / 1000);
        const localHour = Math.floor(((epochSec + body.utc_offset_seconds) % 86400) / 3600);
        idx = Math.min(localHour, hours.cloud_cover.length - 1);
      }
      if (idx < 0) idx = 0;
      cover = hours.cloud_cover[idx];
    }
    const value = typeof cover === "number" ? Math.round(cover) : 0;
    console.log("[openmeteo] cloud cover:", value, "%", typeof body.current?.cloud_cover === "number" ? "(current)" : "(hourly fallback)");
    return value;
  } catch (err) {
    if (err instanceof Error && !err.message.startsWith("Open-Meteo")) {
      console.error("[openmeteo] cloud cover request error:", err.message);
    }
    throw err;
  }
}

export type UvForecastPoint = {
  time: string;
  uv: number;
};

export async function fetchOpenMeteoUvForecast(
  lat: number,
  lon: number,
  hours: number = 24
): Promise<UvForecastPoint[]> {
  const url = new URL(OPEN_METEO_URL);
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("hourly", "uv_index");
  url.searchParams.set("forecast_hours", String(hours));
  url.searchParams.set("timezone", "auto");

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      const msg = `Open-Meteo uv_forecast ${res.status}: ${res.statusText}`;
      console.error("[openmeteo] uv forecast fetch fail:", msg);
      throw new Error(msg);
    }
    const body = (await res.json()) as {
      hourly?: { time?: string[]; uv_index?: number[] };
    };

    const times = body.hourly?.time ?? [];
    const uvs = body.hourly?.uv_index ?? [];

    const len = Math.min(times.length, uvs.length);
    const points: UvForecastPoint[] = [];

    for (let i = 0; i < len; i++) {
      const uv = typeof uvs[i] === "number" ? uvs[i] : 0;
      points.push({ time: String(times[i]), uv: Number.isFinite(uv) ? uv : 0 });
    }

    return points;
  } catch (err) {
    if (err instanceof Error && !err.message.startsWith("Open-Meteo")) {
      console.error("[openmeteo] uv forecast request error:", err.message);
    }
    throw err;
  }
}
