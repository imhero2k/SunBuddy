import React, { useState, useRef } from "react";

type GeoResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    suburb?: string;
    neighbourhood?: string;
    town?: string;
    city?: string;
    state?: string;
    country?: string;
  };
};

type Props = {
  onLocationChange: (lat: number, lon: number) => void;
  currentLat?: number;
  currentLon?: number;
};

export const LocationSelector: React.FC<Props> = ({ onLocationChange }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelectedLabel(null);
    setError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value.trim())}&format=json&limit=8&addressdetails=1&countrycodes=au`;
        const res = await fetch(url, { headers: { "Accept-Language": "en" } });
        const json = (await res.json()) as GeoResult[];
        setResults(json);
        setShowDropdown(true);
      } catch {
        setError("Could not search for locations");
        setResults([]);
        setShowDropdown(false);
      } finally {
        setSearching(false);
      }
    }, 350);
  };

  const handleSelect = (r: GeoResult) => {
    const addr = r.address ?? {};
    const suburb = addr.suburb ?? addr.neighbourhood ?? addr.town ?? addr.city ?? "";
    const label = [suburb, addr.state, addr.country].filter(Boolean).join(", ") || r.display_name;
    setQuery(label);
    setSelectedLabel(label);
    setResults([]);
    setShowDropdown(false);
    onLocationChange(parseFloat(r.lat), parseFloat(r.lon));
  };

  const handleUseCurrentLocation = async () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 8000
        });
      });
      const { latitude, longitude } = position.coords;
      setError(null);
      onLocationChange(latitude, longitude);

      // Reverse geocode to get a human-readable label
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
        const res = await fetch(url, {
          headers: { "Accept-Language": "en" }
        });
        const json = (await res.json()) as {
          address?: {
            suburb?: string;
            neighbourhood?: string;
            town?: string;
            city?: string;
            state?: string;
            country?: string;
          };
        };
        const addr = json.address ?? {};
        const suburb = addr.suburb ?? addr.neighbourhood ?? addr.town ?? addr.city ?? "";
        const state = addr.state ?? "";
        const label = [suburb, state].filter(Boolean).join(", ") || "Current Location";
        setSelectedLabel(label);
        setQuery("");
      } catch {
        // Reverse geocoding failed — fall back to generic label
        setSelectedLabel("Current Location");
        setQuery("");
      }
    } catch {
      setError("Could not get your location. Please search for a suburb.");
    }
  };

  const handleBlur = () => {
    // Delay hiding so clicks on results register first
    setTimeout(() => setShowDropdown(false), 150);
  };

  return (
    <article className="ios-card p-4 bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-600 font-medium">Location</span>
        <span className="text-base">📍</span>
      </div>
      <div className="space-y-3">
        <div className="relative">
          <label className="text-[10px] text-slate-600 block mb-1.5">Search suburb</label>
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="e.g. Bondi, Fitzroy, Fortitude Valley…"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800 placeholder-slate-400"
          />
          {searching && (
            <span className="absolute right-3 top-[2.1rem] text-[10px] text-slate-400">
              Searching…
            </span>
          )}
          {showDropdown && results.length > 0 && (
            <ul className="absolute z-10 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
              {results.map((r) => {
                const addr = r.address ?? {};
                const suburb = addr.suburb ?? addr.neighbourhood ?? addr.town ?? addr.city ?? "";
                const label = [suburb, addr.state, addr.country].filter(Boolean).join(", ") || r.display_name;
                return (
                  <li key={r.place_id}>
                    <button
                      type="button"
                      onMouseDown={() => handleSelect(r)}
                      className="w-full text-left px-3 py-2 text-sm text-slate-800 hover:bg-indigo-50 transition-colors"
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {showDropdown && !searching && results.length === 0 && query.trim().length >= 2 && (
            <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow px-3 py-2 text-sm text-slate-400">
              No results found
            </div>
          )}
        </div>

        {error && <p className="text-[10px] text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="w-full px-3 py-2 text-xs font-medium bg-white/80 text-slate-700 rounded-lg border border-slate-200 hover:bg-white transition-colors"
        >
          📍 Use Current Location
        </button>

        {selectedLabel && (
          <p className="text-[10px] text-slate-500 text-center">
            Viewing forecast for <span className="font-medium">{selectedLabel}</span>
          </p>
        )}
      </div>
    </article>
  );
};
