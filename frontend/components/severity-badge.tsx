import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/dummy-data";

const severityConfig: Record<
  Severity,
  { bg: string; text: string; dot: string; label: string }
> = {
  LOW: {
    bg: "bg-[#DCFCE7]",
    text: "text-[#15803D]",
    dot: "bg-[#16A34A]",
    label: "LOW",
  },
  MODERATE: {
    bg: "bg-[#FEF3C7]",
    text: "text-[#B45309]",
    dot: "bg-[#D97706]",
    label: "MODERATE",
  },
  HIGH: {
    bg: "bg-[#FEE2E2]",
    text: "text-[#B91C1C]",
    dot: "bg-[#DC2626]",
    label: "HIGH",
  },
};

export function SeverityBadge({ level }: { level: Severity }) {
  const cfg = severityConfig[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px]",
        "text-[11px] font-bold tracking-[0.07em] uppercase",
        cfg.bg,
        cfg.text,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
      {cfg.label}
    </span>
  );
}
