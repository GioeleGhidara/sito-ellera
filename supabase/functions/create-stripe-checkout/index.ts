import Stripe from "stripe"

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

    const { email, nome_cognome, pacchetto, amount, return_url } = await req.json()

    const PREZZI: Record<string, number> = {
      "Ride + Pranzo (€ 20)": 20,
      "Solo Ride (€ 12)": 12,
      "Solo Pranzo (€ 12)": 12,
    };
    const expectedAmount = PREZZI[pacchetto];
    
    if (!expectedAmount || amount !== expectedAmount) {
      throw new Error("Importo non corrispondente al pacchetto")
    }

    const allowedReturnDomains = ["https://ellera.it", "https://www.ellera.it", "http://localhost:5173", "http://localhost:8080"];
    if (!allowedReturnDomains.some(d => return_url?.startsWith(d))) {
      throw new Error("return_url non valido");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Iscrizione Albi Trail - ${pacchetto}`,
              description: `Iscrizione per ${nome_cognome}`,
            },
            unit_amount: amount * 100, // Stripe richiede centesimi
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
