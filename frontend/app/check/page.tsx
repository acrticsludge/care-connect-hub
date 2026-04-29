"use client";

import { useState } from "react";
import Link from "next/link";
import { Mic, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageShell } from "@/components/page-shell";
import { SYMPTOM_CATEGORIES, DURATION_OPTIONS } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

export default function CheckPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [age, setAge] = useState("");
  const [duration, setDuration] = useState("");

  function toggle(symptom: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(symptom)) {
        next.delete(symptom);
      } else {
        next.add(symptom);
      }
      return next;
    });
  }

  const count = selected.size;
  const summary =
    count === 0
      ? "Select at least one symptom to continue"
      : [...selected].slice(0, 3).join(", ") +
        (count > 3 ? ` +${count - 3} more` : "");

  return (
    <PageShell>
      {/* Eyebrow */}
      <div className="text-[12px] font-bold text-[#D4A810] tracking-[0.08em] uppercase mb-2">
        Step 1 of 2
      </div>
      <h1 className="text-[30px] font-bold text-[#1C1A0F] tracking-[-0.02em] mb-2">
        Select your symptoms
      </h1>
      <p className="text-[15px] text-[#57522A] leading-relaxed mb-8">
        Choose all that apply. Select as many as you need.
      </p>

      {/* Field cards */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="bg-white border border-[#FDE68A] rounded-[10px] px-4 py-2.5 flex flex-col gap-1 min-w-[90px]">
          <Label className="text-[11px] font-bold text-[#A39A5C] tracking-[0.05em] uppercase">
            Your age
          </Label>
          <Input
            type="number"
            min={1}
            max={120}
            placeholder="—"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border-none shadow-none p-0 h-auto text-[15px] font-semibold text-[#1C1A0F] bg-transparent focus-visible:ring-0 w-16"
          />
        </div>
        <div className="bg-white border border-[#FDE68A] rounded-[10px] px-4 py-2.5 flex flex-col gap-1 min-w-[190px]">
          <Label className="text-[11px] font-bold text-[#A39A5C] tracking-[0.05em] uppercase">
            Duration
          </Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="border-none shadow-none p-0 h-auto text-[15px] font-semibold text-[#1C1A0F] bg-transparent focus:ring-0 w-full">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Free-text + mic */}
      <div className="bg-white border border-[#FDE68A] rounded-[10px] px-4 py-3 mb-8 flex gap-3">
        <Textarea
          placeholder="Describe your symptoms in your own words (optional)..."
          className="border-none shadow-none resize-none min-h-[72px] p-0 text-[15px] text-[#57522A] bg-transparent focus-visible:ring-0 flex-1"
        />
        <Button
          variant="ghost"
          size="icon"
          disabled
          aria-label="Voice input coming soon"
          className="shrink-0 self-end text-[#A39A5C] cursor-not-allowed"
        >
          <Mic size={18} strokeWidth={1.5} />
        </Button>
      </div>

      {/* Symptom pill groups */}
      {SYMPTOM_CATEGORIES.map((cat) => (
        <div key={cat.label} className="mb-6">
          <div className="text-[11px] font-bold text-[#A39A5C] tracking-[0.07em] uppercase mb-2.5">
            {cat.label}
          </div>
          <div className="flex flex-wrap gap-2">
            {cat.symptoms.map((symptom) => {
              const active = selected.has(symptom);
              return (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => toggle(symptom)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-150 select-none min-h-[36px]",
                    active
                      ? "bg-[#F5C518] text-[#1C1A0F] border-[#F5C518] font-semibold shadow-[0_1px_6px_rgba(245,197,24,0.40)]"
                      : "bg-white text-[#57522A] border-[#FDE68A] hover:border-[#F5C518] hover:text-[#D4A810]",
                  )}
                >
                  {symptom}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Sticky footer card */}
      <div className="flex items-center justify-between mt-8 p-5 bg-white border border-[#FDE68A] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div>
          <div className="text-[15px] font-semibold text-[#1C1A0F]">
            {count} symptom{count !== 1 ? "s" : ""} selected
          </div>
          <div className="text-[13px] text-[#A39A5C] mt-0.5 truncate max-w-[200px] sm:max-w-none">
            {summary}
          </div>
        </div>
        <Button
          asChild
          disabled={count === 0}
          className={cn(
            "font-bold text-[15px] px-7 py-3 h-auto rounded-xl transition-all gap-2 min-h-[48px]",
            count > 0
              ? "bg-[#F5C518] text-[#1C1A0F] hover:bg-[#D4A810] shadow-[0_2px_10px_rgba(245,197,24,0.50)]"
              : "bg-[#F5F0E0] text-[#A39A5C] cursor-not-allowed",
          )}
        >
          <Link href={count > 0 ? "/result" : "#"}>
            <Activity size={16} strokeWidth={2.5} />
            Analyze Symptoms
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
