-- Solución mínima: solo la política básica para verificar que funciona
-- Si esto funciona, podemos agregar las otras políticas después

-- Eliminar TODAS las políticas SELECT existentes
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;
DROP POLICY IF EXISTS "Master admin can view all profiles" ON profiles;

-- Crear SOLO la política básica que permite a los usuarios ver su propio perfil
-- Esta es la única política necesaria para que el login funcione
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Por ahora, no crear las otras políticas para evitar cualquier problema
-- Podemos agregarlas después de verificar que el login funciona
