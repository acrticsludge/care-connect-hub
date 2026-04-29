"use client";

import { useState, useCallback, useRef } from "react";
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
  const [status, setStatus] = useState<Status>("idle");
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const abortRef = useRef<AbortController | null>(null);

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
      void doFetch(lat, lon);
    },
    [doFetch],
  );

  const showMap = status === "ready" || status === "fetching" || status === "fetch-error";
  const mapCenter: [number, number] = userCoords
    ? [userCoords.lon, userCoords.lat]
    : [0, 20];
  const mapZoom = userCoords ? 13 : 1.5;

  return (
    <div className="pt-16 flex flex-col" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <PageShell className="pb-4 pt-8">
        <h1 className="text-[28px] font-bold text-[#1C1A0F] tracking-[-0.02em] mb-1">
          Hospitals near you
        </h1>
        <p className="text-[15px] text-[#57522A] leading-relaxed">
          Find hospitals and clinics in your area using your device location.
        </p>
      </PageShell>

      {/* Map container */}
      <div className="flex-1 relative min-h-[420px] mx-4 md:mx-8 mb-6 rounded-2xl overflow-hidden border border-[#FDE68A]">
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

        {/* Location permission overlay */}
        {status === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FFFEF5]/80 backdrop-blur-sm z-10">
            <div className="bg-white border border-[#FDE68A] rounded-2xl px-6 py-6 flex flex-col items-center gap-3 shadow-[0_4px_16px_rgba(245,197,24,0.18)] max-w-[280px] text-center">
              <div className="w-12 h-12 bg-[#FEFCE8] border border-[#FDE68A] rounded-xl flex items-center justify-center">
                <MapPin size={22} strokeWidth={1.5} className="text-[#D4A810]" />
              </div>
              <div className="text-[15px] font-semibold text-[#1C1A0F]">
                Enable location
              </div>
              <div className="text-[13px] text-[#57522A] leading-relaxed">
                Allow location access to find hospitals near you.
              </div>
              <Button
                onClick={locate}
                className="w-full bg-[#F5C518] text-[#1C1A0F] font-bold hover:bg-[#D4A810] shadow-[0_2px_8px_rgba(245,197,24,0.50)] min-h-[48px]"
              >
                Enable location
              </Button>
            </div>
          </div>
        )}

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
      </div>

      {/* Legend */}
      {showMap && (
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
      )}

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
