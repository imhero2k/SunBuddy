/**
 * ARPANSA UV data - Australian government, free, no API key.
 * Feed: https://uvdata.arpansa.gov.au/xml/uvvalues.xml
 */

const ARPANSA_URL = "https://uvdata.arpansa.gov.au/xml/uvvalues.xml";

/** Approximate coordinates for each ARPANSA station (used to find nearest) */
const STATION_COORDS: Record<string, { lat: number; lon: number }> = {
  Adelaide: { lat: -34.93, lon: 138.6 },
  "Alice Springs": { lat: -23.7, lon: 133.88 },
  Brisbane: { lat: -27.47, lon: 153.03 },
  Canberra: { lat: -35.28, lon: 149.13 },
  Casey: { lat: -66.28, lon: 110.52 },
  Darwin: { lat: -12.46, lon: 130.84 },
  Davis: { lat: -68.58, lon: 77.97 },
  Emerald: { lat: -23.52, lon: 148.16 },
  "Gold Coast": { lat: -28.0, lon: 153.43 },
  Kingston: { lat: -42.98, lon: 147.32 },
  "Macquarie Island": { lat: -54.5, lon: 158.94 },
  Mawson: { lat: -67.6, lon: 62.87 },
  Melbourne: { lat: -37.81, lon: 144.96 },
  Newcastle: { lat: -32.93, lon: 151.78 },
  Perth: { lat: -31.95, lon: 115.86 },
  Sydney: { lat: -33.87, lon: 151.21 },
  Townsville: { lat: -19.26, lon: 146.82 }
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestStation(lat: number, lon: number): string {
  let nearest = "";
  let minDist = Infinity;
  for (const [name, coords] of Object.entries(STATION_COORDS)) {
    const d = haversineKm(lat, lon, coords.lat, coords.lon);
    if (d < minDist) {
      minDist = d;
      nearest = name;
    }
  }
  return nearest;
}

export type ArpansaStation = {
  id: string;
  index: number;
  time: string;
  date: string;
};

export async function fetchArpansaUv(lat: number, lon: number): Promise<{ uvi: number; station?: string }> {
  const station = findNearestStation(lat, lon);

  try {
    const res = await fetch(ARPANSA_URL, {
      headers: { "User-Agent": "SunBuddy/1.0 (Australian UV dashboard)" }
    });

    if (!res.ok) {
      const msg = `ARPANSA ${res.status}: ${res.statusText}`;
      console.error("[arpansa] UV fetch fail:", msg);
      throw new Error(msg);
    }

    const xml = await res.text();

    const re = new RegExp(
      `<location id="${station.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}">[\\s\\S]*?<index>([^<]+)</index>`,
      "i"
    );
    const match = xml.match(re);

    if (!match) {
      const msg = `ARPANSA: station "${station}" not found in feed`;
      console.error("[arpansa]", msg);
      throw new Error(msg);
    }

    const uvi = parseFloat(match[1]);
    return { uvi: Number.isNaN(uvi) ? 0 : uvi, station };
  } catch (err) {
    if (err instanceof Error && !err.message.startsWith("ARPANSA")) {
      console.error("[arpansa] request error:", err.message);
    }
    throw err;
  }
}
