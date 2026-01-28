-- Permitir que master admin cree proyectos para cualquier organización
-- Esta política complementa la existente "Org admins can create projects"
-- que requiere que el organization_id coincida con el del usuario

CREATE POLICY "Master admin can create projects for any organization"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'master_admin'
  )
);

-- También permitir que master admin actualice proyectos de cualquier organización
DROP POLICY IF EXISTS "Org admins can update organization projects" ON projects;

CREATE POLICY "Org admins can update organization projects"
ON projects FOR UPDATE
TO authenticated
USING (
  -- Master admin puede actualizar cualquier proyecto
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'master_admin'
  )
  OR
  -- Org admins pueden actualizar proyectos de su organización
  (
    organization_id IN (
      SELECT organization_id 
      FROM profiles 
      WHERE id = auth.uid()
      AND role = 'org_admin'
    )
  )
);

-- También permitir que master admin elimine proyectos de cualquier organización
DROP POLICY IF EXISTS "Org admins can delete organization projects" ON projects;

CREATE POLICY "Org admins can delete organization projects"
ON projects FOR DELETE
TO authenticated
USING (
  -- Master admin puede eliminar cualquier proyecto
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'master_admin'
  )
  OR
  -- Org admins pueden eliminar proyectos de su organización
  (
    organization_id IN (
      SELECT organization_id 
      FROM profiles 
      WHERE id = auth.uid()
      AND role = 'org_admin'
    )
  )
);
