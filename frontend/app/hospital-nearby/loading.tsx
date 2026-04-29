import { PageShell } from "@/components/page-shell";

export default function HospitalNearbyLoading() {
  return (
    <div className="pt-16 flex flex-col" style={{ minHeight: "100vh" }}>
      <PageShell className="pb-4 pt-8">
        <div className="h-8 w-48 bg-[#FDE68A] rounded animate-pulse mb-2" />
        <div className="h-4 w-72 bg-[#FDE68A] rounded animate-pulse" />
      </PageShell>
      <div className="flex-1 mx-4 md:mx-8 mb-8 rounded-2xl bg-[#FEFCE8] border border-[#FDE68A] min-h-[420px] animate-pulse" />
    </div>
  );
}
