-- Aggiunta campi mancanti per il modulo Albi Trail E-Bike Fest
ALTER TABLE public.albi_trail_registrations
ADD COLUMN IF NOT EXISTS menu TEXT,
ADD COLUMN IF NOT EXISTS pagamento TEXT,
ADD COLUMN IF NOT EXISTS paypal_order_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Commenti per chiarezza
COMMENT ON COLUMN public.albi_trail_registrations.menu IS 'Scelta del menu (es. salsiccia/wurstel e Birra)';
COMMENT ON COLUMN public.albi_trail_registrations.pagamento IS 'Metodo di pagamento scelto (paypal, stripe, sul_posto)';
COMMENT ON COLUMN public.albi_trail_registrations.paypal_order_id IS 'ID transazione PayPal';
COMMENT ON COLUMN public.albi_trail_registrations.stripe_payment_intent_id IS 'ID transazione Stripe';
