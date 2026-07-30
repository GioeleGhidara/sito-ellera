import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

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
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

let supabaseAdmin: ReturnType<typeof createClient> | null = null;
let stripe: Stripe | null = null;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        ...getCorsHeaders(req),
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const { token, registrationData } = await req.json();

    if (!token) throw new Error("Missing security token");
    if (!registrationData) throw new Error("Missing data");

    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");
    if (!turnstileSecret) {
      throw new Error("Server configuration error: security key missing");
    }
    
    // 1. Verify Turnstile Token
    const verifyFormData = new FormData();
    verifyFormData.append("secret", turnstileSecret);
    verifyFormData.append("response", token);

    const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: verifyFormData,
    });

    const turnstileData = await turnstileRes.json();
    if (!turnstileData.success) {
      throw new Error("Security verification failed. Please try again.");
    }

    // 2. Strict Whitelisting & Validation
    const allowedFields = [
      "nome_cognome", "email", "telefono", "pacchetto", "menu", "note",
      "pagamento", "codice_promo", "codice_sconto_applicato", "chk_regolamento", "chk_responsabilita", "chk_privacy",
      "chk_media", "regolamento_version", "timestamp", "user_agent", 
      "ip_address", "paypal_order_id", "stripe_payment_intent_id"
    ];

    const cleanData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (registrationData[field] !== undefined) {
        cleanData[field] = registrationData[field];
      }
    }

    // Basic required fields check
    if (!cleanData.nome_cognome || !cleanData.email || !cleanData.pacchetto) {
      throw new Error("Missing required fields (Name, Email, Package)");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(String(cleanData.email))) {
      throw new Error("Invalid email format")
    }

    if (String(cleanData.nome_cognome || "").length > 100) {
      throw new Error("Nome troppo lungo");
    }
    if (cleanData.note && String(cleanData.note).length > 500) {
      throw new Error("Note troppo lunghe");
    }

    // Il client non può auto-dichiararsi "pagato": quello stato è impostato solo dal
    // webhook Stripe (con service role key) dopo una conferma di pagamento reale.
    const ALLOWED_PAGAMENTO = ["stripe_pending", "sul_posto", "gratuito"];
    if (!ALLOWED_PAGAMENTO.includes(String(cleanData.pagamento))) {
      throw new Error("Valore pagamento non valido");
    }

    // Consents check
    if (!cleanData.chk_regolamento || !cleanData.chk_responsabilita || !cleanData.chk_privacy) {
      throw new Error("Mandatory consents missing");
    }

    // 3. Initialize Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Database configuration error");
    }

    supabaseAdmin ??= createClient(supabaseUrl, supabaseServiceRoleKey);

    if (cleanData.stripe_payment_intent_id) {
      const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || Deno.env.get("STRIPE_TEST_KEY");
      if (!stripeSecretKey) throw new Error("Stripe non configurato sul server");
      stripe ??= new Stripe(stripeSecretKey, { apiVersion: "2023-10-16", httpClient: Stripe.createFetchHttpClient() });
      const intent = await stripe.paymentIntents.retrieve(String(cleanData.stripe_payment_intent_id));
      if (intent.status !== "succeeded") {
        throw new Error("Pagamento non completato su Stripe");
      }

      // Impedisce che lo stesso payment intent venga riusato su più iscrizioni
      const { data: existingForIntent } = await supabaseAdmin
        .from("albi_trail_registrations")
        .select("id")
        .eq("stripe_payment_intent_id", String(cleanData.stripe_payment_intent_id))
        .maybeSingle();
      if (existingForIntent) {
        throw new Error("Questo pagamento è già stato utilizzato per un'altra iscrizione");
      }
    }

    // Valida codice promo lato server
    if (cleanData.codice_promo) {
        const code = String(cleanData.codice_promo).trim().toUpperCase();
        const { data: promoData, error: promoError } = await supabaseAdmin
            .from("promo_codes")
            .select("code, discount_amount, expires_at")
            .eq("code", code)
            .eq("is_active", true)
            .single();

        if (promoError || !promoData) {
            throw new Error("Codice promo non valido");
        }
        if (promoData.expires_at && new Date(promoData.expires_at) < new Date()) {
            throw new Error("Codice promo scaduto");
        }

        // Sovrascrive il codice con quello validato server-side
        cleanData.codice_promo = promoData.code;
        cleanData.codice_sconto_applicato = promoData.code;
    }

    // 4. Insert into DB
    const { data, error } = await supabaseAdmin
      .from("albi_trail_registrations")
      .insert([cleanData]);

    if (error) {
      console.error("Supabase Error:", error);
      
      // Controllo se l'errore è una violazione del vincolo UNIQUE (es. email duplicata)
      if (error.code === '23505') {
        return new Response(JSON.stringify({ success: false, error: "Email already registered" }), {
          status: 409,
          headers: {
            ...getCorsHeaders(req),
            "Content-Type": "application/json",
          },
        });
      }

      throw new Error("Failed to save registration. Please contact support.");
    }

    // 5. Sync to Google Sheets (optional but recommended to be server-side)
    const sheetsUrl = Deno.env.get("GOOGLE_SHEETS_URL");
    if (sheetsUrl) {
      try {
        await fetch(sheetsUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanData),
        });
      } catch (err) {
        console.warn("Google Sheets sync failed:", err);
      }
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: {
        ...getCorsHeaders(req),
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unexpected error";
    
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 400,
      headers: {
        ...getCorsHeaders(req),
        "Content-Type": "application/json",
      },
    });
  }
});
