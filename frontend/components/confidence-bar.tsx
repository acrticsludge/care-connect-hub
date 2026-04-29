"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/dummy-data";

const barColor: Record<Severity, string> = {
  LOW: "bg-[#16A34A]",
  MODERATE: "bg-[#D97706]",
  HIGH: "bg-[#DC2626]",
};

export function ConfidenceBar({
  pct,
  severity,
}: {
  pct: number;
  severity: Severity;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="h-[7px] bg-[#FEFCE8] rounded-full overflow-hidden">
      <div
        className={cn("h-full rounded-full", barColor[severity])}
        style={{
          width: `${width}%`,
          transition: "width 700ms ease-out",
        }}
      />
    </div>
  );
}
