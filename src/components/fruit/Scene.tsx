/** Latar kebun buah: langit, awan bergerak, matahari tersenyum, bintang, rumput. */

const CLOUDS = [
  { top: "8%", size: 90, duration: 46, delay: 0 },
  { top: "18%", size: 60, duration: 62, delay: -18 },
  { top: "30%", size: 110, duration: 78, delay: -40 },
];

const STARS = [
  { top: "12%", left: "22%", delay: "0s" },
  { top: "24%", left: "78%", delay: "0.6s" },
  { top: "40%", left: "10%", delay: "1.2s" },
  { top: "16%", left: "58%", delay: "1.8s" },
];

export function Scene({ children }: { children: React.ReactNode }) {
  return (
    <div className="scene-garden relative min-h-dvh w-full overflow-hidden">
      {/* matahari tersenyum */}
      <div
        aria-hidden
        className="anim-float pointer-events-none absolute left-4 top-4 flex h-20 w-20 items-center justify-center rounded-full text-4xl sm:h-24 sm:w-24"
        style={{ background: "var(--sun)", boxShadow: "0 0 50px 12px oklch(0.9 0.15 95 / 0.55)" }}
      >
        😊
      </div>

      {CLOUDS.map((cloud, i) => (
        <div
          key={i}
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-white/80 blur-[1px]"
          style={{
            top: cloud.top,
            width: cloud.size,
            height: cloud.size * 0.45,
            animation: `drift ${cloud.duration}s linear ${cloud.delay}s infinite`,
          }}
        />
      ))}

      {STARS.map((star, i) => (
        <span
          key={i}
          aria-hidden
          className="anim-twinkle pointer-events-none absolute text-2xl"
          style={{ top: star.top, left: star.left, animationDelay: star.delay }}
        >
          ⭐
        </span>
      ))}

      {/* bukit + rumput */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background: "linear-gradient(180deg, transparent, var(--grass-deep))",
          borderTopLeftRadius: "50% 60px",
          borderTopRightRadius: "50% 60px",
          opacity: 0.7,
        }}
      />
      <div aria-hidden className="pointer-events-none absolute bottom-2 left-6 text-3xl">
        🌷
      </div>
      <div aria-hidden className="pointer-events-none absolute bottom-3 right-8 text-3xl">
        🌻
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
