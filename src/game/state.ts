/** Penyimpanan progress siswa memakai localStorage (tanpa akun, tanpa data pribadi). */

import type { LevelId } from "@/data/vocabulary";

export type LevelResult = {
  score: number;
  correct: number;
  total: number;
  stars: number;
  timeSec: number;
};

export type FinalResult = {
  score: number;
  correct: number;
  total: number;
  stars: number;
  timeSec: number;
};

export type Progress = {
  name: string;
  levels: Partial<Record<LevelId, LevelResult>>;
  final: FinalResult | null;
};

const KEY = "fruitfun.progress.v1";

export const emptyProgress = (): Progress => ({ name: "", levels: {}, final: null });

export function loadProgress(): Progress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Progress;
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      levels: parsed.levels ?? {},
      final: parsed.final ?? null,
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: Progress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    /* localStorage bisa penuh / diblokir — permainan tetap jalan */
  }
}

export function clearProgress() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* abaikan */
  }
}

export const LEVEL_ORDER: LevelId[] = ["easy", "medium", "hard"];

export function isLevelUnlocked(level: LevelId, progress: Progress): boolean {
  const index = LEVEL_ORDER.indexOf(level);
  if (index <= 0) return true;
  const previous = LEVEL_ORDER[index - 1]!;
  return Boolean(progress.levels[previous]);
}

export function completedLevelCount(progress: Progress): number {
  return LEVEL_ORDER.filter((level) => progress.levels[level]).length;
}

export function allLevelsDone(progress: Progress): boolean {
  return completedLevelCount(progress) === LEVEL_ORDER.length;
}

export function totalStars(progress: Progress): number {
  const levelStars = LEVEL_ORDER.reduce((sum, level) => sum + (progress.levels[level]?.stars ?? 0), 0);
  return levelStars + (progress.final?.stars ?? 0);
}

export function starsFor(accuracy: number): number {
  if (accuracy >= 0.85) return 3;
  if (accuracy >= 0.6) return 2;
  if (accuracy > 0) return 1;
  return 0;
}

export function formatTime(totalSeconds: number): string {
  const mm = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mm}:${ss}`;
}
