import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-[720px] mx-auto px-6 pt-24 pb-16 w-full",
        className,
      )}
    >
      {children}
    </div>
  );
}
