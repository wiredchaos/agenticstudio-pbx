DROP POLICY "Anyone can subscribe" ON public.subscribers;

CREATE POLICY "Anyone can subscribe with valid email"
ON public.subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(email) BETWEEN 5 AND 320
  AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  AND source IN ('hero', 'footer', 'cta')
  AND confirmed = false
);