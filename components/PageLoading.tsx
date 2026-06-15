export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block rounded-full border-2 border-white/20 border-t-white animate-spin ${className}`}
      aria-hidden
    />
  );
}

export default function PageLoading({ label = "Carregando…" }: { label?: string }) {
  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="flex flex-col items-center gap-3 text-white/50">
        <Spinner className="h-8 w-8" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}
