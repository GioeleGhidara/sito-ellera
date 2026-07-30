import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { hasArpalTimingData, type ArpalData } from "@/lib/arpal";

const ARPAL_CACHE_KEY = "ellera_arpal_cache_v3";
const ARPAL_CACHE_TTL = 15 * 60 * 1000;

interface ArpalCachePayload {
  data: ArpalData;
  updatedAt: number;
}

const readArpalCache = (allowStale = false): ArpalData | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(ARPAL_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<ArpalCachePayload>;
    if (!parsed?.data || typeof parsed.updatedAt !== "number") return null;
    if (!allowStale && Date.now() - parsed.updatedAt >= ARPAL_CACHE_TTL) return null;
    if (!hasArpalTimingData(parsed.data)) return null;

    return parsed.data;
  } catch {
    return null;
  }
};

const writeArpalCache = (data: ArpalData) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(ARPAL_CACHE_KEY, JSON.stringify({ data, updatedAt: Date.now() }));
  } catch {
    // noop
  }
};

interface UseArpalAlertState {
  data: ArpalData | null;
  loading: boolean;
  error: string | null;
}

interface UseArpalAlertOptions {
  /** Se false, non effettua alcuna fetch (utile quando il widget non è visibile/rilevante). */
  enabled?: boolean;
}

/**
 * Recupera lo stato di allerta ARPAL (cache localStorage 15 minuti + fallback stale-on-error).
 * Hook condiviso: prima duplicato quasi identico in WeatherWidget, Meteo e AlbiTrailArea.
 */
export const useArpalAlert = ({ enabled = true }: UseArpalAlertOptions = {}): UseArpalAlertState => {
  const [state, setState] = useState<UseArpalAlertState>({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!enabled) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const cached = readArpalCache();
    if (cached) {
      setState({ data: cached, loading: false, error: null });
      return;
    }

    let mounted = true;

    const fetchAlert = async () => {
      try {
        const { data: result, error: fnError } = await supabase.functions.invoke("arpal-allerta");
        if (fnError) throw new Error(fnError.message);
        if (!result?.success) throw new Error(result?.error ?? "Errore sconosciuto");

        if (!mounted) return;
        writeArpalCache(result.data);
        setState({ data: result.data, loading: false, error: null });
      } catch (err) {
        console.error("ARPAL fetch error:", err);
        if (!mounted) return;

        const stale = readArpalCache(true);
        if (stale) {
          setState({ data: stale, loading: false, error: null });
          return;
        }
        setState({ data: null, loading: false, error: "Dati allerta non disponibili" });
      }
    };

    fetchAlert();

    return () => {
      mounted = false;
    };
  }, [enabled]);

  return state;
};
