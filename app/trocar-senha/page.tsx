import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import ChangePasswordForm from "./ChangePasswordForm";

export const metadata = { title: "Trocar senha — Roadmap de IA para QAs" };

export default async function ChangePasswordPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Defina sua senha</h1>
          <p className="mt-2 text-sm text-white/50">
            Olá, <span className="text-white/80">{session.username}</span>. Como é
            seu primeiro acesso, crie uma nova senha para continuar.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <ChangePasswordForm />
        </div>
      </div>
    </main>
  );
}
