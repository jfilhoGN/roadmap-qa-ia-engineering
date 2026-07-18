import Nav from "@/components/Nav";
import { requireUser } from "@/lib/auth";
import {
  getNews,
  relativeDate,
  type NewsCategory,
  type NewsItem,
} from "@/lib/news";

export const metadata = { title: "Notícias de IA — Roadmap de IA" };
export const dynamic = "force-dynamic";

const SECTIONS: {
  cat: NewsCategory;
  title: string;
  icon: string;
  desc: string;
  dot: string;
}[] = [
  {
    cat: "anthropic",
    title: "Anthropic",
    icon: "🟡",
    desc: "Lançamentos, anúncios e pesquisa direto da fonte.",
    dot: "bg-amber-400",
  },
  {
    cat: "brasil",
    title: "Brasil",
    icon: "🟢",
    desc: "IA em português: veículos e agregadores brasileiros.",
    dot: "bg-emerald-400",
  },
  {
    cat: "mundo",
    title: "Mundo",
    icon: "🔵",
    desc: "O noticiário internacional de IA.",
    dot: "bg-sky-400",
  },
];

const FONTES_EXTRAS = [
  { label: "The Drops — newsletter diária de IA (pt-BR)", url: "https://www.thedrops.com.br/" },
  { label: "Anthropic — News", url: "https://www.anthropic.com/news" },
  { label: "Anthropic — Research", url: "https://www.anthropic.com/research" },
  { label: "MIT Technology Review Brasil", url: "https://mittechreview.com.br/" },
];

function NewsCard({ item }: { item: NewsItem }) {
  const when = relativeDate(item.publishedAt);
  return (
    <a
      id={item.id}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 hover:bg-white/[0.06] transition-colors scroll-mt-24 target:ring-2 target:ring-sky-400/60"
    >
      <h3 className="text-[15px] font-semibold leading-snug text-white/90 group-hover:text-white">
        {item.title}
      </h3>
      <div className="mt-2 flex items-center gap-2 text-[12px] text-white/45">
        <span className="font-medium text-white/60">{item.source}</span>
        {when && (
          <>
            <span aria-hidden>·</span>
            <span>{when}</span>
          </>
        )}
        <span className="ml-auto text-white/30 group-hover:text-sky-300 transition-colors">
          abrir ↗
        </span>
      </div>
    </a>
  );
}

export default async function NewsPage() {
  const session = await requireUser();
  const items = await getNews();

  return (
    <>
      <Nav username={session.username} isAdmin={session.isAdmin} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white">Notícias de IA</h1>
          <p className="text-sm text-white/55 mt-1">
            O giro diário para o time: Anthropic, Brasil e mundo — atualizado
            ao longo do dia. Links abrem na fonte original.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {SECTIONS.map((s) => (
              <a
                key={s.cat}
                href={`#sec-${s.cat}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                {s.title}
              </a>
            ))}
          </div>
        </header>

        {items.length === 0 && (
          <p className="text-white/40 text-sm py-10 text-center">
            As fontes de notícias estão indisponíveis no momento — tente
            novamente em instantes.
          </p>
        )}

        <div className="space-y-10">
          {SECTIONS.map((s) => {
            const list = items.filter((i) => i.category === s.cat);
            if (list.length === 0) return null;
            return (
              <section key={s.cat} id={`sec-${s.cat}`} className="scroll-mt-20">
                <div className="mb-3">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                    <span aria-hidden>{s.icon}</span>
                    {s.title}
                    <span className="text-xs font-normal text-white/35">
                      {list.length} {list.length === 1 ? "notícia" : "notícias"}
                    </span>
                  </h2>
                  <p className="text-[13px] text-white/45">{s.desc}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {list.map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white/50 mb-3">
            Fontes para acompanhar
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {FONTES_EXTRAS.map((f) => (
              <li key={f.url}>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-sky-300 hover:text-sky-200 underline underline-offset-2"
                >
                  {f.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-white/30">
            Agregado automaticamente de fontes públicas (Anthropic, Tecnoblog,
            MIT Tech Review Brasil, Google News, TechCrunch, The Verge).
            Conteúdo pertence aos veículos originais.
          </p>
        </section>
      </main>
    </>
  );
}
