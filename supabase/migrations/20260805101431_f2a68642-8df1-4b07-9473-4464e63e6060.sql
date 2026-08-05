DROP POLICY IF EXISTS "Studio media public read" ON storage.objects;

CREATE POLICY "Studio owners list media"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'studio-media' AND public.owns_studio(((storage.foldername(name))[1])::uuid));