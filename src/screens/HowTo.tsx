import { Fruity } from "@/components/fruit/Fruity";
import { Scene } from "@/components/fruit/Scene";
import { playSfx } from "@/lib/fruit-audio";

const STEPS = [
  { icon: "🍓", text: "Pelajari nama buah." },
  { icon: "🔊", text: "Tekan tombol 🔊 untuk mendengarkan pengucapan." },
  { icon: "👂", text: "Dengarkan lalu tirukan." },
  { icon: "🎮", text: "Selesaikan permainan." },
  { icon: "⭐", text: "Kumpulkan bintang." },
  { icon: "🗺️", text: "Selesaikan semua level." },
  { icon: "🏅", text: "Jadilah Fruit Master!" },
];

export function HowTo({ name, onReady }: { name: string; onReady: () => void }) {
  return (
    <Scene>
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center gap-5 px-4 py-10">
        <h1 className="font-display text-3xl font-extrabold text-foreground drop-shadow-[0_2px_0_rgba(255,255,255,0.9)] sm:text-5xl">
          📖 CARA BERMAIN
        </h1>
        <Fruity size="sm" message={`Ikuti langkah ini ya, ${name}!`} />

        <ol className="panel w-full space-y-3 p-5">
          {STEPS.map((step, i) => (
            <li key={step.text} className="flex items-center gap-3 rounded-2xl bg-muted px-3 py-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-2xl">
                {step.icon}
              </span>
              <span className="text-left text-base font-extrabold text-foreground sm:text-lg">
                {i + 1}. {step.text}
              </span>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={() => {
            playSfx("tap");
            onReady();
          }}
          className="btn-toy btn-toy-green w-full max-w-md"
        >
          AKU SIAP! 🚀
        </button>
      </div>
    </Scene>
  );
}
