import { Confetti } from "@/components/fruit/Confetti";
import { Fruity } from "@/components/fruit/Fruity";
import { Scene } from "@/components/fruit/Scene";
import { LEVELS, type LevelId } from "@/data/vocabulary";
import { formatTime, LEVEL_ORDER, totalStars, type LevelResult, type Progress } from "@/game/state";
import { playSfx } from "@/lib/fruit-audio";

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted p-3 text-center">
      <div className="text-2xl">{icon}</div>
      <div className="text-sm font-extrabold text-muted-foreground">{label}</div>
      <div className="font-display text-2xl font-extrabold text-foreground">{value}</div>
    </div>
  );
}

export function LevelComplete({
  level,
  result,
  name,
  onContinue,
}: {
  level: LevelId;
  result: LevelResult;
  name: string;
  onContinue: () => void;
}) {
  const meta = LEVELS.find((l) => l.id === level)!;
  const acc = result.total ? Math.round((result.correct / result.total) * 100) : 0;
  return (
    <Scene>
      <Confetti />
      <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 py-10 text-center">
        <h1 className="anim-pop font-display text-4xl font-extrabold text-foreground sm:text-5xl">🎉 LEVEL SELESAI!</h1>
        <p className="font-display text-2xl font-bold">Hebat, {name}!</p>
        <div className="panel p-5">
          <p className="mb-3 font-display text-xl font-extrabold">
            {meta.icon} LEVEL {meta.order} · {meta.label}
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Stat icon="⭐" label="SCORE" value={String(result.score)} />
            <Stat icon="🎯" label="ACCURACY" value={`${acc}%`} />
            <Stat icon="⏱️" label="TIME" value={formatTime(result.timeSec)} />
          </div>
          <p className="mt-4 text-4xl">{"⭐".repeat(result.stars) || "🌟"}</p>
        </div>
        <Fruity hop message="Awesome! Kamu berhasil menyelesaikan level!" />
        <button
          type="button"
          className="btn-toy btn-toy-green w-full"
          onClick={() => {
            playSfx("tap");
            onContinue();
          }}
        >
          LANJUT PETUALANGAN ➡
        </button>
      </div>
    </Scene>
  );
}

export function FinalResult({
  progress,
  onPlayAgain,
  onHome,
}: {
  progress: Progress;
  onPlayAgain: () => void;
  onHome: () => void;
}) {
  const final = progress.final;
  const name = progress.name || "Siswa";
  if (!final) {
    return (
      <Scene>
        <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 py-10 text-center">
          <h1 className="font-display text-4xl font-extrabold">🏆 HASIL</h1>
          <div className="panel space-y-2 p-5 text-lg font-bold">
            {LEVEL_ORDER.map((l) => {
              const m = LEVELS.find((x) => x.id === l)!;
              const r = progress.levels[l];
              return (
                <p key={l}>
                  {m.icon} {m.label}: {r ? `✓ Selesai · ⭐ ${r.score}` : "Belum dimainkan"}
                </p>
              );
            })}
            <p>⭐ Total Bintang: {totalStars(progress)}</p>
          </div>
          <Fruity message="Selesaikan semua level dan Final Challenge untuk jadi FRUIT MASTER!" />
          <button type="button" className="btn-toy btn-toy-sky w-full" onClick={onHome}>
            🗺️ KE PETA PETUALANGAN
          </button>
        </div>
      </Scene>
    );
  }
  const acc = Math.round((final.correct / final.total) * 100);
  return (
    <Scene>
      <Confetti pieces={70} />
      <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 py-10 text-center">
        <h1 className="anim-pop font-display text-3xl font-extrabold sm:text-5xl">🏆 PETUALANGAN SELESAI! 🏆</h1>
        <p className="font-display text-2xl font-bold">Congratulations, {name}!</p>
        <p className="font-bold">Kamu berhasil menyelesaikan Fruit Fun Adventure!</p>
        <div className="anim-hop mx-auto rounded-full border-4 border-white bg-accent px-6 py-3 font-display text-2xl font-extrabold text-accent-foreground shadow-[var(--shadow-card)]">
          🏅 FRUIT MASTER
        </div>
        <div className="panel space-y-2 p-5 text-left text-lg font-bold">
          <p>👤 Nama: {name}</p>
          <p>🌱 Easy: ✓ Selesai</p>
          <p>🌳 Medium: ✓ Selesai</p>
          <p>🏆 Hard: ✓ Selesai</p>
          <p>⭐ Final Score: {final.score}</p>
          <p>✅ Jawaban Benar: {final.correct}/{final.total}</p>
          <p>🎯 Accuracy: {acc}%</p>
          <p>🌟 Total Bintang: {"⭐".repeat(final.stars)} ({totalStars(progress)})</p>
        </div>
        <Fruity
          hop
          message={`Awesome, ${name}! Kamu hebat belajar Bahasa Inggris hari ini! Sekarang kamu adalah FRUIT MASTER!`}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" className="btn-toy btn-toy-sun" onClick={onPlayAgain}>
            🔄 MAIN LAGI
          </button>
          <button type="button" className="btn-toy btn-toy-sky" onClick={onHome}>
            🏠 KEMBALI KE HOME
          </button>
        </div>
      </div>
    </Scene>
  );
}
