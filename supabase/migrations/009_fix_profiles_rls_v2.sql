-- Versión mejorada: Usar función security definer para evitar dependencias circulares
-- Las funciones security definer se ejecutan con los privilegios del creador de la función,
-- evitando así las restricciones RLS

-- Crear función helper para verificar si un usuario es master_admin
-- Esta función se ejecuta con privilegios elevados y puede leer perfiles sin RLS
CREATE OR REPLACE FUNCTION is_master_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id
    AND role = 'master_admin'
  );
END;
$$;

-- Crear función helper para obtener organization_id de un usuario
CREATE OR REPLACE FUNCTION get_user_organization_id(user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_id UUID;
BEGIN
  SELECT organization_id INTO org_id
  FROM profiles
  WHERE id = user_id;
  
  RETURN org_id;
END;
$$;

-- Eliminar políticas existentes para recrearlas
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;
DROP POLICY IF EXISTS "Master admin can view all profiles" ON profiles;

-- Política básica: usuarios pueden ver su propio perfil
-- Esta es la más simple y no tiene dependencias
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Política: usuarios pueden ver perfiles de su organización
-- Usa la función helper para evitar dependencia circular
CREATE POLICY "Users can view profiles in their organization"
ON profiles FOR SELECT
TO authenticated
USING (
  -- Puede ver su propio perfil (ya cubierto por la política anterior, pero incluido para claridad)
  id = auth.uid()
  OR
  -- Puede ver perfiles de su organización usando la función helper
  (
    organization_id IS NOT NULL
    AND organization_id = get_user_organization_id(auth.uid())
  )
);

-- Política: master admin puede ver todos los perfiles
-- Usa la función helper para evitar dependencia circular
CREATE POLICY "Master admin can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  -- Usar la función helper que se ejecuta con privilegios elevados
  is_master_admin(auth.uid())
);
