import Nav from "@/components/Nav";
import Glossario from "@/components/Glossario";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Glossário — Roadmap de IA" };

export default async function GlossarioPage() {
  const session = await requireUser();
  return (
    <>
      <Nav username={session.username} isAdmin={session.isAdmin} />
      <Glossario />
    </>
  );
}
