import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const allowedOrigins = [
  "https://ellera.it",
  "https://www.ellera.it",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowOrigin = allowedOrigins.includes(origin) ? origin : "https://ellera.it";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

// Rate limiting best-effort in-memory (per istanza edge function): sufficiente a
// scoraggiare l'enumerazione casuale dei codici promo, non a bloccare un attacco distribuito.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const rateLimitHits = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = rateLimitHits.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitHits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

serve(async (req) => {
  // Gestione preflight CORS
  if (req.method === "OPTIONS") return new Response("ok", { headers: getCorsHeaders(req) });

  const corsHeaders = getCorsHeaders(req);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: "Troppi tentativi, riprova più tardi." }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { code } = await req.json();
    if (!code) throw new Error("Codice mancante");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Cerca il codice promo (maybeSingle evita l'errore se non c'è corrispondenza)
    const { data, error } = await supabaseAdmin
      .from("promo_codes")
      .select("code, discount_amount, expires_at")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .maybeSingle();

    // Se c'è un errore o non trova il codice
    if (error || !data) {
      return new Response(JSON.stringify({ error: "Codice sconto non valido." }), { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // Controlla la scadenza
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: "Questo codice sconto è scaduto." }), { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // Tutto ok, restituisce lo sconto
    return new Response(JSON.stringify({ discount_amount: data.discount_amount }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (err) {
    return new Response(JSON.stringify({ error: "Errore interno." }), { 
        status: 500, 
        headers: corsHeaders 
    });
  }
});
