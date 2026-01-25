-- Tabla para envíos del formulario de contacto (landing)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL DEFAULT 'automations',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Solo master_admin puede ver los envíos
CREATE POLICY "Master admin can view contact submissions"
ON contact_submissions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'master_admin'
  )
);

-- Inserciones se hacen vía service role (server action) para formulario público
