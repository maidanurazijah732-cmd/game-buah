import { useEffect, useMemo, useState } from "react";
import { Confetti } from "@/components/fruit/Confetti";
import { Fruity } from "@/components/fruit/Fruity";
import { ProgressBar } from "@/components/fruit/ProgressBar";
import { Scene } from "@/components/fruit/Scene";
import { SpeakButton } from "@/components/fruit/SpeakButton";
import { QUESTION_HINT, QUESTION_PROMPT, type Question } from "@/game/questions";
import { formatTime } from "@/game/state";
import { playSfx, stopPronunciation } from "@/lib/fruit-audio";
import type { MiniResult } from "@/screens/MatchGame";

const SECONDS_PER_QUESTION = 30;

export function Quiz({
  title,
  questions,
  studentName,
  startScore = 0,
  onDone,
}: {
  title: string;
  questions: Question[];
  studentName: string;
  startScore?: number;
  onDone: (result: MiniResult) => void;
}) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(startScore);
  const [correctCount, setCorrectCount] = useState(0);
  const [pickedId, setPickedId] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong" | "timeout">("idle");
  const [left, setLeft] = useState(SECONDS_PER_QUESTION);
  const [elapsed, setElapsed] = useState(0);

  const question = questions[index]!;
  const total = questions.length;
  const locked = status !== "idle";

  const answerLabel = useMemo(() => question.answer.english.toUpperCase(), [question]);

  // Timer per soal.
  useEffect(() => {
    setLeft(SECONDS_PER_QUESTION);
    setPickedId(null);
    setStatus("idle");
  }, [index]);

  useEffect(() => {
    if (locked) return;
    const id = window.setInterval(() => {
      setElapsed((e) => e + 1);
      setLeft((v) => {
        if (v <= 1) {
          window.clearInterval(id);
          setStatus("timeout");
          playSfx("wrong");
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [locked, index]);

  useEffect(() => () => stopPronunciation(), []);

  const next = () => {
    stopPronunciation();
    if (index + 1 >= total) {
      onDone({ score, correct: correctCount, total, timeSec: elapsed });
      return;
    }
    setIndex((i) => i + 1);
  };

  // Lanjut otomatis setelah feedback.
  useEffect(() => {
    if (status === "idle") return;
    const delay = status === "correct" ? 1500 : 1800;
    const id = window.setTimeout(next, delay);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const answer = (optionId: number) => {
    if (locked) return;
    setPickedId(optionId);
    if (optionId === question.answer.id) {
      setScore((s) => s + 10);
      setCorrectCount((c) => c + 1);
      setStatus("correct");
      playSfx("correct");
    } else {
      setStatus("wrong");
      playSfx("wrong");
    }
  };

  const cardClass = (optionId: number) => {
    if (!locked) return "choice-card";
    if (optionId === question.answer.id) return "choice-card is-correct";
    if (optionId === pickedId) return "choice-card is-wrong";
    return "choice-card opacity-60";
  };

  const showImages = question.kind === "pick-image";
  const showMeaning = question.kind === "pick-meaning";

  return (
    <Scene>
      {status === "correct" ? <Confetti pieces={26} /> : null}
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6">
        <div className="flex items-center justify-between gap-2 font-display text-base font-extrabold sm:text-lg">
          <span className="rounded-full border-4 border-white bg-white/90 px-3 py-2">⭐ SCORE: {score}</span>
          <span className="rounded-full border-4 border-white bg-white/90 px-3 py-2">
            Soal {index + 1} dari {total}
          </span>
          <span className="rounded-full border-4 border-white bg-white/90 px-3 py-2">⏱️ {formatTime(left)}</span>
        </div>

        <div className="panel p-3">
          <ProgressBar value={index + (locked ? 1 : 0)} max={total} label={title} />
        </div>

        <div className="panel flex flex-col items-center gap-3 p-5 text-center">
          <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
            {QUESTION_PROMPT[question.kind](question.answer)}
          </h2>
          <p className="text-sm font-extrabold text-muted-foreground">{QUESTION_HINT[question.kind]}</p>

          {question.kind === "pick-word" ? (
            <img
              src={question.answer.image}
              alt="Buah yang ditanyakan"
              width={816}
              height={816}
              className="anim-float h-36 w-36 object-contain sm:h-44 sm:w-44"
            />
          ) : null}

          {question.kind === "listen" ? (
            <>
              <p className="font-display text-2xl font-extrabold text-primary">👂 DENGARKAN!</p>
              <SpeakButton
                key={question.id}
                word={question.answer.english}
                mp3={question.answer.audio}
                idleLabel="🔊 PUTAR SUARA"
                autoPlay
              />
            </>
          ) : null}
        </div>

        <div className={showImages ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"}>
          {question.options.map((option) => (
            <button
              key={option.id}
              type="button"
              disabled={locked}
              onClick={() => answer(option.id)}
              className={`${cardClass(option.id)} ${
                showImages ? "flex flex-col items-center" : "flex items-center justify-center gap-3 px-4 py-4"
              }`}
            >
              {showImages ? (
                <img
                  src={option.image}
                  alt={`Pilihan gambar ${option.indonesian}`}
                  width={816}
                  height={816}
                  loading="lazy"
                  className="h-24 w-24 object-contain sm:h-32 sm:w-32"
                />
              ) : (
                <span className="font-display text-xl font-extrabold sm:text-2xl">
                  {showMeaning ? option.indonesian : option.english}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[92px]">
          {status === "correct" ? (
            <div className="panel anim-pop flex items-center justify-between gap-2 p-4">
              <Fruity size="sm" hop />
              <div className="text-right">
                <p className="font-display text-2xl font-extrabold text-secondary-foreground">🎉 BENAR!</p>
                <p className="text-base font-bold text-foreground">Hebat, {studentName}!</p>
              </div>
              <span className="anim-rise font-display text-2xl font-extrabold text-primary">+10 ⭐</span>
            </div>
          ) : null}

          {status === "wrong" ? (
            <div className="panel anim-pop p-4 text-center">
              <p className="font-display text-2xl font-extrabold text-primary">Ups, belum tepat!</p>
              <p className="text-base font-bold text-foreground">Yuk coba lagi! Jawabannya: {answerLabel}</p>
            </div>
          ) : null}

          {status === "timeout" ? (
            <div className="panel anim-pop p-4 text-center">
              <p className="font-display text-2xl font-extrabold text-primary">⏰ Waktunya habis!</p>
              <p className="text-base font-bold text-foreground">
                Yuk lanjut ke tantangan berikutnya! Jawabannya: {answerLabel}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </Scene>
  );
}
