
-- ROLES
CREATE TYPE public.app_role AS ENUM ('director', 'admin');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'director',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- DIRECTORS (table only, policies after studios exists)
CREATE TABLE public.directors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  web3_wallet TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.directors ENABLE ROW LEVEL SECURITY;

-- STUDIOS
CREATE TABLE public.studios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  director_id UUID NOT NULL REFERENCES public.directors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  founder_name TEXT NOT NULL,
  archive_size_estimate TEXT,
  style_notes TEXT,
  infrastructure_mode TEXT NOT NULL DEFAULT 'managed',
  is_public BOOLEAN NOT NULL DEFAULT false,
  cover_url TEXT,
  tagline TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.studios ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.owns_studio(_studio_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.studios s
    JOIN public.directors d ON d.id = s.director_id
    WHERE s.id = _studio_id AND d.user_id = auth.uid()
  )
$$;

-- Directors policies (now safe to reference studios)
CREATE POLICY "Directors view own profile" ON public.directors FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Public studios expose director" ON public.directors FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.studios s WHERE s.director_id = directors.id AND s.is_public = true));
CREATE POLICY "Directors insert own profile" ON public.directors FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Directors update own profile" ON public.directors FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Studios policies
CREATE POLICY "Public studios visible to all" ON public.studios FOR SELECT TO anon, authenticated USING (is_public = true);
CREATE POLICY "Owners see their studios" ON public.studios FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.directors d WHERE d.id = director_id AND d.user_id = auth.uid()));
CREATE POLICY "Owners insert studios" ON public.studios FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.directors d WHERE d.id = director_id AND d.user_id = auth.uid()));
CREATE POLICY "Owners update studios" ON public.studios FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.directors d WHERE d.id = director_id AND d.user_id = auth.uid()));
CREATE POLICY "Owners delete studios" ON public.studios FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.directors d WHERE d.id = director_id AND d.user_id = auth.uid()));

-- AGENTS (seeded)
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT NOT NULL,
  default_model TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view agents" ON public.agents FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.agents (slug, name, role, description, default_model, display_order) VALUES
  ('nexus','NEXUS','Orchestrator','Coordinates the studio. Routes work across the four specialists and surfaces decisions for the director.','hermes-4-405b',1),
  ('praxis','PRAXIS','Director''s Twin','Shot lists and previz conditioned on the director''s DNA. Hermes 4 405B with retrieval over the archive, Runway Gen-4 + Act-Two for video.','hermes-4-405b',2),
  ('scribe','SCRIBE','Writer + Line Producer','Breaks scripts into scenes, cast, locations, props, budgets, and insurance estimates.','hermes-4-70b',3),
  ('architect','ARCHITECT','World Builder','Plate references and real location suggestions. Runway plate generation.','hermes-4-70b',4),
  ('egos','EGOS','Designer','Wardrobe and character sheets. Pinterest-style moodboards.','hermes-4-70b',5);

-- PROJECTS
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  studio_id UUID NOT NULL REFERENCES public.studios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  logline TEXT,
  status TEXT NOT NULL DEFAULT 'development',
  cover_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage projects" ON public.projects FOR ALL TO authenticated
  USING (public.owns_studio(studio_id)) WITH CHECK (public.owns_studio(studio_id));
CREATE POLICY "Public studios show projects" ON public.projects FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.studios s WHERE s.id = studio_id AND s.is_public = true));

-- AGENT RUNS
CREATE TABLE public.agent_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  studio_id UUID NOT NULL REFERENCES public.studios(id) ON DELETE CASCADE,
  agent_slug TEXT NOT NULL REFERENCES public.agents(slug),
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  input JSONB NOT NULL DEFAULT '{}'::jsonb,
  output JSONB NOT NULL DEFAULT '{}'::jsonb,
  thinking_log TEXT,
  awaiting_approval BOOLEAN NOT NULL DEFAULT false,
  hours_saved NUMERIC NOT NULL DEFAULT 0,
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage runs" ON public.agent_runs FOR ALL TO authenticated
  USING (public.owns_studio(studio_id)) WITH CHECK (public.owns_studio(studio_id));
ALTER TABLE public.agent_runs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_runs;

-- ASSETS
CREATE TABLE public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  studio_id UUID NOT NULL REFERENCES public.studios(id) ON DELETE CASCADE,
  run_id UUID REFERENCES public.agent_runs(id) ON DELETE SET NULL,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  caption TEXT,
  preview_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  approval_state TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage assets" ON public.assets FOR ALL TO authenticated
  USING (public.owns_studio(studio_id)) WITH CHECK (public.owns_studio(studio_id));
ALTER TABLE public.assets REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.assets;

-- ARCHIVE
CREATE TABLE public.archive_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  studio_id UUID NOT NULL REFERENCES public.studios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  source TEXT,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  frames_extracted INT NOT NULL DEFAULT 0,
  dialogue_transcribed BOOLEAN NOT NULL DEFAULT false,
  vision_tagged BOOLEAN NOT NULL DEFAULT false,
  embeddings_generated BOOLEAN NOT NULL DEFAULT false,
  ingestion_progress INT NOT NULL DEFAULT 0,
  cover_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.archive_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage archive" ON public.archive_items FOR ALL TO authenticated
  USING (public.owns_studio(studio_id)) WITH CHECK (public.owns_studio(studio_id));

-- DNA
CREATE TABLE public.director_dna (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  studio_id UUID NOT NULL REFERENCES public.studios(id) ON DELETE CASCADE,
  version INT NOT NULL DEFAULT 1,
  is_public BOOLEAN NOT NULL DEFAULT false,
  is_current BOOLEAN NOT NULL DEFAULT true,
  lens_preferences TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  color_palette TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  pacing TEXT,
  lighting TEXT,
  blocking TEXT,
  motifs TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.director_dna ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage DNA" ON public.director_dna FOR ALL TO authenticated
  USING (public.owns_studio(studio_id)) WITH CHECK (public.owns_studio(studio_id));
CREATE POLICY "Public DNA visible" ON public.director_dna FOR SELECT TO anon, authenticated
  USING (is_public = true AND EXISTS (SELECT 1 FROM public.studios s WHERE s.id = studio_id AND s.is_public = true));
ALTER TABLE public.director_dna REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.director_dna;

-- RUNWAY
CREATE TABLE public.runway_calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  studio_id UUID NOT NULL REFERENCES public.studios(id) ON DELETE CASCADE,
  run_id UUID REFERENCES public.agent_runs(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  credits_used NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.runway_calls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage runway" ON public.runway_calls FOR ALL TO authenticated
  USING (public.owns_studio(studio_id)) WITH CHECK (public.owns_studio(studio_id));

-- DISTRIBUTION
CREATE TABLE public.distribution_handoffs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  studio_id UUID NOT NULL REFERENCES public.studios(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES public.assets(id) ON DELETE SET NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  destination TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.distribution_handoffs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage distribution" ON public.distribution_handoffs FOR ALL TO authenticated
  USING (public.owns_studio(studio_id)) WITH CHECK (public.owns_studio(studio_id));

-- MODEL ROUTES
CREATE TABLE public.model_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  studio_id UUID NOT NULL REFERENCES public.studios(id) ON DELETE CASCADE,
  agent_slug TEXT NOT NULL REFERENCES public.agents(slug),
  model TEXT NOT NULL,
  fallback_model TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (studio_id, agent_slug)
);
ALTER TABLE public.model_routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage routes" ON public.model_routes FOR ALL TO authenticated
  USING (public.owns_studio(studio_id)) WITH CHECK (public.owns_studio(studio_id));

-- TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.directors (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'director') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER touch_directors BEFORE UPDATE ON public.directors FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_studios BEFORE UPDATE ON public.studios FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_projects BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
