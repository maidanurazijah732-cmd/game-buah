/** Tombol pronunciation: MP3 bila ada, fallback Web Speech API (en-US). */

import { useEffect, useRef, useState } from "react";
import { playPronunciation } from "@/lib/fruit-audio";

type Props = {
  word: string;
  mp3?: string;
  idleLabel?: string;
  className?: string;
  autoPlay?: boolean;
  onPlayed?: () => void;
};

export function SpeakButton({
  word,
  mp3,
  idleLabel = "🔊 DENGARKAN",
  className = "",
  autoPlay = false,
  onPlayed,
}: Props) {
  const [playing, setPlaying] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const play = async () => {
    if (playing) return;
    setPlaying(true);
    await playPronunciation(word, mp3);
    if (mounted.current) setPlaying(false);
    onPlayed?.();
  };

  useEffect(() => {
    if (!autoPlay) return;
    void play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word, autoPlay]);

  return (
    <button
      type="button"
      onClick={() => void play()}
      className={`btn-toy btn-toy-sky ${className}`}
      aria-label={`Dengarkan pengucapan ${word}`}
    >
      <span className={playing ? "anim-wiggle inline-block text-2xl" : "text-2xl"}>🔊</span>
      {playing ? "Sedang diputar..." : idleLabel}
    </button>
  );
}
