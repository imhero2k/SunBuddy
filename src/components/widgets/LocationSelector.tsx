import React, { useState, useEffect } from "react";

type City = {
  name: string;
  lat: number;
  lon: number;
};

const AUSTRALIAN_CITIES: City[] = [
  { name: "Sydney", lat: -33.87, lon: 151.21 },
  { name: "Melbourne", lat: -37.81, lon: 144.96 },
  { name: "Brisbane", lat: -27.47, lon: 153.03 },
  { name: "Perth", lat: -31.95, lon: 115.86 },
  { name: "Adelaide", lat: -34.93, lon: 138.6 },
  { name: "Canberra", lat: -35.28, lon: 149.13 },
  { name: "Darwin", lat: -12.46, lon: 130.84 },
  { name: "Hobart", lat: -42.98, lon: 147.32 },
  { name: "Gold Coast", lat: -28.0, lon: 153.43 },
  { name: "Newcastle", lat: -32.93, lon: 151.78 },
  { name: "Townsville", lat: -19.26, lon: 146.82 },
  { name: "Alice Springs", lat: -23.7, lon: 133.88 },
  { name: "Cairns", lat: -16.92, lon: 145.78 },
  { name: "Wollongong", lat: -34.43, lon: 150.89 },
  { name: "Geelong", lat: -38.15, lon: 144.36 }
];

type Props = {
  onLocationChange: (lat: number, lon: number) => void;
  currentLat?: number;
  currentLon?: number;
};

export const LocationSelector: React.FC<Props> = ({
  onLocationChange,
  currentLat,
  currentLon
}) => {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Find current city based on coordinates
  useEffect(() => {
    if (currentLat != null && currentLon != null) {
      const city = AUSTRALIAN_CITIES.find(
        (c) =>
          Math.abs(c.lat - currentLat) < 0.1 && Math.abs(c.lon - currentLon) < 0.1
      );
      if (city) {
        setSelectedCity(city.name);
      }
    }
  }, [currentLat, currentLon]);

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    setError(null);
    const city = AUSTRALIAN_CITIES.find((c) => c.name === cityName);
    if (city) {
      onLocationChange(city.lat, city.lon);
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 8000
          });
        }
      );
      const newLat = position.coords.latitude;
      const newLon = position.coords.longitude;
      
      // Try to find nearest city
      let nearestCity: City | null = null;
      let minDistance = Infinity;
      
      AUSTRALIAN_CITIES.forEach((city) => {
        const distance = Math.sqrt(
          Math.pow(city.lat - newLat, 2) + Math.pow(city.lon - newLon, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestCity = city;
        }
      });

      if (nearestCity && minDistance < 1.0) {
        setSelectedCity(nearestCity.name);
        onLocationChange(nearestCity.lat, nearestCity.lon);
      } else {
        // Use exact coordinates if no nearby city
        onLocationChange(newLat, newLon);
        setSelectedCity("");
      }
      setError(null);
    } catch (err) {
      setError("Could not get your location. Please select a city.");
    }
  };

  return (
    <article className="ios-card p-4 bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-600 font-medium">Location</span>
        <span className="text-base">📍</span>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-[10px] text-slate-600 block mb-1.5">Select City</label>
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800"
          >
            <option value="">Choose a city...</option>
            {AUSTRALIAN_CITIES.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p className="text-[10px] text-red-600">{error}</p>
        )}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="w-full px-3 py-2 text-xs font-medium bg-white/80 text-slate-700 rounded-lg border border-slate-200 hover:bg-white transition-colors"
        >
          📍 Use Current Location
        </button>
        {selectedCity && (
          <p className="text-[10px] text-slate-500 mt-2 text-center">
            Viewing forecast for {selectedCity}
          </p>
        )}
      </div>
    </article>
  );
};
