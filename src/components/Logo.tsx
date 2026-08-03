import { Cerebro } from "@/components/mascotes/Cerebros";

export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`flex min-w-0 items-center gap-2 ${className}`}>
      <Cerebro variante="ideia" size={36} className="shrink-0" />
      {!compact && (
        <span className="truncate font-display text-lg font-extrabold tracking-tight">
          Simplifica<span className="text-brand">+ Tech</span>
        </span>
      )}
    </span>
  );
}