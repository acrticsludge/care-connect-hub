"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  Stethoscope,
  Phone,
  AlertTriangle,
  MapPin,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";
import { SeverityBadge } from "@/components/severity-badge";
import { ConfidenceBar } from "@/components/confidence-bar";
import type { AnalyzeResult, Severity } from "@/lib/dummy-data";

function severityUpper(s: string): Severity {
  const up = s.toUpperCase();
  if (up === "LOW" || up === "MODERATE" || up === "HIGH") return up;
  return "MODERATE";
}

function EmergencyScreen({ actions }: { actions?: string }) {
  return (
    <PageShell>
      <div className="rounded-2xl border-2 border-[#FECACA] bg-[#FEE2E2] px-6 py-8 mb-6 text-center">
        <div className="w-14 h-14 bg-[#DC2626] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={28} strokeWidth={2} className="text-white" />
        </div>
        <div className="text-[12px] font-bold text-[#B91C1C] tracking-[0.10em] uppercase mb-2">
          Emergency detected
        </div>
        <h1 className="text-[28px] font-bold text-[#7F1D1D] tracking-[-0.01em] mb-3">
          Seek immediate care
        </h1>
        <p className="text-[15px] text-[#991B1B] leading-relaxed mb-6 max-w-md mx-auto">
          Your symptoms may indicate a life-threatening condition. Do not wait — call emergency services now.
        </p>
        <a
          href="tel:911"
          className="inline-flex items-center gap-2 bg-[#DC2626] text-white font-bold text-[16px] px-8 py-4 rounded-xl shadow-lg hover:bg-[#B91C1C] transition-colors min-h-[56px]"
        >
          <Phone size={20} strokeWidth={2.5} />
          Call 911 now
        </a>
      </div>

      {actions && (
        <div className="bg-white border border-[#FECACA] rounded-xl px-6 py-5 mb-6">
          <div className="text-[12px] font-bold text-[#B91C1C] tracking-[0.07em] uppercase mb-2">
            Immediate actions
          </div>
          <p className="text-[14px] text-[#57522A] leading-relaxed">{actions}</p>
        </div>
      )}

      <div className="bg-white border border-[#FDE68A] rounded-xl px-6 py-5 mb-6 flex gap-3 items-center">
        <MapPin size={20} strokeWidth={1.5} className="text-[#D4A810] shrink-0" />
        <div>
          <div className="text-[14px] font-semibold text-[#1C1A0F]">
            Find the nearest hospital
          </div>
          <Link
            href="/hospital-nearby"
            className="text-[13px] text-[#D4A810] hover:underline font-medium"
          >
            Open hospital finder
          </Link>
        </div>
      </div>

      <p className="text-[12px] text-[#A39A5C] leading-relaxed mb-6">
        <strong className="font-semibold text-[#57522A]">Medical disclaimer:</strong> This is
        not a medical diagnosis. Always consult qualified emergency medical personnel immediately
        if you believe you are experiencing a medical emergency.
      </p>

      <Button
        asChild
        variant="outline"
        className="border-2 border-[#FDE68A] text-[#1C1A0F] hover:bg-[#FEFCE8] gap-2 min-h-[48px]"
      >
        <Link href="/check">
          <ArrowLeft size={16} strokeWidth={2} />
          Back to symptom checker
        </Link>
      </Button>
    </PageShell>
  );
}

function NoResultScreen() {
  return (
    <PageShell className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-14 h-14 bg-[#FEFCE8] border border-[#FDE68A] rounded-2xl flex items-center justify-center mb-4">
        <AlertTriangle size={26} strokeWidth={1.5} className="text-[#D4A810]" />
      </div>
      <h1 className="text-[22px] font-bold text-[#1C1A0F] mb-2">No analysis found</h1>
      <p className="text-[14px] text-[#57522A] text-center mb-6">
        It looks like you arrived here without completing a symptom check.
      </p>
      <Button
        asChild
        className="bg-[#F5C518] text-[#1C1A0F] font-bold hover:bg-[#D4A810] shadow-[0_2px_8px_rgba(245,197,24,0.50)] gap-2 min-h-[48px]"
      >
        <Link href="/check">
          <Activity size={16} strokeWidth={2.5} />
          Check symptoms
        </Link>
      </Button>
    </PageShell>
  );
}

function AnalysisScreen({ result }: { result: AnalyzeResult }) {
  const sev = severityUpper(result.severity);
  const conditionCount = result.possible_conditions.length;

  return (
    <PageShell>
      {/* Summary banner */}
      <div className="bg-[#FEFCE8] border border-[#FDE68A] rounded-xl px-6 py-5 mb-8 flex justify-between items-start gap-4">
        <div>
          <div className="text-[12px] font-bold text-[#D4A810] tracking-[0.08em] uppercase mb-1.5">
            Analysis complete
          </div>
          <div className="text-[22px] font-bold text-[#1C1A0F] tracking-[-0.01em] mb-1">
            {conditionCount > 0
              ? `${conditionCount} possible condition${conditionCount !== 1 ? "s" : ""} found`
              : "Analysis complete"}
          </div>
          <div className="flex items-center gap-2">
            <SeverityBadge level={sev} />
            <span className="text-[13px] text-[#57522A]">overall severity</span>
          </div>
        </div>
        <div
          className="w-12 h-12 bg-[#F5C518] rounded-xl flex items-center justify-center shrink-0"
          style={{ boxShadow: "0 2px 10px rgba(245,197,24,0.45)" }}
        >
          <Activity size={24} strokeWidth={2.2} className="text-[#1C1A0F]" />
        </div>
      </div>

      {/* Conditions */}
      {conditionCount > 0 && (
        <>
          <h2 className="text-[18px] font-semibold text-[#1C1A0F] mb-4">
            Possible conditions
          </h2>
          {result.possible_conditions.map((cond) => (
            <div
              key={cond.name}
              className="bg-white border border-[#FDE68A] rounded-xl px-6 py-5 mb-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-base font-semibold text-[#1C1A0F]">{cond.name}</div>
                <SeverityBadge level={sev} />
              </div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[12px] font-medium text-[#57522A]">Probability</span>
                <span
                  className={
                    sev === "HIGH"
                      ? "text-[12px] font-bold text-[#B91C1C]"
                      : sev === "MODERATE"
                        ? "text-[12px] font-bold text-[#B45309]"
                        : "text-[12px] font-bold text-[#15803D]"
                  }
                >
                  {cond.probability}%
                </span>
              </div>
              <ConfidenceBar pct={cond.probability} severity={sev} />
              {cond.description && (
                <p className="mt-4 pt-4 border-t border-[#FEFCE8] text-[13px] text-[#57522A] leading-relaxed">
                  {cond.description}
                </p>
              )}
            </div>
          ))}
        </>
      )}

      {/* Specialist */}
      {result.specialist && (
        <div className="bg-white border border-[#FDE68A] rounded-xl px-6 py-5 mt-2 mb-8 flex gap-3.5 items-start">
          <div className="w-10 h-10 bg-[#FEFCE8] border border-[#FDE68A] rounded-xl flex items-center justify-center shrink-0">
            <Stethoscope size={20} strokeWidth={1.5} className="text-[#D4A810]" />
          </div>
          <div>
            <div className="text-[13px] font-bold text-[#D4A810] tracking-[0.05em] uppercase mb-0.5">
              Specialist suggestion
            </div>
            <div className="text-[15px] font-semibold text-[#1C1A0F] leading-snug">
              {result.specialist}
            </div>
          </div>
        </div>
      )}

      {/* Precautions */}
      {result.precautions && (
        <>
          <h2 className="text-[18px] font-semibold text-[#1C1A0F] mb-4">
            What to do next
          </h2>
          <div className="bg-white border border-[#FDE68A] rounded-xl px-6 py-5 mb-8">
            <p className="text-[14px] text-[#57522A] leading-relaxed">{result.precautions}</p>
          </div>
        </>
      )}

      {/* Emergency callout */}
      <div className="rounded-xl border border-[#FECACA] bg-[#FEE2E2] px-6 py-5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} strokeWidth={2} className="text-[#B91C1C]" />
          <span className="text-[13px] font-bold text-[#B91C1C] tracking-[0.05em] uppercase">
            Seek emergency care immediately if you experience
          </span>
        </div>
        <ul className="space-y-1.5">
          {[
            "Severe chest pain or pressure",
            "Difficulty breathing at rest",
            "Sudden confusion or loss of consciousness",
            "Face drooping, arm weakness, or speech difficulty",
            "High fever above 104°F (40°C)",
          ].map((s) => (
            <li key={s} className="flex items-start gap-2 text-[13px] text-[#991B1B]">
              <span className="mt-1.5 w-1.5 h-1.5 bg-[#DC2626] rounded-full shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <p className="text-[12px] text-[#A39A5C] leading-relaxed mb-8">
        <strong className="font-semibold text-[#57522A]">Medical disclaimer:</strong>{" "}
        {result.disclaimer ||
          "These results are for informational purposes only and are not a medical diagnosis. Always consult a qualified healthcare provider for medical advice."}
      </p>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button
          asChild
          className="bg-[#F5C518] text-[#1C1A0F] font-bold hover:bg-[#D4A810] shadow-[0_2px_10px_rgba(245,197,24,0.50)] gap-2 min-h-[48px]"
        >
          <Link href="/check">
            <Activity size={16} strokeWidth={2.5} />
            Start over
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-2 border-[#F5C518] text-[#1C1A0F] hover:bg-[#FEFCE8] min-h-[48px]"
        >
          <Link href="/history">View history</Link>
        </Button>
      </div>
    </PageShell>
  );
}

export function ResultClient() {
  const searchParams = useSearchParams();
  const isRedflag = searchParams.get("redflag") === "true";
  // undefined = not yet hydrated; null = hydrated, no data found
  const [result, setResult] = useState<AnalyzeResult | null | undefined>(undefined);

  useEffect(() => {
    const stored = sessionStorage.getItem("ccr_analysis");
    if (!stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult(null);
      return;
    }
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult(JSON.parse(stored) as AnalyzeResult);
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult(null);
    }
  }, []);

  // Hydrating — render nothing to avoid SSR/sessionStorage mismatch flash
  if (result === undefined) return null;

  if (isRedflag) {
    return <EmergencyScreen actions={result?.immediate_actions} />;
  }
  if (!result) return <NoResultScreen />;
  return <AnalysisScreen result={result} />;
}
