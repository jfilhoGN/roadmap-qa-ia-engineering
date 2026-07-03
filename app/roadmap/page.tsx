import Link from "next/link";
import RoadmapClient from "@/components/RoadmapClient";

export const metadata = {
  title: "Roadmap de IA para QAs — do básico ao especialista",
  description:
    "Roadmap público de IA para QAs: dos fundamentos aos agentes, com exemplos práticos aplicados a Qualidade.",
};

// Página pública: qualquer pessoa (mentores, comunidade) pode ver o roadmap.
// Não exige login e não toca no banco — o progresso fica só no navegador.
export default function PublicRoadmapPage() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur">
        <nav className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-white">
            IA<span className="text-white/40">/</span>QA
          </span>
          <Link
            href="/login"
            className="rounded-lg px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            Sou do time COE · Entrar →
          </Link>
        </nav>
      </header>
      <RoadmapClient isPublic />
    </>
  );
}
