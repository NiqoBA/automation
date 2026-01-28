-- Mejorar las funciones para manejar casos NULL y evitar errores
-- También asegurar que las funciones sean más robustas

-- Mejorar función is_master_admin para manejar NULLs
CREATE OR REPLACE FUNCTION is_master_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  -- Si user_id es NULL, retornar false
  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id
    AND role = 'master_admin'
  );
END;
$$;

-- Mejorar función get_user_organization_id para manejar NULLs
CREATE OR REPLACE FUNCTION get_user_organization_id(user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  org_id UUID;
BEGIN
  -- Si user_id es NULL, retornar NULL
  IF user_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  SELECT organization_id INTO org_id
  FROM profiles
  WHERE id = user_id;
  
  RETURN org_id;
END;
$$;

-- Asegurar permisos de ejecución
GRANT EXECUTE ON FUNCTION is_master_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_organization_id(UUID) TO authenticated;

-- Actualizar la política de organización para manejar NULLs mejor
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;

CREATE POLICY "Users can view profiles in their organization"
ON profiles FOR SELECT
TO authenticated
USING (
  -- Solo verificar organización si organization_id no es NULL
  (
    organization_id IS NOT NULL
    AND get_user_organization_id(auth.uid()) IS NOT NULL
    AND organization_id = get_user_organization_id(auth.uid())
  )
);
