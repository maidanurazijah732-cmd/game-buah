import { useEffect, useState } from "react";
import { Fruity } from "@/components/fruit/Fruity";
import { ProgressBar } from "@/components/fruit/ProgressBar";
import { Scene } from "@/components/fruit/Scene";
import { SpeakButton } from "@/components/fruit/SpeakButton";
import { LEVELS, getVocabByLevel, type LevelId } from "@/data/vocabulary";
import { playSfx, stopPronunciation } from "@/lib/fruit-audio";

export function Learn({
  level,
  onPlayGame,
  onBack,
}: {
  level: LevelId;
  onPlayGame: () => void;
  onBack: () => void;
}) {
  const words = getVocabByLevel(level);
  const meta = LEVELS.find((l) => l.id === level)!;
  const [index, setIndex] = useState(0);
  const [heard, setHeard] = useState<Record<number, boolean>>({});
  const word = words[index]!;
  const isLast = index === words.length - 1;

  useEffect(() => () => stopPronunciation(), []);

  const go = (next: number) => {
    stopPronunciation();
    setIndex(Math.min(words.length - 1, Math.max(0, next)));
  };

  return (
    <Scene>
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border-4 border-white bg-white/90 px-4 py-2 font-display text-base font-extrabold text-foreground"
          >
            ⬅ Peta
          </button>
          <span className="rounded-full border-4 border-white bg-white/90 px-4 py-2 font-display text-base font-extrabold">
            {meta.icon} Level {meta.label}
          </span>
        </div>

        <h1 className="text-center font-display text-3xl font-extrabold text-foreground drop-shadow-[0_2px_0_rgba(255,255,255,0.9)] sm:text-4xl">
          📚 AYO BELAJAR!
        </h1>

        <div className="panel p-4">
          <ProgressBar
            value={index + 1}
            max={words.length}
            label={`${index + 1} dari ${words.length} buah dipelajari`}
          />
          <div className="mt-2 flex justify-center gap-2 text-2xl">
            {words.map((w, i) => (
              <span key={w.id} className={i <= index ? "" : "opacity-30"}>
                {i <= index ? "🍎" : "○"}
              </span>
            ))}
          </div>
        </div>

        <article key={word.id} className="panel anim-pop flex flex-col items-center gap-3 p-5 text-center">
          <img
            src={word.image}
            alt={`Gambar ${word.english}`}
            width={816}
            height={816}
            className="anim-float h-44 w-44 object-contain sm:h-56 sm:w-56"
          />
          <h2 className="font-display text-4xl font-extrabold text-primary sm:text-5xl">
            {word.english.toUpperCase()}
          </h2>
          <p className="font-display text-2xl font-bold text-secondary-foreground">{word.indonesian}</p>

          <SpeakButton
            word={word.english}
            mp3={word.audio}
            idleLabel={heard[word.id] ? "🔁 DENGARKAN LAGI" : "🔊 DENGARKAN SUARA"}
            onPlayed={() => setHeard((prev) => ({ ...prev, [word.id]: true }))}
          />

          {heard[word.id] ? (
            <div className="anim-pop rounded-2xl bg-accent px-4 py-3 font-display text-lg font-extrabold text-accent-foreground">
              👂 Sudah mendengar?
              <br />
              🗣️ Sekarang tirukan: {word.english.toUpperCase()}!
            </div>
          ) : (
            <p className="text-base font-extrabold text-muted-foreground">👂 Dengarkan · 🗣️ Lalu tirukan!</p>
          )}
        </article>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="btn-toy btn-toy-sun flex-1"
          >
            ⬅ SEBELUMNYA
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={isLast}
            className="btn-toy btn-toy-sun flex-1"
          >
            SELANJUTNYA ➡
          </button>
        </div>

        {isLast ? (
          <div className="panel flex flex-col items-center gap-3 p-4">
            <Fruity size="sm" hop message="Yeay! Kamu sudah mengenal semua buah di level ini!" />
            <button
              type="button"
              onClick={() => {
                stopPronunciation();
                playSfx("tap");
                onPlayGame();
              }}
              className="btn-toy btn-toy-green w-full"
            >
              🎮 MULAI BERMAIN
            </button>
          </div>
        ) : null}
      </div>
    </Scene>
  );
}
