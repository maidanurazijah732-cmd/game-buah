import { useEffect, useMemo, useState } from "react";
import { Scene } from "@/components/fruit/Scene";
import { shuffle } from "@/game/questions";
import { formatTime } from "@/game/state";
import { playSfx } from "@/lib/fruit-audio";
import type { Vocab } from "@/data/vocabulary";

export type MiniResult = { score: number; correct: number; total: number; timeSec: number };

const ROUND_SECONDS = 60;

export function MatchGame({
  words,
  studentName,
  onDone,
}: {
  words: Vocab[];
  studentName: string;
  onDone: (result: MiniResult) => void;
}) {
  const images = useMemo(() => shuffle(words), [words]);
  const labels = useMemo(() => shuffle(words), [words]);
  const [picked, setPicked] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrongId, setWrongId] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(ROUND_SECONDS);
  const [timeUp, setTimeUp] = useState(false);

  useEffect(() => {
    if (timeUp || matched.length === words.length) return;
    const id = window.setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          window.clearInterval(id);
          setTimeUp(true);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timeUp, matched.length, words.length]);

  const finish = () =>
    onDone({
      score,
      correct: matched.length,
      total: words.length,
      timeSec: ROUND_SECONDS - left,
    });

  const allDone = matched.length === words.length;

  const choose = (labelId: number) => {
    if (picked === null || matched.includes(labelId)) return;
    if (picked === labelId) {
      setMatched((m) => [...m, labelId]);
      setScore((s) => s + 10);
      setPicked(null);
      playSfx("correct");
    } else {
      setWrongId(labelId);
      playSfx("wrong");
      window.setTimeout(() => {
        setWrongId(null);
        setPicked(null);
      }, 500);
    }
  };

  return (
    <Scene>
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6">
        <div className="flex items-center justify-between gap-2 font-display text-lg font-extrabold">
          <span className="rounded-full border-4 border-white bg-white/90 px-4 py-2">⭐ SCORE: {score}</span>
          <span className="rounded-full border-4 border-white bg-white/90 px-4 py-2">⏱️ {formatTime(left)}</span>
        </div>

        <h1 className="text-center font-display text-3xl font-extrabold text-foreground drop-shadow-[0_2px_0_rgba(255,255,255,0.9)]">
          🔗 COCOKKAN!
        </h1>
        <p className="text-center text-base font-extrabold text-foreground">
          Pasangkan gambar buah dengan nama Bahasa Inggrisnya.
        </p>

        {timeUp || allDone ? (
          <div className="panel anim-pop flex flex-col items-center gap-3 p-5 text-center">
            <p className="font-display text-2xl font-extrabold text-foreground">
              {allDone ? `🎉 Hebat, ${studentName}!` : "⏰ Waktunya habis!"}
            </p>
            <p className="text-base font-bold text-muted-foreground">
              {allDone ? "Semua pasangan benar!" : "Yuk lanjut ke tantangan berikutnya!"}
            </p>
            <button type="button" onClick={finish} className="btn-toy btn-toy-green w-full">
              LANJUT ➡
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col gap-3">
              {images.map((w) => {
                const isMatched = matched.includes(w.id);
                return (
                  <button
                    key={w.id}
                    type="button"
                    disabled={isMatched}
                    onClick={() => {
                      playSfx("tap");
                      setPicked(w.id);
                    }}
                    className={`choice-card flex items-center justify-center ${isMatched ? "is-correct" : ""} ${
                      picked === w.id ? "ring-4 ring-[var(--sun)]" : ""
                    }`}
                  >
                    <img
                      src={w.image}
                      alt={`Gambar ${w.english}`}
                      width={816}
                      height={816}
                      loading="lazy"
                      className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                    />
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col gap-3">
              {labels.map((w) => {
                const isMatched = matched.includes(w.id);
                return (
                  <button
                    key={w.id}
                    type="button"
                    disabled={isMatched}
                    onClick={() => choose(w.id)}
                    className={`choice-card flex min-h-[72px] items-center justify-center font-display text-lg font-extrabold sm:min-h-[96px] sm:text-xl ${
                      isMatched ? "is-correct" : ""
                    } ${wrongId === w.id ? "is-wrong" : ""}`}
                  >
                    {w.english.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!timeUp && !allDone ? (
          <p className="text-center text-sm font-extrabold text-muted-foreground">
            {picked === null ? "Klik gambar dulu, lalu klik namanya!" : "Sekarang pilih namanya!"}
          </p>
        ) : null}
      </div>
    </Scene>
  );
}
