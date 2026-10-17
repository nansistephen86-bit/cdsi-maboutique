import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QtyControl({
  value,
  onDecrease,
  onIncrease,
  label,
  className,
}: {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex overflow-hidden rounded-sm border-[1.5px] border-sand-dark",
        className,
      )}
    >
      <button
        type="button"
        aria-label={`Diminuer ${label}`}
        onClick={onDecrease}
        className="flex size-11 items-center justify-center bg-sand text-forest-dark hover:bg-sand-dark"
      >
        <Minus className="size-4" strokeWidth={2.2} />
      </button>
      <span className="flex min-w-11 items-center justify-center font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Augmenter ${label}`}
        onClick={onIncrease}
        className="flex size-11 items-center justify-center bg-sand text-forest-dark hover:bg-sand-dark"
      >
        <Plus className="size-4" strokeWidth={2.2} />
      </button>
    </div>
  );
}
