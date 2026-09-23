import { useEffect, useState } from "react";
import { Fruity } from "@/components/fruit/Fruity";
import { Scene } from "@/components/fruit/Scene";

export function Splash({ onDone }: { onDone: () => void }) {
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setLoaded((v) => Math.min(100, v + 4));
    }, 70);
    const done = window.setTimeout(onDone, 2100);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(done);
    };
  }, [onDone]);

  return (
    <Scene>
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="anim-pop">
          <h1 className="font-display text-5xl font-extrabold text-primary drop-shadow-[0_3px_0_rgba(255,255,255,0.9)] sm:text-7xl">
            🍎 FRUIT FUN 🍌
          </h1>
          <p className="mt-2 font-display text-xl font-bold text-secondary-foreground sm:text-2xl">
            English Vocabulary Adventure
          </p>
        </div>

        <Fruity size="lg" />

        <div className="flex gap-3 text-4xl">
          <span className="anim-wiggle">🍇</span>
          <span className="anim-wiggle" style={{ animationDelay: "0.3s" }}>
            🍍
          </span>
          <span className="anim-wiggle" style={{ animationDelay: "0.6s" }}>
            🍉
          </span>
        </div>

        <div className="w-full max-w-xs">
          <div className="h-4 overflow-hidden rounded-full border-4 border-white bg-white/60">
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{ width: `${loaded}%`, background: "linear-gradient(90deg, var(--sun), var(--berry))" }}
            />
          </div>
          <p className="mt-2 font-display text-lg font-bold text-foreground">Menyiapkan petualangan buah...</p>
        </div>
      </div>
    </Scene>
  );
}
