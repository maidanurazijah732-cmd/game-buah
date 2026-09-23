import { Fruity } from "@/components/fruit/Fruity";
import { ProgressBar } from "@/components/fruit/ProgressBar";
import { Scene } from "@/components/fruit/Scene";
import { LEVELS, type LevelId } from "@/data/vocabulary";
import { playSfx } from "@/lib/fruit-audio";
import { allLevelsDone, completedLevelCount, isLevelUnlocked, type Progress } from "@/game/state";

type Props = {
  progress: Progress;
  onPlayLevel: (level: LevelId) => void;
  onFinalChallenge: () => void;
  justUnlocked: LevelId | null;
};

export function AdventureMap({ progress, onPlayLevel, onFinalChallenge, justUnlocked }: Props) {
  const done = completedLevelCount(progress);
  const finalOpen = allLevelsDone(progress);

  return (
    <Scene>
      <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-8">
        <h1 className="text-center font-display text-3xl font-extrabold text-foreground drop-shadow-[0_2px_0_rgba(255,255,255,0.9)] sm:text-5xl">
          🗺️ PETA PETUALANGAN
        </h1>
        <p className="text-center font-display text-xl font-bold text-secondary-foreground">
          Petualangan {progress.name || "Siswa"}
        </p>

        {justUnlocked ? (
          <div className="anim-pop rounded-3xl border-4 border-white bg-accent px-4 py-3 text-center font-display text-xl font-extrabold text-accent-foreground shadow-[var(--shadow-card)]">
            🔓 LEVEL BARU TERBUKA!
          </div>
        ) : null}

        <div className="panel p-4">
          <ProgressBar value={done} max={3} label={`Progress Petualangan — ${done}/3 Level`} />
        </div>

        <ol className="flex flex-col gap-4">
          {LEVELS.map((level) => {
            const unlocked = isLevelUnlocked(level.id, progress);
            const result = progress.levels[level.id];
            return (
              <li key={level.id} className="relative">
                <div aria-hidden className="absolute left-9 -top-4 h-4 w-1 rounded bg-white/70 first:hidden" />
                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => {
                    playSfx("tap");
                    onPlayLevel(level.id);
                  }}
                  className={`panel flex w-full items-center gap-4 p-4 text-left transition-transform ${
                    unlocked ? "hover:-translate-y-1" : "opacity-70"
                  }`}
                >
                  <span
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-3xl text-white"
                    style={{ background: unlocked ? level.color : "var(--locked)" }}
                  >
                    {unlocked ? level.icon : "🔒"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl font-extrabold text-foreground">
                      LEVEL {level.order} · {level.label}
                    </span>
                    <span className="block truncate text-base font-bold text-muted-foreground">{level.place}</span>
                    <span className="mt-1 block text-sm font-extrabold">
                      {result
                        ? `✓ Selesai · ⭐ ${result.score} · ${"⭐".repeat(result.stars)}`
                        : unlocked
                          ? "🔓 TERBUKA — ayo main!"
                          : "🔒 TERKUNCI"}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          disabled={!finalOpen}
          onClick={() => {
            playSfx("tap");
            onFinalChallenge();
          }}
          className="btn-toy btn-toy-grape w-full"
        >
          {finalOpen ? "🏆 FINAL CHALLENGE" : "🔒 FINAL CHALLENGE (selesaikan 3 level)"}
        </button>

        <Fruity size="sm" message="Main berurutan ya! Selesaikan Easy dulu supaya Medium terbuka." />
      </div>
    </Scene>
  );
}
