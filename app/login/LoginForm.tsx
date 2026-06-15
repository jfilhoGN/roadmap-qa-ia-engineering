"use client";

import { useActionState } from "react";
import { login, type FormState } from "@/app/actions/auth";

const initial: FormState = {};

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm text-white/60 mb-1.5">Usuário</label>
        <input
          name="username"
          autoComplete="username"
          autoFocus
          placeholder="nome.sobrenome"
          className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-sky-400/50 focus:bg-white/[0.07] outline-none px-4 py-3 text-white placeholder:text-white/30 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm text-white/60 mb-1.5">Senha</label>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-sky-400/50 focus:bg-white/[0.07] outline-none px-4 py-3 text-white placeholder:text-white/30 transition-colors"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-300 bg-red-500/10 ring-1 ring-red-400/30 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-white text-black font-semibold py-3 hover:bg-white/90 disabled:opacity-60 transition-colors"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
