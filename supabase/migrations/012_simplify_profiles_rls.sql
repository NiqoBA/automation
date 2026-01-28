-- Simplificar las políticas RLS para evitar problemas con funciones SECURITY DEFINER
-- Usar solo la política básica que siempre funciona

-- Eliminar todas las políticas SELECT existentes
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;
DROP POLICY IF EXISTS "Master admin can view all profiles" ON profiles;

-- Crear solo la política básica que permite a los usuarios ver su propio perfil
-- Esta política es simple y no tiene dependencias circulares
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Crear política para ver perfiles de la organización usando subconsulta directa
-- Esta política funciona porque primero se evalúa la política básica que permite
-- leer el propio perfil, y luego se puede usar esa información
CREATE POLICY "Users can view profiles in their organization"
ON profiles FOR SELECT
TO authenticated
USING (
  -- Si el perfil tiene organization_id, verificar si coincide con el del usuario actual
  (
    organization_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.organization_id = profiles.organization_id
    )
  )
);

-- Política para master admin usando subconsulta directa
-- Esta funciona porque la política básica permite leer el propio perfil primero
CREATE POLICY "Master admin can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.role = 'master_admin'
  )
);
