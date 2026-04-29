import Link from "next/link";
import Image from "next/image";
import { Activity, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";

export default function LandingPage() {
  return (
    <PageShell className="flex flex-col items-center text-center pt-28 pb-20">
      {/* Heartbeat motif */}
      <div className="mb-8 opacity-50">
        <Image
          src="/heartbeat-motif.svg"
          alt=""
          width={220}
          height={30}
          priority
        />
      </div>

      {/* Eyebrow */}
      <div className="text-[12px] font-bold text-[#D4A810] tracking-[0.10em] uppercase mb-4">
        AI-Powered Triage
      </div>

      {/* H1 */}
      <h1 className="text-[42px] md:text-[52px] font-bold text-[#1C1A0F] tracking-[-0.03em] leading-[1.08] mb-5 max-w-[560px]">
        Tell us how<br />you&apos;re feeling.
      </h1>

      {/* Subhead */}
      <p className="text-[17px] text-[#57522A] leading-[1.65] max-w-[440px] mb-9">
        We&apos;ll help you understand what&apos;s next — clearly, calmly, and
        without the guesswork.
      </p>

      {/* Primary CTA */}
      <Button
        asChild
        size="lg"
        className="bg-[#F5C518] text-[#1C1A0F] font-bold text-[16px] px-9 py-4 h-auto rounded-xl hover:bg-[#D4A810] hover:-translate-y-0.5 transition-all shadow-[0_3px_14px_rgba(245,197,24,0.55)] gap-2.5"
      >
        <Link href="/check">
          <Activity size={18} strokeWidth={2.5} />
          Check Symptoms
        </Link>
      </Button>

      {/* Trust micro-copy */}
      <div className="flex items-center gap-1.5 mt-5 text-[13px] text-[#A39A5C]">
        <ShieldCheck size={14} strokeWidth={2} className="text-[#A39A5C]" />
        Private &amp; secure — no account required
      </div>

      {/* Feature row */}
      <div className="flex flex-wrap justify-center gap-10 mt-16">
        {[
          {
            title: "AI analysis",
            desc: "Symptom matching powered by clinical data",
          },
          {
            title: "Severity triage",
            desc: "Know when to stay home or seek care",
          },
          {
            title: "Clear next steps",
            desc: "Actionable precautions, not just a diagnosis",
          },
        ].map(({ title, desc }) => (
          <div key={title} className="text-center max-w-[160px]">
            <div className="w-11 h-11 bg-[#FEFCE8] border border-[#FDE68A] rounded-xl flex items-center justify-center mx-auto mb-3">
              <ChevronRight size={20} strokeWidth={2} className="text-[#D4A810]" />
            </div>
            <div className="text-[13px] font-semibold text-[#1C1A0F] mb-1">{title}</div>
            <div className="text-[12px] text-[#A39A5C] leading-[1.5]">{desc}</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
