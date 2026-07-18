import Link from "next/link";
import {
  getNews,
  pickPills,
  relativeDate,
  type NewsCategory,
} from "@/lib/news";

const CAT: Record<
  NewsCategory,
  { label: string; dot: string; badge: string }
> = {
  anthropic: {
    label: "Anthropic",
    dot: "bg-amber-400",
    badge: "text-amber-300 bg-amber-500/10 ring-amber-400/30",
  },
  brasil: {
    label: "Brasil",
    dot: "bg-emerald-400",
    badge: "text-emerald-300 bg-emerald-500/10 ring-emerald-400/30",
  },
  mundo: {
    label: "Mundo",
    dot: "bg-sky-400",
    badge: "text-sky-300 bg-sky-500/10 ring-sky-400/30",
  },
};

/**
 * Painel "Giro de IA" das homes logadas: destaque + grade de notícias.
 * Server component; agrega as fontes (cache ~1h) e linka cada card para
 * a notícia dentro de /news (âncora por id).
 */
export default async function NewsPills() {
  const items = await getNews();
  if (items.length === 0) return null;
  const picks = pickPills(items, 7);
  const [destaque, ...resto] = picks;

  return (
    <section className="mx-auto max-w-5xl px-4 pt-8">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <span aria-hidden>📰</span>
            Giro de IA
            <span className="hidden sm:inline text-xs font-normal text-white/40">
              o que aconteceu enquanto você estudava
            </span>
          </h2>
          <Link
            href="/news"
            className="shrink-0 rounded-lg bg-white/[0.06] ring-1 ring-white/15 px-3.5 py-1.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            todas as notícias →
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Destaque */}
          {destaque && (
            <Link
              href={`/news#${destaque.id}`}
              className="group sm:col-span-2 lg:row-span-2 flex flex-col justify-between rounded-xl border border-amber-400/20 bg-gradient-to-br from-amber-500/[0.08] to-transparent p-5 hover:border-amber-400/40 transition-colors"
            >
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${CAT[destaque.category].badge}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${CAT[destaque.category].dot}`}
                  />
                  {CAT[destaque.category].label}
                </span>
                <h3 className="mt-3 text-xl sm:text-2xl font-bold leading-snug text-white group-hover:text-amber-100 transition-colors">
                  {destaque.title}
                </h3>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[13px] text-white/50">
                <span className="font-medium text-white/70">
                  {destaque.source}
                </span>
                {relativeDate(destaque.publishedAt) && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{relativeDate(destaque.publishedAt)}</span>
                  </>
                )}
                <span className="ml-auto text-white/40 group-hover:text-amber-200 transition-colors">
                  ler →
                </span>
              </div>
            </Link>
          )}

          {/* Grade */}
          {resto.map((p) => (
            <Link
              key={p.id}
              href={`/news#${p.id}`}
              className="group flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 hover:bg-white/[0.06] transition-colors"
            >
              <h3 className="text-[15px] font-semibold leading-snug text-white/90 group-hover:text-white line-clamp-3">
                {p.title}
              </h3>
              <div className="mt-3 flex items-center gap-2 text-[12px] text-white/45">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${CAT[p.category].dot}`}
                />
                <span className="truncate font-medium text-white/60">
                  {p.source}
                </span>
                {relativeDate(p.publishedAt) && (
                  <span className="shrink-0">
                    · {relativeDate(p.publishedAt)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
