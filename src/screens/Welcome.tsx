import { useState } from "react";
import { Fruity } from "@/components/fruit/Fruity";
import { Scene } from "@/components/fruit/Scene";
import { playSfx } from "@/lib/fruit-audio";

export function Welcome({ initialName, onStart }: { initialName: string; onStart: (name: string) => void }) {
  const [name, setName] = useState(initialName);
  const trimmed = name.trim();

  return (
    <Scene>
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center gap-5 px-4 py-10 text-center">
        <h1 className="font-display text-4xl font-extrabold text-primary drop-shadow-[0_3px_0_rgba(255,255,255,0.9)] sm:text-6xl">
          🍎 FRUIT FUN 🍌
        </h1>
        <p className="font-display text-xl font-bold text-secondary-foreground sm:text-2xl">
          English Vocabulary Adventure
        </p>
        <p className="font-display text-lg font-bold text-foreground">Belajar Bahasa Inggris Jadi Lebih Seru!</p>

        <Fruity
          size="md"
          message="Hello! Aku Fruity. Hari ini kita akan berpetualang sambil belajar nama-nama buah dalam Bahasa Inggris!"
        />

        <div className="panel w-full max-w-md p-5">
          <label htmlFor="student-name" className="font-display text-xl font-extrabold text-foreground">
            Siapa namamu?
          </label>
          <input
            id="student-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && trimmed) onStart(trimmed);
            }}
            placeholder="Tulis nama kamu..."
            maxLength={20}
            autoComplete="off"
            className="mt-3 w-full rounded-2xl border-4 border-border bg-muted px-4 py-3 text-center text-xl font-extrabold text-foreground outline-none focus:border-ring"
          />

          {trimmed ? (
            <p className="anim-pop mt-3 font-display text-lg font-extrabold text-secondary-foreground">
              Halo, {trimmed}! Siap memulai petualangan?
            </p>
          ) : (
            <p className="mt-3 text-sm font-bold text-muted-foreground">Tulis namamu dulu ya, biar Fruity kenal 😊</p>
          )}

          <button
            type="button"
            disabled={!trimmed}
            onClick={() => {
              playSfx("tap");
              onStart(trimmed);
            }}
            className="btn-toy mt-4 w-full"
          >
            🚀 MULAI PETUALANGAN
          </button>
        </div>
      </div>
    </Scene>
  );
}
