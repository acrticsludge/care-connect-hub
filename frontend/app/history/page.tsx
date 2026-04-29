import Link from "next/link";
import { History, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";

export default function HistoryPage() {
  return (
    <PageShell className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-[#FEFCE8] border border-[#FDE68A] rounded-2xl flex items-center justify-center mb-5">
        <History size={28} strokeWidth={1.5} className="text-[#D4A810]" />
      </div>
      <h1 className="text-[28px] font-bold text-[#1C1A0F] tracking-[-0.02em] mb-2">
        No checks yet
      </h1>
      <p className="text-[15px] text-[#57522A] leading-relaxed max-w-[360px] mb-8">
        Your symptom check history will appear here. Run your first check to get
        started.
      </p>
      <Button
        asChild
        className="bg-[#F5C518] text-[#1C1A0F] font-bold hover:bg-[#D4A810] shadow-[0_2px_8px_rgba(245,197,24,0.50)] gap-2 min-h-[48px]"
      >
        <Link href="/check">
          <Activity size={16} strokeWidth={2.5} />
          Check Symptoms
        </Link>
      </Button>
    </PageShell>
  );
}
