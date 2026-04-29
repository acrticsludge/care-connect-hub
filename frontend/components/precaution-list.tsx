import {
  Droplets,
  Thermometer,
  Shield,
  Pill,
  Phone,
} from "lucide-react";
import type { Precaution } from "@/lib/dummy-data";

const iconMap: Record<string, React.ElementType> = {
  droplets: Droplets,
  thermometer: Thermometer,
  shield: Shield,
  pill: Pill,
  phone: Phone,
};

export function PrecautionList({ items }: { items: Precaution[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item) => {
        const Icon = iconMap[item.icon] ?? Shield;
        return (
          <div
            key={item.title}
            className="flex items-start gap-3.5 bg-white border border-[#FDE68A] rounded-[14px] px-4 py-4"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          >
            <div className="w-[38px] h-[38px] bg-[#FEFCE8] border border-[#FDE68A] rounded-[10px] flex items-center justify-center shrink-0">
              <Icon size={18} strokeWidth={1.5} className="text-[#D4A810]" />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-[#1C1A0F] mb-0.5">{item.title}</div>
              <div className="text-[13px] text-[#57522A] leading-relaxed">{item.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
