-- Permitir que el email específico niqodt@gmail.com también pueda crear proyectos
-- Actualizar la política para incluir verificación de email

DROP POLICY IF EXISTS "Only master admin can create projects" ON projects;

-- Crear función helper para verificar si puede crear proyectos
CREATE OR REPLACE FUNCTION can_create_projects(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  user_role TEXT;
  user_email TEXT;
BEGIN
  -- Obtener rol y email del usuario
  SELECT p.role, p.email INTO user_role, user_email
  FROM profiles p
  WHERE p.id = user_id;
  
  -- Permitir si es master_admin o email específico
  RETURN user_role = 'master_admin' OR user_email = 'niqodt@gmail.com';
END;
$$;

-- Política que permite crear proyectos solo a master admin o email específico
CREATE POLICY "Only master admin or specific email can create projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
  can_create_projects(auth.uid())
);

-- Otorgar permisos de ejecución
GRANT EXECUTE ON FUNCTION can_create_projects(UUID) TO authenticated;
