-- Limpiar todas las políticas RLS de profiles y recrearlas correctamente
-- Esto resuelve el problema de políticas duplicadas y conflictivas

-- Eliminar TODAS las políticas existentes de profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;
DROP POLICY IF EXISTS "Master admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Master admin view all" ON profiles;
DROP POLICY IF EXISTS "View same organization profiles" ON profiles;

-- Las funciones helper ya existen y están bien configuradas
-- Ahora crear solo las políticas necesarias, en el orden correcto

-- 1. Política básica: usuarios pueden ver su propio perfil
-- Esta debe ser la primera y más simple
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- 2. Política: usuarios pueden ver perfiles de su organización
-- Usa la función helper para evitar dependencia circular
CREATE POLICY "Users can view profiles in their organization"
ON profiles FOR SELECT
TO authenticated
USING (
  -- Ya puede ver su propio perfil por la política anterior
  -- Solo necesita verificar otros perfiles de su organización
  (
    organization_id IS NOT NULL
    AND organization_id = get_user_organization_id(auth.uid())
  )
);

-- 3. Política: master admin puede ver todos los perfiles
-- Usa la función helper para evitar dependencia circular
CREATE POLICY "Master admin can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  is_master_admin(auth.uid())
);
