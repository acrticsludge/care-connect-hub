"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";

export default function HospitalNearbyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="pt-16" style={{ minHeight: "100vh" }}>
      <PageShell className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-14 h-14 bg-[#FEFCE8] border border-[#FDE68A] rounded-2xl flex items-center justify-center mb-4">
          <AlertTriangle size={26} strokeWidth={1.5} className="text-[#D4A810]" />
        </div>
        <h1 className="text-[22px] font-bold text-[#1C1A0F] mb-2">Something went wrong</h1>
        <p className="text-[14px] text-[#57522A] text-center mb-6">
          The hospital locator encountered an error. Please try again.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={reset}
            className="bg-[#F5C518] text-[#1C1A0F] font-bold hover:bg-[#D4A810] shadow-[0_2px_8px_rgba(245,197,24,0.50)] gap-2 min-h-[48px]"
          >
            <RotateCcw size={16} strokeWidth={2} />
            Try again
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[#FDE68A] text-[#57522A] hover:bg-[#FEFCE8] min-h-[48px]"
          >
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </PageShell>
    </div>
  );
}
