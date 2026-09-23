/** Maskot FRUITY + balon dialog. */

import fruityImg from "@/assets/fruity.png";

type Props = {
  message?: string;
  size?: "sm" | "md" | "lg";
  hop?: boolean;
  className?: string;
};

const SIZES = { sm: "h-20 w-20", md: "h-32 w-32", lg: "h-44 w-44" } as const;

export function Fruity({ message, size = "md", hop = false, className = "" }: Props) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <img
        src={fruityImg}
        alt="Fruity, maskot apel"
        width={816}
        height={816}
        className={`${SIZES[size]} shrink-0 object-contain drop-shadow-lg ${hop ? "anim-hop" : "anim-float"}`}
      />
      {message ? (
        <div className="relative max-w-xs rounded-3xl border-4 border-white bg-white/95 px-4 py-3 text-left text-base font-bold leading-snug text-foreground shadow-[var(--shadow-card)] sm:max-w-sm sm:text-lg">
          <span
            aria-hidden
            className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-b-4 border-l-4 border-white bg-white/95"
          />
          {message}
        </div>
      ) : null}
    </div>
  );
}
