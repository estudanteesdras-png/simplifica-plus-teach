ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tipo_escola text NOT NULL DEFAULT 'Pública',
  ADD COLUMN IF NOT EXISTS turma text NOT NULL DEFAULT '';