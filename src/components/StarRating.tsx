import { Star } from "lucide-react";

export function StarRating({
  value,
  onChange,
  size = 18,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value);
        const Icon = (
          <Star
            size={size}
            className={filled ? "fill-brand-purple text-brand-purple" : "text-muted-foreground/50"}
          />
        );
        return onChange ? (
          <button
            key={n}
            type="button"
            aria-label={`Avaliar com ${n} estrelas`}
            onClick={() => onChange(n)}
            className="rounded-md p-0.5 transition-transform hover:scale-110"
          >
            {Icon}
          </button>
        ) : (
          <span key={n}>{Icon}</span>
        );
      })}
    </div>
  );
}