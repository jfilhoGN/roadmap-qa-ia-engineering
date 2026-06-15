"use client";

import { useActionState } from "react";
import { changePassword, type FormState } from "@/app/actions/auth";

const initial: FormState = {};

export default function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePassword, initial);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm text-white/60 mb-1.5">Nova senha</label>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          autoFocus
          placeholder="mínimo 8 caracteres"
          className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-emerald-400/50 focus:bg-white/[0.07] outline-none px-4 py-3 text-white placeholder:text-white/30 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm text-white/60 mb-1.5">
          Confirmar nova senha
        </label>
        <input
          name="confirm"
          type="password"
          autoComplete="new-password"
          placeholder="repita a nova senha"
          className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-emerald-400/50 focus:bg-white/[0.07] outline-none px-4 py-3 text-white placeholder:text-white/30 transition-colors"
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
        className="w-full rounded-xl bg-emerald-400 text-black font-semibold py-3 hover:bg-emerald-300 disabled:opacity-60 transition-colors"
      >
        {pending ? "Salvando..." : "Definir nova senha"}
      </button>
    </form>
  );
}
