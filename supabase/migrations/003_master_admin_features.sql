-- Agregar columna metadata a invitations para almacenar información adicional
ALTER TABLE invitations 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Agregar columna status a organizations
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'));

-- Crear índice para búsquedas en metadata
CREATE INDEX IF NOT EXISTS idx_invitations_metadata ON invitations USING GIN (metadata);

-- Crear índice para status en organizations
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);

-- Actualizar RLS para permitir que master admin cree invitaciones sin organization_id
-- (para invitaciones de nuevos clientes)
DROP POLICY IF EXISTS "Admins can create invitations" ON invitations;

CREATE POLICY "Admins can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (
    -- Master admin puede crear invitaciones sin organization_id (nuevos clientes)
    (
      organization_id IS NULL
      AND EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'master_admin'
      )
    )
    OR
    -- Org admins pueden crear invitaciones para su organización
    (
      organization_id IN (
        SELECT organization_id FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('master_admin', 'org_admin')
      )
    )
  );
