-- Subscribers table for the Mindloop newsletter hero form
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'hero',
  confirmed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (public newsletter signup)
CREATE POLICY "Anyone can subscribe"
ON public.subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read the list
CREATE POLICY "Admins can read subscribers"
ON public.subscribers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_subscribers_created_at ON public.subscribers (created_at DESC);