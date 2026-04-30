"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import {
  MapPin,
  ExternalLink,
  RotateCcw,
  AlertCircle,
  Navigation,
  Building2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MapControls,
} from "@/components/ui/map";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────

type Status =
  | "idle"
  | "locating"
  | "fetching"
  | "ready"
  | "geo-denied"
  | "fetch-error";

interface Hospital {
  id: number;
  name: string;
  amenity: "hospital" | "clinic";
  lat: number;
  lon: number;
  distKm: number;
  travelMin: number;
}

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: { name?: string; amenity?: string; [key: string]: string | undefined };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function travelMinutes(distKm: number): number {
  return Math.max(1, Math.round((distKm / 30) * 60));
}

async function fetchHospitals(
  lat: number,
  lon: number,
  signal: AbortSignal,
): Promise<Hospital[]> {
  const query = `[out:json][timeout:15];
(
  node["amenity"="hospital"](around:10000,${lat},${lon});
  node["amenity"="clinic"](around:10000,${lat},${lon});
  way["amenity"="hospital"](around:10000,${lat},${lon});
  way["amenity"="clinic"](around:10000,${lat},${lon});
);
out center;`;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
    signal,
  });

  if (!res.ok) {
    throw new Error(`Overpass API error: ${res.status}`);
  }

  const data: OverpassResponse = await res.json();

  return data.elements
    .flatMap((el): Hospital[] => {
      const elLat = el.lat ?? el.center?.lat;
      const elLon = el.lon ?? el.center?.lon;
      if (elLat == null || elLon == null) return [];

      const amenity =
        el.tags?.amenity === "hospital" ? "hospital" : "clinic";
      const distKm = haversineKm(lat, lon, elLat, elLon);

      return [
        {
          id: el.id,
          name: el.tags?.name ?? (amenity === "hospital" ? "Hospital" : "Clinic"),
          amenity,
          lat: elLat,
          lon: elLon,
          distKm,
          travelMin: travelMinutes(distKm),
        },
      ];
    })
    .sort((a, b) => a.distKm - b.distKm);
}

// ── Sub-components ─────────────────────────────────────────────────────────

function HospitalMarker({ hospital }: { hospital: Hospital }) {
  return (
    <MapMarker longitude={hospital.lon} latitude={hospital.lat}>
      <MarkerContent>
        <div
          className={cn(
            "w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center",
            hospital.amenity === "hospital"
              ? "bg-[#DC2626]"
              : "bg-[#D4A810]",
          )}
        >
          <Building2 size={14} strokeWidth={2} className="text-white" />
        </div>
      </MarkerContent>
      <MarkerPopup closeButton>
        <div className="min-w-[180px] p-1">
          <div className="text-[13px] font-semibold text-[#1C1A0F] mb-0.5 pr-4">
            {hospital.name}
          </div>
          <div className="text-[11px] font-bold tracking-[0.06em] uppercase text-[#A39A5C] mb-2">
            {hospital.amenity}
          </div>
          <div className="text-[12px] text-[#57522A] mb-2">
            {hospital.distKm < 1
              ? `${Math.round(hospital.distKm * 1000)} m away`
              : `${hospital.distKm.toFixed(1)} km away`}
            {" · "}~{hospital.travelMin} min drive
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lon}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${hospital.name} in Google Maps`}
            className="inline-flex items-center gap-1 text-[12px] text-[#D4A810] hover:underline font-medium"
          >
            <ExternalLink size={11} strokeWidth={2} />
            Open in Google Maps
          </a>
        </div>
      </MarkerPopup>
    </MapMarker>
  );
}

function UserMarker({ lat, lon }: { lat: number; lon: number }) {
  return (
    <MapMarker longitude={lon} latitude={lat}>
      <MarkerContent>
        <div className="w-4 h-4 bg-[#2563EB] rounded-full border-2 border-white shadow-lg ring-4 ring-[#2563EB]/20" />
      </MarkerContent>
    </MapMarker>
  );
}

function HospitalListItem({
  hospital,
  index,
}: {
  hospital: Hospital;
  index: number;
}) {
  return (
    <div className="bg-white border border-[#FDE68A] rounded-xl px-5 py-4 flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-[#FEFCE8] border border-[#FDE68A] flex items-center justify-center shrink-0 text-[13px] font-bold text-[#D4A810]">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold text-[#1C1A0F] leading-snug truncate">
          {hospital.name}
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="text-[11px] font-bold tracking-[0.06em] uppercase text-[#A39A5C]">
            {hospital.amenity}
          </span>
          <span className="flex items-center gap-1 text-[12px] text-[#57522A]">
            <MapPin size={11} strokeWidth={1.5} className="text-[#D4A810]" />
            {hospital.distKm < 1
              ? `${Math.round(hospital.distKm * 1000)} m`
              : `${hospital.distKm.toFixed(1)} km`}
          </span>
          <span className="flex items-center gap-1 text-[12px] text-[#57522A]">
            <Clock size={11} strokeWidth={1.5} className="text-[#D4A810]" />
            ~{hospital.travelMin} min drive (approx.)
          </span>
        </div>
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lon}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 flex items-center gap-1 text-[12px] font-medium text-[#D4A810] hover:underline min-h-[44px] items-center"
        aria-label={`Open ${hospital.name} in Google Maps`}
      >
        <ExternalLink size={14} strokeWidth={1.5} />
      </a>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function HospitalNearbyPage() {
  const [status, setStatus] = useState<Status>("locating");
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const hasLocatedRef = useRef(false);
  const [manualLocation, setManualLocation] = useState<{
    name: string;
    lat: number;
    lon: number;
  } | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const doFetch = useCallback(async (lat: number, lon: number) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("fetching");
    try {
      const results = await fetchHospitals(lat, lon, controller.signal);
      if (!controller.signal.aborted) {
        setHospitals(results);
        setStatus("ready");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setStatus("fetch-error");
    }
  }, []);

  const locate = useCallback(() => {
    setStatus("locating");

    if (!("geolocation" in navigator)) {
      setStatus("geo-denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setUserCoords({ lat, lon });
        void doFetch(lat, lon);
      },
      () => {
        setStatus("geo-denied");
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  }, [doFetch]);

  const handleRelocate = useCallback(
    (coords: { longitude: number; latitude: number }) => {
      const lat = coords.latitude;
      const lon = coords.longitude;
      setUserCoords({ lat, lon });
      setManualLocation(null);
      sessionStorage.removeItem("hospital_manual_location");
      void doFetch(lat, lon);
    },
    [doFetch],
  );

  const handleSetManualLocation = useCallback((lat: number, lon: number, name: string) => {
    const location = { name, lat, lon };
    setManualLocation(location);
    setUserCoords({ lat, lon });
    sessionStorage.setItem("hospital_manual_location", JSON.stringify(location));
    void doFetch(lat, lon);
    setShowLocationPicker(false);
  }, [doFetch]);

  const handleUseMyLocation = useCallback(() => {
    setManualLocation(null);
    sessionStorage.removeItem("hospital_manual_location");
    locate();
  }, [locate]);

  // Auto-request location on mount (only if no manual location set)
  useEffect(() => {
    if (hasLocatedRef.current) return;
    hasLocatedRef.current = true;

    // Check sessionStorage for manual location
    const stored = sessionStorage.getItem("hospital_manual_location");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setManualLocation(parsed);
        setUserCoords({ lat: parsed.lat, lon: parsed.lon });
        void doFetch(parsed.lat, parsed.lon);
        return;
      } catch {
        sessionStorage.removeItem("hospital_manual_location");
      }
    }

    locate();
  }, [locate, doFetch]);

  const mapCenter: [number, number] = userCoords
    ? [userCoords.lon, userCoords.lat]
    : [78.9629, 20.5937]; // Default to India center
  const mapZoom = userCoords ? 13 : 5;

  // Preset cities for manual location picker
  const PRESET_CITIES = [
    { name: "Delhi", lat: 28.6139, lon: 77.2090 },
    { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
    { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
    { name: "Chennai", lat: 13.0827, lon: 80.2707 },
    { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
    { name: "Hyderabad", lat: 17.3850, lon: 78.4867 },
    { name: "Pune", lat: 18.5204, lon: 73.8567 },
    { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
    { name: "Jaipur", lat: 26.9124, lon: 75.7873 },
    { name: "Lucknow", lat: 26.8467, lon: 80.9462 },
  ];

  return (
    <div className="pt-16">
      {/* Header */}
      <PageShell className="pb-4 pt-8">
        <div className="flex items-start justify-between gap-4 mb-1">
          <div>
            <h1 className="text-[28px] font-bold text-[#1C1A0F] tracking-[-0.02em] mb-1">
              Hospitals near you
            </h1>
            <p className="text-[15px] text-[#57522A] leading-relaxed">
              Find hospitals and clinics in your area using your device location.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {manualLocation && (
              <div className="text-[12px] text-[#D4A810] font-medium bg-[#FEFCE8] border border-[#FDE68A] rounded-lg px-3 py-1.5 flex items-center gap-2">
                <Search size={12} strokeWidth={2} />
                Showing: {manualLocation.name}
                <button
                  onClick={handleUseMyLocation}
                  className="ml-1 text-[11px] text-[#57522A] hover:text-[#1C1A0F] underline"
                >
                  Use my location
                </button>
              </div>
            )}
            <Button
              onClick={() => setShowLocationPicker(true)}
              variant="outline"
              className="border-[#FDE68A] text-[#57522A] hover:bg-[#FEFCE8] gap-2 min-h-[40px] h-auto"
            >
              <Search size={14} strokeWidth={1.5} />
              Change location
            </Button>
          </div>
        </div>
      </PageShell>

      {/* Map container */}
      <div className="relative h-[420px] mx-4 md:mx-8 mb-6 rounded-2xl overflow-hidden border border-[#FDE68A]">
        <Map
          theme="light"
          center={mapCenter}
          zoom={mapZoom}
          className="absolute inset-0"
        >
          <MapControls
            showZoom
            showLocate
            position="bottom-right"
            onLocate={handleRelocate}
          />
          {userCoords && (
            <UserMarker lat={userCoords.lat} lon={userCoords.lon} />
          )}
          {status === "ready" &&
            hospitals.map((h) => (
              <HospitalMarker key={h.id} hospital={h} />
            ))}
        </Map>

        {/* Locating / fetching spinner overlay */}
        {(status === "locating" || status === "fetching") && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FFFEF5]/70 backdrop-blur-sm z-10 pointer-events-none">
            <div className="bg-white border border-[#FDE68A] rounded-2xl px-6 py-5 flex items-center gap-3 shadow-md">
              <Navigation
                size={20}
                strokeWidth={1.5}
                className="text-[#D4A810] animate-pulse"
              />
              <span className="text-[14px] font-medium text-[#1C1A0F]">
                {status === "locating" ? "Getting your location…" : "Finding hospitals…"}
              </span>
            </div>
          </div>
        )}

        {/* Geo-denied overlay */}
        {status === "geo-denied" && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FFFEF5]/80 backdrop-blur-sm z-10">
            <div className="bg-white border border-[#FECACA] rounded-2xl px-6 py-6 flex flex-col items-center gap-3 shadow-md max-w-[300px] text-center">
              <AlertCircle size={28} strokeWidth={1.5} className="text-[#B91C1C]" />
              <div className="text-[15px] font-semibold text-[#1C1A0F]">
                Location access denied
              </div>
              <div className="text-[13px] text-[#57522A] leading-relaxed">
                Please enable location permissions in your browser settings and try again.
              </div>
              <Button
                onClick={locate}
                variant="outline"
                className="border-[#FDE68A] text-[#57522A] hover:bg-[#FEFCE8] gap-2 min-h-[48px]"
              >
                <RotateCcw size={14} strokeWidth={2} />
                Try again
              </Button>
            </div>
          </div>
        )}

        {/* Fetch-error overlay */}
        {status === "fetch-error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FFFEF5]/80 backdrop-blur-sm z-10">
            <div className="bg-white border border-[#FECACA] rounded-2xl px-6 py-6 flex flex-col items-center gap-3 shadow-md max-w-[300px] text-center">
              <AlertCircle size={28} strokeWidth={1.5} className="text-[#B91C1C]" />
              <div className="text-[15px] font-semibold text-[#1C1A0F]">
                Search failed
              </div>
              <div className="text-[13px] text-[#57522A] leading-relaxed">
                Could not fetch hospital data. Check your connection and try again.
              </div>
              <Button
                onClick={locate}
                className="bg-[#F5C518] text-[#1C1A0F] font-bold hover:bg-[#D4A810] gap-2 min-h-[48px]"
              >
                <RotateCcw size={14} strokeWidth={2} />
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Location picker modal */}
        {showLocationPicker && (
          <div className="absolute inset-0 bg-[#FFFEF5]/90 backdrop-blur-sm z-20 flex items-center justify-center p-4">
            <div className="bg-white border border-[#FDE68A] rounded-2xl shadow-lg w-full max-w-md">
              <div className="flex items-center justify-between p-4 border-b border-[#FDE68A]">
                <div className="text-[16px] font-bold text-[#1C1A0F]">Select location</div>
                <button
                  onClick={() => setShowLocationPicker(false)}
                  className="p-2 hover:bg-[#FEFCE8] rounded-lg transition-colors"
                  aria-label="Close location picker"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#57522A]">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto">
                {PRESET_CITIES.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => handleSetManualLocation(city.lat, city.lon, city.name)}
                    className="flex flex-col items-start p-3 rounded-xl border border-[#FDE68A] hover:bg-[#FEFCE8] hover:border-[#D4A810] transition-colors text-left"
                  >
                    <div className="text-[14px] font-semibold text-[#1C1A0F]">{city.name}</div>
                    <div className="text-[11px] text-[#57522A]">
                      {city.lat.toFixed(2)}°N, {city.lon.toFixed(2)}°E
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-[#FDE68A]">
                <Button
                  onClick={handleUseMyLocation}
                  className="w-full bg-[#F5C518] text-[#1C1A0F] font-bold hover:bg-[#D4A810] min-h-[48px] gap-2"
                >
                  <Navigation size={16} strokeWidth={2} />
                  Use my current location
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mx-4 md:mx-8 mb-4 flex items-center gap-5 flex-wrap">
        <span className="flex items-center gap-1.5 text-[12px] text-[#57522A]">
          <span className="w-3 h-3 rounded-full bg-[#DC2626] border border-white shadow-sm" />
          Hospital
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-[#57522A]">
          <span className="w-3 h-3 rounded-full bg-[#D4A810] border border-white shadow-sm" />
          Clinic
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-[#57522A]">
          <span className="w-3 h-3 rounded-full bg-[#2563EB] border border-white shadow-sm" />
          Your location
        </span>
      </div>

      {/* Hospital list */}
      {status === "ready" && (
        <div className="mx-4 md:mx-8 mb-8">
          {hospitals.length === 0 ? (
            <div className="bg-white border border-[#FDE68A] rounded-xl px-6 py-8 text-center">
              <div className="text-[15px] font-semibold text-[#1C1A0F] mb-1">
                No hospitals found
              </div>
              <div className="text-[13px] text-[#57522A]">
                No hospitals or clinics found within 10 km of your location.
              </div>
            </div>
          ) : (
            <>
              <div className="text-[12px] font-bold text-[#A39A5C] tracking-[0.07em] uppercase mb-3">
                {hospitals.length} result{hospitals.length !== 1 ? "s" : ""} within 10 km — sorted by distance
              </div>
              <div className="flex flex-col gap-2">
                {hospitals.map((h, i) => (
                  <HospitalListItem key={h.id} hospital={h} index={i} />
                ))}
              </div>
              <p className="mt-4 text-[11px] text-[#A39A5C] leading-relaxed">
                Distance and travel time are straight-line estimates only. Actual travel time will vary. Data from OpenStreetMap contributors via Overpass API.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
