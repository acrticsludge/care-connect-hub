import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";

export default function AdminPage() {
  return (
    <PageShell className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-[#FEE2E2] border border-[#FECACA] rounded-2xl flex items-center justify-center mb-5">
        <ShieldAlert size={28} strokeWidth={1.5} className="text-[#DC2626]" />
      </div>
      <h1 className="text-[28px] font-bold text-[#1C1A0F] tracking-[-0.02em] mb-2">
        Admin only
      </h1>
      <p className="text-[15px] text-[#57522A] leading-relaxed max-w-[360px] mb-8">
        You don&apos;t have access to this page. Contact your administrator if you
        believe this is an error.
      </p>
      <Button
        asChild
        variant="outline"
        className="border-[#FDE68A] text-[#57522A] hover:bg-[#FEFCE8] min-h-[48px]"
      >
        <Link href="/">Back to home</Link>
      </Button>
    </PageShell>
  );
}
