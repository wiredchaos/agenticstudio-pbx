-- Restrict SELECT on early_access to admins
CREATE POLICY "Admins can read early access"
ON public.early_access
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Rate-limit log for early-access OTP requests (written by service role from edge function)
CREATE TABLE public.early_access_otp_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  email_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_early_access_otp_log_lookup
  ON public.early_access_otp_log (email_hash, ip_hash, created_at DESC);

ALTER TABLE public.early_access_otp_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read OTP log"
ON public.early_access_otp_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
