-- Corregir políticas RLS para profiles que causan problemas en el login
-- El problema es que algunas políticas requieren leer el perfil para verificar el rol,
-- lo cual crea una dependencia circular

-- Eliminar políticas duplicadas o problemáticas primero
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;
DROP POLICY IF EXISTS "Master admin can view all profiles" ON profiles;

-- Asegurar que la política básica para leer el propio perfil existe y funciona
-- Esta política debe ser la más simple y no debe tener dependencias circulares
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Recrear la política para ver perfiles de la organización
-- Esta política ahora usa una subconsulta que puede acceder al perfil propio
CREATE POLICY "Users can view profiles in their organization"
ON profiles FOR SELECT
TO authenticated
USING (
  -- Primero verificar si puede ver su propio perfil (sin dependencia circular)
  id = auth.uid()
  OR
  -- Luego verificar si puede ver perfiles de su organización
  (
    organization_id IS NOT NULL
    AND organization_id IN (
      SELECT organization_id 
      FROM profiles 
      WHERE id = auth.uid()
    )
  )
);

-- Recrear la política para master admin
-- Esta política también debe poder ejecutarse sin dependencia circular
CREATE POLICY "Master admin can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  -- Verificar si el usuario actual es master_admin
  -- Esto funciona porque primero se evalúa la política "Users can view their own profile"
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.role = 'master_admin'
  )
);
