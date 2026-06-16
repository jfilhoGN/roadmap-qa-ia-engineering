import Nav from "@/components/Nav";
import Playground from "@/components/Playground";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Playground — Roadmap de IA para QAs" };

export default async function PlaygroundPage() {
  const session = await requireUser();
  return (
    <>
      <Nav username={session.username} isAdmin={session.isAdmin} />
      <Playground />
    </>
  );
}
