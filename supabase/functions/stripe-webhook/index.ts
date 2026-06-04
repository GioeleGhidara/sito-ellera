import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "npm:stripe@^13.0.0";
import { createClient } from "npm:@supabase/supabase-js@^2.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") as string,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
);

serve(async (req) => {
  // 1. Estrai la firma di sicurezza dalla richiesta
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Firma mancante", { status: 400 });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") as string;
    
    // 2. Verifica che la chiamata provenga realmente da Stripe
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // 3. Gestisci solo l'evento di checkout completato con successo
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Recupera l'email del cliente e l'ID della transazione
      const email = session.customer_details?.email;
      const paymentIntentId = session.payment_intent;

      if (email) {
        // 4. Aggiorna lo stato nel DB
        const { error } = await supabaseAdmin
          .from("albi_trail_registrations")
          .update({ 
            pagamento: "pagato", 
            stripe_payment_intent_id: paymentIntentId 
          })
          .eq("email", email)
          .eq("pagamento", "stripe_pending"); // Sicurezza extra: aggiorna solo se era in attesa

        if (error) {
          console.error("Errore aggiornamento DB:", error);
          return new Response("Errore aggiornamento DB", { status: 500 });
        }

        const sheetsUrl = Deno.env.get("GOOGLE_SHEETS_URL");
        if (sheetsUrl) {
            try {
                const { data: registration } = await supabaseAdmin
                    .from("albi_trail_registrations")
                    .select("*")
                    .eq("email", email)
                    .single();

                if (registration) {
                    await fetch(sheetsUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(registration),
                    });
                }
            } catch (err) {
                console.warn("Google Sheets sync failed:", err);
            }
        }
      }
    }

    // Rispondi a Stripe che abbiamo ricevuto il messaggio (fondamentale, altrimenti Stripe riprova all'infinito)
    return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Errore sconosciuto";
    console.error("Webhook Error:", errorMessage);
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
  }
});
