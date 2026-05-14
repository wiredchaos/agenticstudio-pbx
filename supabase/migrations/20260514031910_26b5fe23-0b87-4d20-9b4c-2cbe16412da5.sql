ALTER TABLE public.studios
  ADD COLUMN IF NOT EXISTS brand_theme jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'basic',
  ADD COLUMN IF NOT EXISTS funnel jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.studios
  ADD CONSTRAINT studios_tier_check CHECK (tier IN ('basic','premium'));