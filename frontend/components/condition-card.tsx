"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SeverityBadge } from "@/components/severity-badge";
import { ConfidenceBar } from "@/components/confidence-bar";
import type { Condition } from "@/lib/dummy-data";

export function ConditionCard({ condition, subtext, severity, confidence, description, tags }: Condition) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setExpanded((v) => !v)}
      onKeyDown={(e) => e.key === "Enter" && setExpanded((v) => !v)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "bg-white border rounded-xl px-6 py-5 cursor-pointer mb-3 transition-all duration-200 outline-none",
        hovered
          ? "border-[#FDE68A] shadow-[0_4px_16px_rgba(245,197,24,0.18)] scale-[1.005]"
          : "border-[#FDE68A] shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-base font-semibold text-[#1C1A0F]">{condition}</div>
          <div className="text-[13px] text-[#57522A] mt-0.5">{subtext}</div>
        </div>
        <SeverityBadge level={severity} />
      </div>

      <div className="flex justify-between mb-1.5">
        <span className="text-[12px] font-medium text-[#57522A]">Confidence</span>
        <span
          className={cn(
            "text-[12px] font-bold",
            severity === "LOW" && "text-[#15803D]",
            severity === "MODERATE" && "text-[#B45309]",
            severity === "HIGH" && "text-[#B91C1C]",
          )}
        >
          {confidence}%
        </span>
      </div>
      <ConfidenceBar pct={confidence} severity={severity} />

      {expanded && (
        <div className="mt-4 pt-4 border-t border-[#FEFCE8]">
          <p className="text-[13px] text-[#57522A] leading-relaxed">{description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[12px] font-medium bg-[#FEFCE8] text-[#57522A] px-2.5 py-1 rounded-[6px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
