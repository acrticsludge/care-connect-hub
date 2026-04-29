"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Map, MapControls } from "@/components/ui/map";
import { PageShell } from "@/components/page-shell";

export default function HospitalNearbyPage() {
  const [locationRequested, setLocationRequested] = useState(false);

  return (
    <div className="pt-16 flex flex-col" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <PageShell className="pb-4 pt-8">
        <h1 className="text-[28px] font-bold text-[#1C1A0F] tracking-[-0.02em] mb-1">
          Hospitals near you
        </h1>
        <p className="text-[15px] text-[#57522A] leading-relaxed">
          Find hospitals and urgent care centres in your area.
        </p>
      </PageShell>

      {/* Map container */}
      <div className="flex-1 relative min-h-[420px] mx-4 md:mx-8 mb-8 rounded-2xl overflow-hidden border border-[#FDE68A]">
        <Map
          theme="light"
          center={[0, 20]}
          zoom={1.5}
          className="absolute inset-0"
        >
          <MapControls showZoom showLocate position="bottom-right" />
        </Map>

        {/* Location overlay */}
        {!locationRequested && (
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
                onClick={() => setLocationRequested(true)}
                className="w-full bg-[#F5C518] text-[#1C1A0F] font-bold hover:bg-[#D4A810] shadow-[0_2px_8px_rgba(245,197,24,0.50)] min-h-[48px]"
              >
                Enable location
              </Button>
              {/* TODO: geolocation + hospital search in later prompt */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
