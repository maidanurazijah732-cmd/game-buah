/**
 * Audio FRUIT FUN.
 * 1. Pronunciation: coba file MP3 di /audio, bila gagal pakai Web Speech API (en-US).
 * 2. Sound effect: dibuat dengan WebAudio (tanpa file), bisa dimatikan siswa.
 * Pronunciation TIDAK ikut dimatikan oleh tombol sound on/off.
 */

let sfxEnabled = true;

export function setSfxEnabled(enabled: boolean) {
  sfxEnabled = enabled;
}

export function isSfxEnabled() {
  return sfxEnabled;
}

/* ---------------- Pronunciation ---------------- */

const mp3Ok = new Map<string, boolean>();
let currentAudio: HTMLAudioElement | null = null;

function pickEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find((v) => v.lang === "en-US" || v.lang === "en_US") ??
    voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ??
    null
  );
}

// Memuat daftar voice lebih awal (beberapa browser memuatnya asinkron).
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

function speak(word: string, onEnd: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = "en-US";
    const voice = pickEnglishVoice();
    if (voice) utter.voice = voice;
    utter.rate = 0.85;
    utter.pitch = 1.05;
    utter.onend = onEnd;
    utter.onerror = onEnd;
    window.speechSynthesis.speak(utter);
    // Pengaman bila event onend tidak terpanggil.
    window.setTimeout(onEnd, 2600);
  } catch {
    onEnd();
  }
}

/**
 * Mengucapkan satu kosakata Bahasa Inggris.
 * @returns promise yang selesai ketika audio berhenti.
 */
export function playPronunciation(word: string, mp3Url?: string): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };

    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const useSpeech = () => speak(word, finish);

    if (!mp3Url || mp3Ok.get(mp3Url) === false) {
      useSpeech();
      return;
    }

    try {
      const audio = new Audio(mp3Url);
      currentAudio = audio;
      audio.onended = finish;
      audio.onerror = () => {
        mp3Ok.set(mp3Url, false);
        useSpeech();
      };
      audio
        .play()
        .then(() => {
          mp3Ok.set(mp3Url, true);
        })
        .catch(() => {
          mp3Ok.set(mp3Url, false);
          useSpeech();
        });
    } catch {
      useSpeech();
    }
  });
}

export function stopPronunciation() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

/* ---------------- Sound effects ---------------- */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, duration: number, gain = 0.12) {
  const audioCtx = getCtx();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const vol = audioCtx.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  vol.gain.setValueAtTime(0.0001, audioCtx.currentTime + start);
  vol.gain.exponentialRampToValueAtTime(gain, audioCtx.currentTime + start + 0.03);
  vol.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + start + duration);
  osc.connect(vol).connect(audioCtx.destination);
  osc.start(audioCtx.currentTime + start);
  osc.stop(audioCtx.currentTime + start + duration + 0.05);
}

export type Sfx = "correct" | "wrong" | "unlock" | "win" | "tap";

export function playSfx(kind: Sfx) {
  if (!sfxEnabled) return;
  try {
    switch (kind) {
      case "correct":
        tone(880, 0, 0.14);
        tone(1320, 0.1, 0.2);
        break;
      case "wrong":
        tone(320, 0, 0.16, 0.09);
        tone(240, 0.12, 0.22, 0.09);
        break;
      case "unlock":
        tone(660, 0, 0.12);
        tone(880, 0.1, 0.12);
        tone(1175, 0.2, 0.28);
        break;
      case "win":
        [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.12, 0.26));
        break;
      case "tap":
        tone(600, 0, 0.07, 0.07);
        break;
    }
  } catch {
    /* sound effect bersifat opsional */
  }
}
