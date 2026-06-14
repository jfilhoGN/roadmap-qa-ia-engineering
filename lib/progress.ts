"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "roadmap-qa-ia:progress:v1";

/** Hook de progresso persistido no localStorage (por navegador, sem backend). */
export function useProgress() {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  // Carrega na montagem (client-side only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        setDone(new Set(arr));
      }
    } catch {
      /* ignore storage errors */
    }
    setLoaded(true);
  }, []);

  const persist = useCallback((next: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(
    (id: string) => {
      setDone((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const reset = useCallback(() => {
    setDone(new Set());
    persist(new Set());
  }, [persist]);

  const isDone = useCallback((id: string) => done.has(id), [done]);

  return { done, isDone, toggle, reset, loaded };
}
