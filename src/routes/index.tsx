import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BottomNav, type NavKey } from "@/components/fruit/BottomNav";
import { getVocabByLevel, type LevelId } from "@/data/vocabulary";
import { buildFinalQuiz, buildLevelQuiz } from "@/game/questions";
import {
  emptyProgress,
  isLevelUnlocked,
  LEVEL_ORDER,
  loadProgress,
  saveProgress,
  starsFor,
  type LevelResult,
  type Progress,
} from "@/game/state";
import { isSfxEnabled, playSfx, setSfxEnabled, stopPronunciation } from "@/lib/fruit-audio";
import { AdventureMap } from "@/screens/AdventureMap";
import { HowTo } from "@/screens/HowTo";
import { Learn } from "@/screens/Learn";
import { MatchGame, type MiniResult } from "@/screens/MatchGame";
import { Quiz } from "@/screens/Quiz";
import { FinalResult, LevelComplete } from "@/screens/Results";
import { Splash } from "@/screens/Splash";
import { Welcome } from "@/screens/Welcome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FRUIT FUN — English Vocabulary Adventure" },
      { name: "description", content: "Game belajar kosakata Bahasa Inggris tema buah untuk siswa kelas V SD." },
      { property: "og:title", content: "FRUIT FUN — English Vocabulary Adventure" },
      { property: "og:description", content: "Belajar 15 nama buah dalam Bahasa Inggris sambil berpetualang bersama Fruity!" },
    ],
  }),
  component: Index,
});

type Screen =
  | { name: "splash" }
  | { name: "welcome" }
  | { name: "howto" }
  | { name: "map" }
  | { name: "learn"; level: LevelId }
  | { name: "quiz"; level: LevelId }
  | { name: "match"; level: LevelId; quiz: MiniResult }
  | { name: "levelDone"; level: LevelId; result: LevelResult }
  | { name: "final" }
  | { name: "result" };

function Index() {
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [screen, setScreen] = useState<Screen>({ name: "splash" });
  const [justUnlocked, setJustUnlocked] = useState<LevelId | null>(null);
  const [sfx, setSfx] = useState(true);

  useEffect(() => {
    setProgress(loadProgress());
    setSfx(isSfxEnabled());
  }, []);

  const update = (p: Progress) => {
    setProgress(p);
    saveProgress(p);
  };

  const go = (s: Screen) => {
    stopPronunciation();
    setScreen(s);
    window.scrollTo({ top: 0 });
  };

  const name = progress.name || "Siswa";
  const quizKey = `${screen.name}-${"level" in screen ? screen.level : ""}`;
  const levelQuiz = useMemo(
    () => (screen.name === "quiz" ? buildLevelQuiz(screen.level) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quizKey],
  );
  const finalQuiz = useMemo(() => (screen.name === "final" ? buildFinalQuiz() : []), [screen.name]);

  const nextPlayableLevel = (): LevelId =>
    LEVEL_ORDER.find((l) => isLevelUnlocked(l, progress) && !progress.levels[l]) ??
    LEVEL_ORDER.filter((l) => isLevelUnlocked(l, progress)).pop()!;

  const onNav = (key: NavKey) => {
    playSfx("tap");
    if (key === "home") go({ name: "welcome" });
    else if (key === "belajar") go(progress.name ? { name: "learn", level: nextPlayableLevel() } : { name: "welcome" });
    else if (key === "petualangan") go(progress.name ? { name: "map" } : { name: "welcome" });
    else go({ name: "result" });
  };

  const navActive: NavKey =
    screen.name === "welcome" || screen.name === "howto"
      ? "home"
      : screen.name === "learn"
        ? "belajar"
        : screen.name === "result"
          ? "hasil"
          : "petualangan";

  const inGame = screen.name === "quiz" || screen.name === "match" || screen.name === "final";

  let content: React.ReactNode;
  switch (screen.name) {
    case "splash":
      content = <Splash onDone={() => go({ name: "welcome" })} />;
      break;
    case "welcome":
      content = (
        <Welcome
          initialName={progress.name}
          onStart={(n) => {
            update({ ...progress, name: n });
            go({ name: "howto" });
          }}
        />
      );
      break;
    case "howto":
      content = <HowTo name={name} onReady={() => go({ name: "map" })} />;
      break;
    case "map":
      content = (
        <AdventureMap
          progress={progress}
          justUnlocked={justUnlocked}
          onPlayLevel={(level) => {
            setJustUnlocked(null);
            go({ name: "learn", level });
          }}
          onFinalChallenge={() => go({ name: "final" })}
        />
      );
      break;
    case "learn":
      content = (
        <Learn
          key={screen.level}
          level={screen.level}
          onBack={() => go({ name: "map" })}
          onPlayGame={() => go({ name: "quiz", level: screen.level })}
        />
      );
      break;
    case "quiz":
      content = (
        <Quiz
          key={quizKey}
          title={`🎮 MINI GAME · ${screen.level.toUpperCase()}`}
          questions={levelQuiz}
          studentName={name}
          onDone={(r) => go({ name: "match", level: screen.level, quiz: r })}
        />
      );
      break;
    case "match": {
      const { level, quiz } = screen;
      content = (
        <MatchGame
          words={getVocabByLevel(level)}
          studentName={name}
          onDone={(m) => {
            const correct = quiz.correct + m.correct;
            const total = quiz.total + m.total;
            const result: LevelResult = {
              score: quiz.score + m.score,
              correct,
              total,
              stars: starsFor(correct / total),
              timeSec: quiz.timeSec + m.timeSec,
            };
            const wasDone = Boolean(progress.levels[level]);
            const next = LEVEL_ORDER[LEVEL_ORDER.indexOf(level) + 1];
            update({ ...progress, levels: { ...progress.levels, [level]: result } });
            setJustUnlocked(!wasDone && next ? next : null);
            playSfx("win");
            go({ name: "levelDone", level, result });
          }}
        />
      );
      break;
    }
    case "levelDone":
      content = (
        <LevelComplete
          level={screen.level}
          result={screen.result}
          name={name}
          onContinue={() => {
            if (justUnlocked) playSfx("unlock");
            go({ name: "map" });
          }}
        />
      );
      break;
    case "final":
      content = (
        <Quiz
          title="🏆 FINAL CHALLENGE"
          questions={finalQuiz}
          studentName={name}
          onDone={(r) => {
            update({ ...progress, final: { ...r, stars: starsFor(r.correct / r.total) } });
            playSfx("win");
            go({ name: "result" });
          }}
        />
      );
      break;
    case "result":
      content = (
        <FinalResult
          progress={progress}
          onPlayAgain={() => {
            update({ ...emptyProgress(), name: progress.name });
            setJustUnlocked(null);
            go({ name: "map" });
          }}
          onHome={() => go(progress.final ? { name: "welcome" } : { name: "map" })}
        />
      );
      break;
  }

  return (
    <div className="flex min-h-dvh w-full flex-col overflow-x-hidden">
      {screen.name !== "splash" ? (
        <button
          type="button"
          onClick={() => {
            const v = !sfx;
            setSfx(v);
            setSfxEnabled(v);
          }}
          className="fixed right-3 top-3 z-50 rounded-full border-4 border-white bg-card px-3 py-2 text-sm font-extrabold text-foreground shadow-[var(--shadow-card)]"
          aria-label="Sound effect on/off"
        >
          {sfx ? "🔊 Sound On" : "🔇 Sound Off"}
        </button>
      ) : null}
      <div className="flex-1">{content}</div>
      {screen.name !== "splash" && !inGame ? <BottomNav active={navActive} onNavigate={onNav} /> : null}
    </div>
  );
}
