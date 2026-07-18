/**
 * Agregador de notícias de IA — server-side, sem dependências.
 * Fontes: Anthropic (news + research, via parse do HTML + og:title),
 * Brasil (Tecnoblog, MIT Tech Review BR, Google News IA) e mundo
 * (TechCrunch AI, The Verge AI). Cache via revalidate (~1h) do Next.
 * Toda fonte é best-effort: se uma cair, as demais seguem.
 */

import { unstable_cache } from "next/cache";

export type NewsCategory = "anthropic" | "brasil" | "mundo";

export type NewsItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  category: NewsCategory;
  /** ISO date quando conhecida */
  publishedAt?: string;
};

const REVALIDATE = 3600; // 1h — "notícias diárias" com folga
const UA = { "user-agent": "Mozilla/5.0 (compatible; RoadmapIA/1.0)" };

function hashId(url: string): string {
  let h = 5381;
  for (let i = 0; i < url.length; i++) h = (h * 33) ^ url.charCodeAt(i);
  return "n" + (h >>> 0).toString(36);
}

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(?:x27|39);/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: UA,
      signal: AbortSignal.timeout(6000),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/** Filtro de foco em IA para feeds generalistas. */
const AI_RE =
  /intelig[êe]ncia artificial|\bIA\b|\bAI\b|Claude|Anthropic|OpenAI|ChatGPT|\bGPT-?\d|Gemini|\bLLM\b|copilot|machine learning|deep ?learning|agente[s]? de IA|DeepSeek|Mistral|Llama/i;

// ---------- RSS 2.0 ----------
function parseRss(
  xml: string,
  source: string,
  category: NewsCategory,
  onlyAI: boolean,
  max: number,
): NewsItem[] {
  const items: NewsItem[] = [];
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/g) ?? [];
  for (const b of blocks) {
    const title = decodeEntities(b.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? "");
    const link = decodeEntities(b.match(/<link[^>]*>([\s\S]*?)<\/link>/)?.[1] ?? "");
    const pub = b.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1];
    if (!title || !link) continue;
    if (onlyAI && !AI_RE.test(title)) continue;
    const d = pub ? new Date(pub) : null;
    items.push({
      id: hashId(link),
      title,
      url: link,
      source,
      category,
      publishedAt: d && !isNaN(+d) ? d.toISOString() : undefined,
    });
    if (items.length >= max) break;
  }
  return items;
}

// ---------- Atom (The Verge) ----------
function parseAtom(
  xml: string,
  source: string,
  category: NewsCategory,
  max: number,
): NewsItem[] {
  const items: NewsItem[] = [];
  const blocks = xml.match(/<entry[\s>][\s\S]*?<\/entry>/g) ?? [];
  for (const b of blocks) {
    const title = decodeEntities(b.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? "");
    const link =
      b.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/)?.[1] ??
      b.match(/<link[^>]*href="([^"]+)"/)?.[1] ??
      "";
    const pub = b.match(/<(?:published|updated)>([\s\S]*?)<\/(?:published|updated)>/)?.[1];
    if (!title || !link) continue;
    const d = pub ? new Date(pub) : null;
    items.push({
      id: hashId(link),
      title,
      url: decodeEntities(link),
      source,
      category,
      publishedAt: d && !isNaN(+d) ? d.toISOString() : undefined,
    });
    if (items.length >= max) break;
  }
  return items;
}

// ---------- Anthropic (parse do HTML das listagens + og:title) ----------
const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

async function anthropicSection(
  path: "news" | "research",
  max: number,
): Promise<NewsItem[]> {
  const html = await fetchText(`https://www.anthropic.com/${path}`);
  if (!html) return [];
  // âncoras da listagem: slug + (no texto) data "Jul 9, 2026"
  const re = new RegExp(
    `<a[^>]+href="(/${path}/[^"#?]+)"[^>]*>([\\s\\S]*?)</a>`,
    "g",
  );
  const seen = new Set<string>();
  const entries: { slug: string; date?: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) && entries.length < max * 2) {
    const slug = m[1];
    if (seen.has(slug)) continue;
    seen.add(slug);
    const text = m[2].replace(/<[^>]+>/g, " ");
    const dm = text.match(/([A-Z][a-z]{2})\s+(\d{1,2}),\s+(\d{4})/);
    let date: string | undefined;
    if (dm) {
      const mo = MONTHS[dm[1].toLowerCase()];
      if (mo !== undefined) date = new Date(Date.UTC(+dm[3], mo, +dm[2])).toISOString();
    }
    entries.push({ slug, date });
  }
  // título exato via og:title de cada artigo (cacheado individualmente)
  const top = entries.slice(0, max);
  const items = await Promise.all(
    top.map(async ({ slug, date }) => {
      const url = `https://www.anthropic.com${slug}`;
      let title = "";
      const page = await fetchText(url);
      if (page) {
        title = decodeEntities(
          page.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/)?.[1] ??
            page.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ??
            "",
        ).replace(/\s*\\?\|?\s*Anthropic\s*$/i, "");
      }
      if (!title) {
        // fallback: humaniza o slug
        title = slug
          .split("/")
          .pop()!
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      }
      return {
        id: hashId(url),
        title,
        url,
        source: path === "news" ? "Anthropic News" : "Anthropic Research",
        category: "anthropic" as const,
        publishedAt: date,
      };
    }),
  );
  return items;
}

// ---------- Agregação ----------
async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch {
    return fallback;
  }
}

async function aggregateNews(): Promise<NewsItem[]> {
  const [anthNews, anthResearch, tecno, mit, gnews, tc, verge] =
    await Promise.all([
      safe(anthropicSection("news", 6), []),
      safe(anthropicSection("research", 4), []),
      safe(
        fetchText("https://tecnoblog.net/feed/").then((x) =>
          x ? parseRss(x, "Tecnoblog", "brasil", true, 6) : [],
        ),
        [],
      ),
      safe(
        fetchText("https://mittechreview.com.br/feed/").then((x) =>
          x ? parseRss(x, "MIT Tech Review Brasil", "brasil", true, 6) : [],
        ),
        [],
      ),
      safe(
        fetchText(
          "https://news.google.com/rss/search?q=intelig%C3%AAncia+artificial&hl=pt-BR&gl=BR&ceid=BR:pt-419",
        ).then((x) => (x ? parseRss(x, "Google News · IA", "brasil", false, 8) : [])),
        [],
      ),
      safe(
        fetchText("https://techcrunch.com/category/artificial-intelligence/feed/").then(
          (x) => (x ? parseRss(x, "TechCrunch AI", "mundo", false, 6) : []),
        ),
        [],
      ),
      safe(
        fetchText("https://www.theverge.com/rss/ai-artificial-intelligence/index.xml").then(
          (x) => (x ? parseAtom(x, "The Verge AI", "mundo", 6) : []),
        ),
        [],
      ),
    ]);

  const all = [...anthNews, ...anthResearch, ...tecno, ...mit, ...gnews, ...tc, ...verge];
  // dedupe por URL
  const seen = new Set<string>();
  const out: NewsItem[] = [];
  for (const it of all) {
    if (seen.has(it.url)) continue;
    seen.add(it.url);
    out.push(it);
  }
  // ordena por data desc dentro do conjunto (sem data vai para o fim da categoria)
  out.sort((a, b) => {
    if (a.category !== b.category) return 0;
    const da = a.publishedAt ? +new Date(a.publishedAt) : 0;
    const db = b.publishedAt ? +new Date(b.publishedAt) : 0;
    return db - da;
  });
  return out;
}

/**
 * getNews com cache do RESULTADO agregado (stale-while-revalidate, ~1h):
 * requisições servem o payload cacheado na hora e a renovação roda em
 * background — só a primeira requisição absoluta paga a agregação.
 */
export const getNews = unstable_cache(aggregateNews, ["ai-news-v1"], {
  revalidate: REVALIDATE,
});

/** Pílulas da home: mistura recente das 3 categorias. */
export function pickPills(items: NewsItem[], count = 6): NewsItem[] {
  const byCat = (c: NewsCategory) => items.filter((i) => i.category === c);
  const picks: NewsItem[] = [];
  const buckets = [byCat("anthropic"), byCat("brasil"), byCat("mundo")];
  let idx = 0;
  while (picks.length < count) {
    const b = buckets[idx % 3];
    const next = b.shift();
    idx++;
    if (next) picks.push(next);
    if (buckets.every((x) => x.length === 0) && !next) break;
  }
  return picks;
}

/** "há 3 h", "ontem", "12 jul" */
export function relativeDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = Date.now() - +d;
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "agora há pouco";
  if (h < 24) return `há ${h} h`;
  if (h < 48) return "ontem";
  return d.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}
