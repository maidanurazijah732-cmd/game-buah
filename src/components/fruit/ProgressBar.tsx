export function ProgressBar({ value, max, label }: { value: number; max: number; label?: string }) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full">
      {label ? (
        <div className="mb-1 flex items-center justify-between text-sm font-extrabold text-muted-foreground">
          <span>{label}</span>
          <span>{percent}%</span>
        </div>
      ) : null}
      <div
        className="h-5 w-full overflow-hidden rounded-full border-4 border-white bg-muted shadow-inner"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg, var(--sun), var(--grass-deep))",
          }}
        />
      </div>
    </div>
  );
}
