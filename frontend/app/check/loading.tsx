import { PageShell } from "@/components/page-shell";

export default function CheckLoading() {
  return (
    <PageShell>
      <div className="h-4 w-24 bg-[#FDE68A] rounded animate-pulse mb-3" />
      <div className="h-8 w-64 bg-[#FDE68A] rounded animate-pulse mb-2" />
      <div className="h-4 w-80 bg-[#FEFCE8] rounded animate-pulse mb-8" />
      <div className="flex gap-3 mb-8">
        <div className="h-16 w-24 bg-[#FEFCE8] rounded-[10px] animate-pulse" />
        <div className="h-16 w-48 bg-[#FEFCE8] rounded-[10px] animate-pulse" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="mb-6">
          <div className="h-3 w-28 bg-[#FDE68A] rounded animate-pulse mb-3" />
          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="h-9 w-20 bg-[#FEFCE8] rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </PageShell>
  );
}
