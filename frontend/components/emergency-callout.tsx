import { AlertTriangle } from "lucide-react";

export function EmergencyCallout({ symptoms }: { symptoms: string[] }) {
  return (
    <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-[14px] px-5 py-4 flex gap-3.5 items-start">
      <div className="w-9 h-9 bg-[#DC2626] rounded-[9px] flex items-center justify-center shrink-0">
        <AlertTriangle size={18} strokeWidth={2.5} className="text-white" />
      </div>
      <div>
        <div className="text-[14px] font-bold text-[#B91C1C] mb-1.5">
          Call 911 immediately if:
        </div>
        <ul className="space-y-1">
          {symptoms.map((s) => (
            <li key={s} className="text-[13px] text-[#991B1B] leading-relaxed flex gap-1.5">
              <span className="mt-[6px] w-1 h-1 rounded-full bg-[#DC2626] shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
