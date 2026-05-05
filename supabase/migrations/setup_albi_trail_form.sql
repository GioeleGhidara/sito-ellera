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

-- 3. Create the policy to allow ANYONE to insert rows
-- (this is necessary since the form is public and users are not authenticated)
CREATE POLICY "Allow public insert"
ON public.albi_trail_registrations
FOR INSERT
TO public
WITH CHECK (true);

-- 4. Create the policy to allow ONLY authenticated admins to select/read rows
-- (adjust this to your needs if you have a specific admin role, 
-- but 'authenticated' prevents public scraping)
CREATE POLICY "Allow admins to read"
ON public.albi_trail_registrations
FOR SELECT
TO authenticated
USING (true);
