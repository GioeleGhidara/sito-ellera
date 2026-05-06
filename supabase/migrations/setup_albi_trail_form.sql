-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.albi_trail_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nome_cognome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    pacchetto TEXT NOT NULL,
    note TEXT
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.albi_trail_registrations ENABLE ROW LEVEL SECURITY;

-- 3. Inserimenti permessi SOLO tramite Edge Function (service_role)
-- Rimuoviamo la policy pubblica per evitare che chiunque possa scrivere nel DB 
-- bypassando i controlli di sicurezza (Turnstile).
-- Nota: La Edge Function usa la service_role key, quindi ignora le policy RLS.
-- 4. Lettura permessa SOLO ad amministratori autenticati
CREATE POLICY "Allow admins to read"
ON public.albi_trail_registrations
FOR SELECT
TO authenticated
USING (true);
