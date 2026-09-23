/** Navigasi sederhana: bottom nav di HP, tetap besar & mudah disentuh di laptop. */

export type NavKey = "home" | "belajar" | "petualangan" | "hasil";

const ITEMS: { key: NavKey; icon: string; label: string }[] = [
  { key: "home", icon: "🏠", label: "Home" },
  { key: "belajar", icon: "📚", label: "Belajar" },
  { key: "petualangan", icon: "🗺️", label: "Petualangan" },
  { key: "hasil", icon: "🏆", label: "Hasil" },
];

export function BottomNav({ active, onNavigate }: { active: NavKey; onNavigate: (key: NavKey) => void }) {
  return (
    <nav className="sticky bottom-0 z-40 mt-6 w-full border-t-4 border-white bg-white/90 backdrop-blur">
      <ul className="mx-auto flex max-w-2xl items-stretch justify-between px-2 py-2">
        {ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <li key={item.key} className="flex-1">
              <button
                type="button"
                onClick={() => onNavigate(item.key)}
                className={`flex w-full flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-xs font-extrabold transition-colors sm:text-sm ${
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="text-2xl">{item.icon}</span>
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
