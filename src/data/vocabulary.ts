/**
 * Data kosakata terpusat untuk FRUIT FUN.
 * 15 kosakata tema fruits — jangan menambah kosakata lain.
 */

import apple from "@/assets/fruits/apple.png";
import mango from "@/assets/fruits/mango.png";
import orange from "@/assets/fruits/orange.png";
import grape from "@/assets/fruits/grape.png";
import banana from "@/assets/fruits/banana.png";
import coconut from "@/assets/fruits/coconut.png";
import papaya from "@/assets/fruits/papaya.png";
import pineapple from "@/assets/fruits/pineapple.png";
import mangosteen from "@/assets/fruits/mangosteen.png";
import guava from "@/assets/fruits/guava.png";
import strawberry from "@/assets/fruits/strawberry.png";
import jackfruit from "@/assets/fruits/jackfruit.png";
import watermelon from "@/assets/fruits/watermelon.png";
import starfruit from "@/assets/fruits/starfruit.png";
import dragonFruit from "@/assets/fruits/dragon-fruit.png";

export type LevelId = "easy" | "medium" | "hard";

export type Vocab = {
  id: number;
  english: string;
  indonesian: string;
  level: LevelId;
  image: string;
  /** File MP3 opsional; bila tidak ada, otomatis memakai Web Speech API. */
  audio: string;
};

export const VOCABULARY: Vocab[] = [
  { id: 1, english: "Apple", indonesian: "Apel", level: "easy", image: apple, audio: "/audio/apple.mp3" },
  { id: 2, english: "Mango", indonesian: "Mangga", level: "easy", image: mango, audio: "/audio/mango.mp3" },
  { id: 3, english: "Orange", indonesian: "Jeruk", level: "easy", image: orange, audio: "/audio/orange.mp3" },
  { id: 4, english: "Grape", indonesian: "Anggur", level: "easy", image: grape, audio: "/audio/grape.mp3" },
  { id: 5, english: "Banana", indonesian: "Pisang", level: "easy", image: banana, audio: "/audio/banana.mp3" },
  { id: 6, english: "Coconut", indonesian: "Kelapa", level: "medium", image: coconut, audio: "/audio/coconut.mp3" },
  { id: 7, english: "Papaya", indonesian: "Pepaya", level: "medium", image: papaya, audio: "/audio/papaya.mp3" },
  { id: 8, english: "Pineapple", indonesian: "Nanas", level: "medium", image: pineapple, audio: "/audio/pineapple.mp3" },
  { id: 9, english: "Mangosteen", indonesian: "Manggis", level: "medium", image: mangosteen, audio: "/audio/mangosteen.mp3" },
  { id: 10, english: "Guava", indonesian: "Jambu", level: "medium", image: guava, audio: "/audio/guava.mp3" },
  { id: 11, english: "Strawberry", indonesian: "Stroberi", level: "hard", image: strawberry, audio: "/audio/strawberry.mp3" },
  { id: 12, english: "Jackfruit", indonesian: "Nangka", level: "hard", image: jackfruit, audio: "/audio/jackfruit.mp3" },
  { id: 13, english: "Watermelon", indonesian: "Semangka", level: "hard", image: watermelon, audio: "/audio/watermelon.mp3" },
  { id: 14, english: "Starfruit", indonesian: "Belimbing", level: "hard", image: starfruit, audio: "/audio/starfruit.mp3" },
  { id: 15, english: "Dragon Fruit", indonesian: "Buah Naga", level: "hard", image: dragonFruit, audio: "/audio/dragon-fruit.mp3" },
];

export const LEVELS: {
  id: LevelId;
  order: number;
  icon: string;
  label: string;
  place: string;
  color: string;
}[] = [
  { id: "easy", order: 1, icon: "🌱", label: "EASY", place: "Kebun Ceria", color: "var(--grass-deep)" },
  { id: "medium", order: 2, icon: "🌳", label: "MEDIUM", place: "Hutan Buah", color: "var(--mango)" },
  { id: "hard", order: 3, icon: "🏆", label: "HARD", place: "Pulau Buah Misterius", color: "var(--grape)" },
];

export const getVocabByLevel = (level: LevelId): Vocab[] =>
  VOCABULARY.filter((v) => v.level === level);

export const FRUITY_IMG = "/fruity";
