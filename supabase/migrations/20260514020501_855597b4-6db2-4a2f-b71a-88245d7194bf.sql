ALTER TABLE public.agent_runs ADD COLUMN IF NOT EXISTS department text;
CREATE INDEX IF NOT EXISTS idx_agent_runs_department ON public.agent_runs(department);