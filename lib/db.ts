import "server-only";
import postgres from "postgres";

type Sql = ReturnType<typeof postgres>;

declare global {
  // eslint-disable-next-line no-var
  var __rqaSql: Sql | undefined;
}

function getSql(): Sql {
  if (!global.__rqaSql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL não definida");
    // ssl require: Supabase exige TLS. prepare:false: compatível com o pooler
    // (pgbouncer em modo Transaction não suporta prepared statements).
    global.__rqaSql = postgres(url, { ssl: "require", prepare: false });
  }
  return global.__rqaSql;
}

/**
 * Proxy lazy: a conexão só é criada na primeira query (em request time),
 * nunca no import — assim o `next build` não tenta conectar.
 */
export const sql = new Proxy((() => {}) as unknown as Sql, {
  apply(_target, _thisArg, args: unknown[]) {
    // chamada como tagged template: sql`...`
    return (getSql() as unknown as (...a: unknown[]) => unknown)(...args);
  },
  get(_target, prop: string) {
    const s = getSql() as unknown as Record<string, unknown>;
    const value = s[prop];
    return typeof value === "function" ? value.bind(s) : value;
  },
}) as Sql;
