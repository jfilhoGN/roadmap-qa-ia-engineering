import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roadmap de IA — COE Qualidade & Agilidade",
  description:
    "Roadmap dinâmico de IA, do básico ao especialista, com exemplos práticos por trilha — Qualidade (QA) e Agilidade.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
