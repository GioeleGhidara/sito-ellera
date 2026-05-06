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
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

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
      "pagamento", "chk_regolamento", "chk_responsabilita", "chk_privacy",
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

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    // 4. Insert into DB
    const { data, error } = await supabaseAdmin
      .from("albi_trail_registrations")
      .insert([cleanData]);

    if (error) {
      console.error("Supabase Error:", error);
      throw new Error("Failed to save registration. Please contact support.");
    }

    // 5. Sync to Google Sheets (optional but recommended to be server-side)
    const sheetsUrl = Deno.env.get("GOOGLE_SHEETS_URL");
    if (sheetsUrl) {
      try {
        await fetch(sheetsUrl, {
          method: "POST",
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
