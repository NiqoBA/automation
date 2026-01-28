-- Restringir creación de proyectos solo a master admin
-- Eliminar la política que permite a org_admin crear proyectos

DROP POLICY IF EXISTS "Org admins can create projects" ON projects;

-- Solo master admin puede crear proyectos
CREATE POLICY "Only master admin can create projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'master_admin'
  )
);
