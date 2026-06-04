import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gestione preflight CORS
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

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
