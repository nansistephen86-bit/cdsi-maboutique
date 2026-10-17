import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("size-10 shrink-0", className)}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="32" fill="#2F5233" />
      <path
        d="M20 40 C20 24, 44 24, 44 40"
        stroke="#F6F1E4"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="32" cy="22" r="5" fill="#C68B3E" />
    </svg>
  );
}
