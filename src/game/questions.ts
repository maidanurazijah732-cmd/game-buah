/** Pembuat soal mini game & final challenge (soal dan posisi jawaban selalu diacak). */

import { VOCABULARY, getVocabByLevel, type LevelId, type Vocab } from "@/data/vocabulary";

export type QuestionKind = "pick-image" | "pick-word" | "pick-meaning" | "listen";

export type Question = {
  id: string;
  kind: QuestionKind;
  answer: Vocab;
  options: Vocab[];
};

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function buildOptions(answer: Vocab, pool: Vocab[], count = 4): Vocab[] {
  const distractors = shuffle(pool.filter((v) => v.id !== answer.id)).slice(0, count - 1);
  return shuffle([answer, ...distractors]);
}

function makeQuestion(kind: QuestionKind, answer: Vocab, pool: Vocab[], index: number): Question {
  return {
    id: `${kind}-${answer.id}-${index}`,
    kind,
    answer,
    options: buildOptions(answer, pool),
  };
}

/** 6 soal per level: tebak gambar, tebak nama, dan listen and choose. */
export function buildLevelQuiz(level: LevelId): Question[] {
  const pool = getVocabByLevel(level);
  const kinds: QuestionKind[] = ["pick-image", "pick-image", "pick-word", "pick-word", "listen", "listen"];
  const words = shuffle(pool);
  const questions = kinds.map((kind, i) => makeQuestion(kind, words[i % words.length]!, pool, i));
  return shuffle(questions);
}

/** 15 soal campuran dari seluruh kosakata. */
export function buildFinalQuiz(): Question[] {
  const kinds: QuestionKind[] = ["pick-word", "pick-image", "pick-meaning", "listen"];
  const words = shuffle(VOCABULARY);
  return shuffle(words.map((word, i) => makeQuestion(kinds[i % kinds.length]!, word, VOCABULARY, i)));
}

export const QUESTION_PROMPT: Record<QuestionKind, (v: Vocab) => string> = {
  "pick-image": (v) => `Which one is ${v.english.toUpperCase()}?`,
  "pick-word": () => "What fruit is this?",
  "pick-meaning": (v) => `Apa arti "${v.english}"?`,
  listen: () => "Buah apakah yang kamu dengar?",
};

export const QUESTION_HINT: Record<QuestionKind, string> = {
  "pick-image": "Klik gambar yang benar!",
  "pick-word": "Pilih nama Bahasa Inggrisnya!",
  "pick-meaning": "Pilih arti Bahasa Indonesianya!",
  listen: "Dengarkan suaranya, lalu pilih jawabanmu!",
};
