-- Public bucket for per-studio hero media (videos, posters, logos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('studio-media', 'studio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can read (public bucket, but explicit policy for clarity)
CREATE POLICY "Studio media public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'studio-media');

-- Authenticated studio owners can upload to their own folder: studio-media/<studio_id>/...
CREATE POLICY "Studio owners upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'studio-media'
  AND public.owns_studio(((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "Studio owners update media"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'studio-media'
  AND public.owns_studio(((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "Studio owners delete media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'studio-media'
  AND public.owns_studio(((storage.foldername(name))[1])::uuid)
);