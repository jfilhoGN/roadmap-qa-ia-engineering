"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";
import { logout } from "@/app/actions/auth";

function LogoutButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-lg px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-60"
    >
      {pending ? "Saindo…" : "Sair"}
    </button>
  );
}

export default function Nav({
  username,
  isAdmin,
}: {
  username: string;
  isAdmin: boolean;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Roadmap", icon: "🗺️" },
    { href: "/playground", label: "Playground", icon: "🧪" },
    { href: "/anotacoes", label: "Anotações", icon: "📝" },
    { href: "/estudos", label: "Próximos estudos", icon: "🎯" },
    ...(isAdmin
      ? [{ href: "/relatorio", label: "Relatório", icon: "📊" }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-1">
        <span className="font-bold text-white mr-3 hidden sm:block">
          IA<span className="text-white/40">/</span>QA
        </span>
        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <span aria-hidden>{l.icon}</span>
                {l.label}
              </Link>
            );
          })}
        </div>
        <span className="text-sm text-white/50 hidden sm:block mr-2">
          {username}
          {isAdmin && (
            <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide text-amber-300/80 bg-amber-500/10 ring-1 ring-amber-400/30 rounded px-1.5 py-0.5">
              admin
            </span>
          )}
        </span>
        <form action={logout}>
          <LogoutButton />
        </form>
      </nav>
    </header>
  );
}
