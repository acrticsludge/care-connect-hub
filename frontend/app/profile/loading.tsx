import { PageShell } from "@/components/page-shell";

export default function ProfileLoading() {
  return (
    <PageShell className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-lg animate-pulse">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#FDE68A]" />
          <div className="h-5 w-32 rounded bg-[#FDE68A]" />
          <div className="h-3 w-52 rounded bg-[#FDE68A]" />
        </div>
        <div className="rounded-2xl border border-[#FDE68A] bg-white p-6 flex flex-col gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-3 w-20 rounded bg-[#FDE68A]" />
              <div className="h-11 rounded-lg bg-[#FEFCE8]" />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
