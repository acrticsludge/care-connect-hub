"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";

export default function ResultError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <PageShell className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-14 h-14 bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl flex items-center justify-center mb-4">
        <AlertTriangle size={24} strokeWidth={1.5} className="text-[#D97706]" />
      </div>
      <h1 className="text-[24px] font-bold text-[#1C1A0F] mb-2">
        Could not load results
      </h1>
      <p className="text-[14px] text-[#57522A] max-w-sm mb-6 leading-relaxed">
        Something went wrong while loading your results. Please try again or
        start a new check.
      </p>
      <div className="flex gap-3">
        <Button
          onClick={reset}
          className="bg-[#F5C518] text-[#1C1A0F] font-bold hover:bg-[#D4A810] min-h-[48px]"
        >
          Try again
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-[#FDE68A] text-[#57522A] hover:bg-[#FEFCE8] min-h-[48px]"
        >
          <Link href="/check">New check</Link>
        </Button>
      </div>
    </PageShell>
  );
}
