import Link from "next/link";
import { Activity, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";
import { ConditionCard } from "@/components/condition-card";
import { PrecautionList } from "@/components/precaution-list";
import { EmergencyCallout } from "@/components/emergency-callout";
import {
  DUMMY_RESULTS,
  DUMMY_PRECAUTIONS,
  DUMMY_SPECIALIST,
  EMERGENCY_SYMPTOMS,
} from "@/lib/dummy-data";

export default function ResultPage() {
  return (
    <PageShell>
      {/* Summary banner */}
      <div className="bg-[#FEFCE8] border border-[#FDE68A] rounded-xl px-6 py-5 mb-8 flex justify-between items-start">
        <div>
          <div className="text-[12px] font-bold text-[#D4A810] tracking-[0.08em] uppercase mb-1.5">
            Analysis complete
          </div>
          <div className="text-[22px] font-bold text-[#1C1A0F] tracking-[-0.01em]">
            Based on 3 symptoms
          </div>
          <div className="text-[14px] text-[#57522A] mt-1">
            We found {DUMMY_RESULTS.length} possible conditions, ranked by likelihood.
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
      <h2 className="text-[18px] font-semibold text-[#1C1A0F] mb-4">
        Possible conditions
      </h2>
      {DUMMY_RESULTS.map((result) => (
        <ConditionCard key={result.condition} {...result} />
      ))}

      {/* Specialist suggestion */}
      <div className="bg-white border border-[#FDE68A] rounded-xl px-6 py-5 mt-2 mb-8 flex gap-3.5 items-start">
        <div className="w-10 h-10 bg-[#FEFCE8] border border-[#FDE68A] rounded-xl flex items-center justify-center shrink-0">
          <Stethoscope size={20} strokeWidth={1.5} className="text-[#D4A810]" />
        </div>
        <div>
          <div className="text-[13px] font-bold text-[#D4A810] tracking-[0.05em] uppercase mb-0.5">
            Specialist suggestion
          </div>
          <div className="text-[15px] font-semibold text-[#1C1A0F]">
            See a {DUMMY_SPECIALIST.role} {DUMMY_SPECIALIST.timing}
          </div>
          <div className="text-[13px] text-[#57522A] mt-0.5 leading-relaxed">
            {DUMMY_SPECIALIST.note}
          </div>
        </div>
      </div>

      {/* Precautions */}
      <h2 className="text-[18px] font-semibold text-[#1C1A0F] mb-4">
        What to do next
      </h2>
      <PrecautionList items={DUMMY_PRECAUTIONS} />

      {/* Emergency callout */}
      <div className="mt-6 mb-8">
        <EmergencyCallout symptoms={EMERGENCY_SYMPTOMS} />
      </div>

      {/* Medical disclaimer */}
      <p className="text-[12px] text-[#A39A5C] leading-relaxed mb-8">
        <strong className="font-semibold text-[#57522A]">Medical disclaimer:</strong> These
        results are for informational purposes only and are not a medical diagnosis. Always
        consult a qualified healthcare provider for medical advice.
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
