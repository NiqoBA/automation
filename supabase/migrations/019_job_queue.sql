-- Job Queue para ejecución desacoplada de tareas pesadas
-- Ver docs/arquitectura-inflexo.md

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  result JSONB,
  error_message TEXT,
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_project ON jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at);

-- RLS: usuarios ven jobs de sus proyectos
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view jobs of their projects"
ON jobs FOR SELECT
TO authenticated
USING (
  project_id IN (
    SELECT p.id FROM projects p
    JOIN profiles pr ON (pr.organization_id = p.organization_id OR pr.role = 'master_admin')
    WHERE pr.id = auth.uid()
  )
  OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master_admin')
);

-- Solo el sistema (service role) inserta/actualiza jobs
-- Las políticas de INSERT/UPDATE se hacen con service role (bypass RLS)
-- Para que la app enqueue, necesitamos política de INSERT para usuarios autenticados
-- que tengan acceso al proyecto

CREATE POLICY "Users can enqueue jobs for their projects"
ON jobs FOR INSERT
TO authenticated
WITH CHECK (
  project_id IS NOT NULL
  AND
  (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master_admin')
    OR
    project_id IN (
      SELECT p.id FROM projects p
      JOIN profiles pr ON pr.organization_id = p.organization_id AND pr.id = auth.uid()
    )
  )
);

COMMENT ON TABLE jobs IS 'Cola de jobs para tareas pesadas (consolidación, ETL, etc.). Procesados por workers externos.';
