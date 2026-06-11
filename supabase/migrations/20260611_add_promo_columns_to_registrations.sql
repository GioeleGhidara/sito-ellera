-- Aggiunta campi mancanti per il codice promozionale nel modulo Albi Trail E-Bike Fest
ALTER TABLE public.albi_trail_registrations
ADD COLUMN IF NOT EXISTS codice_promo TEXT,
ADD COLUMN IF NOT EXISTS codice_sconto_applicato TEXT;

-- Commenti per chiarezza
COMMENT ON COLUMN public.albi_trail_registrations.codice_promo IS 'Codice promozionale inserito in fase di registrazione';
COMMENT ON COLUMN public.albi_trail_registrations.codice_sconto_applicato IS 'Codice promozionale effettivamente validato e applicato lato server';
