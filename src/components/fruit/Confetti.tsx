/** Confetti ringan berbasis CSS. */

const COLORS = ["var(--berry)", "var(--sun)", "var(--grass-deep)", "var(--grape)", "var(--bubblegum)", "var(--mango)"];

export function Confetti({ pieces = 40 }: { pieces?: number }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: pieces }).map((_, i) => (
        <span
          key={i}
          className="absolute block rounded-sm"
          style={{
            left: `${(i * 97) % 100}%`,
            width: 10,
            height: 14,
            background: COLORS[i % COLORS.length],
            animation: `confetti-fall ${2.2 + ((i * 7) % 18) / 10}s linear ${((i * 13) % 14) / 10}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
