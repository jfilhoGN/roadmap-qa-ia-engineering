import LoginForm from "./LoginForm";

export const metadata = { title: "Entrar — Roadmap de IA para QAs" };

export default function LoginPage() {
  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">
            COE Qualidade
          </span>
          <h1 className="mt-2 text-3xl font-extrabold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
            IA para QAs
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Entre com seu usuário para acessar o roadmap.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          No primeiro acesso você definirá uma nova senha.
        </p>
      </div>
    </main>
  );
}
