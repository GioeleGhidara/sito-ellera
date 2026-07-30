import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

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

let stripe: Stripe | null = null;
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

Deno.serve(async (req: Request) => {
  // Gestione preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) })
  }

  // Handle non-POST methods
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
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || Deno.env.get("STRIPE_TEST_KEY")
    if (!stripeSecretKey) {
        throw new Error("STRIPE_SECRET_KEY mancante sul server Supabase")
    }

    stripe ??= new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    })

    const { email, nome_cognome, pacchetto, amount, codice_promo, return_url } = await req.json()

    const PREZZI: Record<string, number> = {
      "Ride + Pranzo (€ 20)": 20,
      "Solo Ride (€ 12)": 12,
      "Solo Pranzo (€ 12)": 12,
    };
    const baseAmount = PREZZI[pacchetto];
    if (!baseAmount) {
      throw new Error("Pacchetto non valido")
    }

    // Ricalcola lo sconto lato server: il client non è mai la fonte di verità sul prezzo finale
    let discount = 0;
    if (codice_promo) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error("Database configuration error");
      }
      supabaseAdmin ??= createClient(supabaseUrl, supabaseServiceRoleKey);

      const { data: promoData, error: promoError } = await supabaseAdmin
        .from("promo_codes")
        .select("code, discount_amount, expires_at")
        .eq("code", String(codice_promo).trim().toUpperCase())
        .eq("is_active", true)
        .maybeSingle();

      if (promoError || !promoData) {
        throw new Error("Codice promo non valido")
      }
      if (promoData.expires_at && new Date(promoData.expires_at as string) < new Date()) {
        throw new Error("Codice promo scaduto")
      }
      discount = Number(promoData.discount_amount) || 0;
    }

    const expectedAmount = Math.max(0, baseAmount - discount);
    if (amount !== expectedAmount) {
      throw new Error("Importo non corrispondente al pacchetto")
    }

    const allowedReturnDomains = ["https://ellera.it", "https://www.ellera.it", "http://localhost:5173", "http://localhost:8080"];
    if (!allowedReturnDomains.some(d => return_url?.startsWith(d))) {
      throw new Error("return_url non valido");
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: normalizedEmail,
      client_reference_id: normalizedEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Iscrizione Albi Trail - ${pacchetto}`,
              description: `Iscrizione per ${nome_cognome}`,
            },
            unit_amount: expectedAmount * 100, // Stripe richiede centesimi; usa l'importo calcolato server-side
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${return_url}?success=stripe`,
      cancel_url: `${return_url}?canceled=stripe`,
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      status: 400,
    })
  }
})
