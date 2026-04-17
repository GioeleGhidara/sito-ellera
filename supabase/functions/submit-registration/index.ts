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

    if (!token) {
      throw new Error("Missing Turnstile token");
    }
    if (!registrationData) {
      throw new Error("Missing registration data");
    }

    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY") || "1x0000000000000000000000000000000AA";
    
    // Verify Turnstile Token
    const verifyFormData = new FormData();
    verifyFormData.append("secret", turnstileSecret);
    verifyFormData.append("response", token);

    const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: verifyFormData,
    });

    const turnstileData = await turnstileRes.json();
    
    if (!turnstileData.success) {
      console.error("Turnstile verification failed:", turnstileData);
      throw new Error("CAPTCHA verification failed");
    }

    // Initialize Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Server configuration error (missing Supabase keys)");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Insert into DB
    const { data, error } = await supabaseAdmin
      .from("albi_trail_registrations")
      .insert([registrationData]);

    if (error) {
      throw new Error("Database insert failed: " + error.message);
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: {
        ...getCorsHeaders(req),
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 400,
      headers: {
        ...getCorsHeaders(req),
        "Content-Type": "application/json",
      },
    });
  }
});
