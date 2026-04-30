"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, Activity, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveCheck } from "@/app/history/actions";
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
import { SYMPTOM_CATEGORIES, DURATION_OPTIONS, RED_FLAG_PATTERNS } from "@/lib/dummy-data";
import type { AnalyzeResult } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

export default function CheckPage() {
  const router = useRouter();
  const [symptomText, setSymptomText] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [age, setAge] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("age")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.age) setAge(String(data.age));
        });
    });
  }, []);

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

  function checkRedFlag(text: string): boolean {
    const lower = text.toLowerCase();
    return RED_FLAG_PATTERNS.some((p) => p.keywords.every((kw) => lower.includes(kw)));
  }

  async function handleAnalyze() {
    const pillsText =
      selected.size > 0 ? `\nAdditional symptoms: ${[...selected].join(", ")}` : "";
    const fullText = `${symptomText.trim()}${pillsText}`;

    setLoading(true);
    setError(null);

    if (checkRedFlag(fullText)) {
      const redFlagResult = { red_flag: true, possible_conditions: [], severity: "high" as const, immediate_actions: "", precautions: "", specialist: "", disclaimer: "" };
      sessionStorage.setItem("ccr_analysis", JSON.stringify(redFlagResult));
      sessionStorage.setItem("ccr_symptoms", fullText);
      await saveCheck(fullText, redFlagResult);
      router.push("/result?redflag=true");
      return;
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText: fullText, age: age || undefined, duration: duration || undefined }),
      });

      const data: AnalyzeResult & { error?: string } = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Analysis failed. Please try again.");
      }

      sessionStorage.setItem("ccr_analysis", JSON.stringify(data));
      sessionStorage.setItem("ccr_symptoms", fullText);

      await saveCheck(fullText, data);

      if (data.red_flag) {
        router.push("/result?redflag=true");
      } else {
        router.push("/result");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      setLoading(false);
    }
  }

  const canSubmit = symptomText.trim().length > 0 && !loading;

  return (
    <PageShell>
      {/* Eyebrow */}
      <div className="text-[12px] font-bold text-[#D4A810] tracking-[0.08em] uppercase mb-2">
        Step 1 of 2
      </div>
      <h1 className="text-[30px] font-bold text-[#1C1A0F] tracking-[-0.02em] mb-2">
        Describe your symptoms
      </h1>
      <p className="text-[15px] text-[#57522A] leading-relaxed mb-8">
        Tell us what you are experiencing. Add details, duration, and context.
      </p>

      {/* Error banner */}
      {error && (
        <div className="mb-6 rounded-lg border border-[#FECACA] bg-[#FEE2E2] px-4 py-3 flex gap-2 items-start text-[13px] text-[#B91C1C]">
          <AlertCircle size={16} strokeWidth={2} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Primary input */}
      <div className="bg-white border border-[#FDE68A] rounded-[10px] px-4 py-3 mb-6 flex gap-3">
        <Textarea
          placeholder="e.g. I have had a sore throat and mild fever for the past two days, along with some fatigue and a runny nose..."
          className="border-none shadow-none resize-none min-h-[96px] p-0 text-[15px] text-[#57522A] bg-transparent focus-visible:ring-0 flex-1"
          value={symptomText}
          onChange={(e) => setSymptomText(e.target.value)}
          disabled={loading}
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

      {/* Context fields */}
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
            disabled={loading}
            className="border-none shadow-none p-0 h-auto text-[15px] font-semibold text-[#1C1A0F] bg-transparent focus-visible:ring-0 w-16"
          />
        </div>
        <div className="bg-white border border-[#FDE68A] rounded-[10px] px-4 py-2.5 flex flex-col gap-1 min-w-[190px]">
          <Label className="text-[11px] font-bold text-[#A39A5C] tracking-[0.05em] uppercase">
            Duration
          </Label>
          <Select value={duration} onValueChange={setDuration} disabled={loading}>
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

      {/* Optional symptom pills */}
      <div className="text-[12px] font-bold text-[#A39A5C] tracking-[0.07em] uppercase mb-3">
        Quick-add symptoms (optional)
      </div>
      {SYMPTOM_CATEGORIES.map((cat) => (
        <div key={cat.label} className="mb-5">
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
                  disabled={loading}
                  className={cn(
                    "px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-150 select-none min-h-[36px] disabled:opacity-50",
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
            {loading ? "Analyzing…" : symptomText.trim() ? "Ready to analyze" : "Describe symptoms above"}
          </div>
          <div className="text-[13px] text-[#A39A5C] mt-0.5">
            {selected.size > 0 ? `${selected.size} pill${selected.size !== 1 ? "s" : ""} selected` : "Free text + optional pills"}
          </div>
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={!canSubmit}
          className={cn(
            "font-bold text-[15px] px-7 py-3 h-auto rounded-xl transition-all gap-2 min-h-[48px]",
            canSubmit
              ? "bg-[#F5C518] text-[#1C1A0F] hover:bg-[#D4A810] shadow-[0_2px_10px_rgba(245,197,24,0.50)]"
              : "bg-[#F5F0E0] text-[#A39A5C] cursor-not-allowed",
          )}
        >
          {loading ? (
            <>
              <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
              Analyzing
            </>
          ) : (
            <>
              <Activity size={16} strokeWidth={2.5} />
              Analyze Symptoms
            </>
          )}
        </Button>
      </div>
    </PageShell>
  );
}
