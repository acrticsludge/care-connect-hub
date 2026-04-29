import { PageShell } from "@/components/page-shell";

export default function ResultLoading() {
  return (
    <PageShell>
      <div className="bg-[#FEFCE8] border border-[#FDE68A] rounded-xl px-6 py-5 mb-8 animate-pulse">
        <div className="h-3 w-32 bg-[#FDE68A] rounded mb-3" />
        <div className="h-6 w-52 bg-[#FDE68A] rounded mb-2" />
        <div className="h-4 w-64 bg-[#FEFCE8] rounded" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white border border-[#FDE68A] rounded-xl px-6 py-5 mb-3 animate-pulse">
          <div className="flex justify-between mb-4">
            <div>
              <div className="h-4 w-40 bg-[#FDE68A] rounded mb-1.5" />
              <div className="h-3 w-32 bg-[#FEFCE8] rounded" />
            </div>
            <div className="h-6 w-20 bg-[#DCFCE7] rounded-[6px]" />
          </div>
          <div className="h-[7px] bg-[#FEFCE8] rounded-full" />
        </div>
      ))}
    </PageShell>
  );
}
