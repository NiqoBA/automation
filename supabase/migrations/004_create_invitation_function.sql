-- Función SECURITY DEFINER para crear invitaciones (bypass RLS)
-- Solo para uso por master admin
CREATE OR REPLACE FUNCTION create_client_invitation(
  p_email TEXT,
  p_invited_by UUID,
  p_token TEXT,
  p_expires_at TIMESTAMP WITH TIME ZONE,
  p_metadata JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invitation_id UUID;
  v_is_master_admin BOOLEAN;
BEGIN
  -- Verificar que el usuario que llama es master_admin
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = p_invited_by
    AND profiles.role = 'master_admin'
  ) INTO v_is_master_admin;

  IF NOT v_is_master_admin THEN
    RAISE EXCEPTION 'Solo master admin puede crear invitaciones de clientes';
  END IF;

  -- Crear la invitación
  INSERT INTO invitations (
    email,
    organization_id,
    invited_by,
    role,
    token,
    status,
    expires_at,
    metadata
  ) VALUES (
    p_email,
    NULL, -- organization_id será NULL para nuevos clientes
    p_invited_by,
    'org_admin',
    p_token,
    'pending',
    p_expires_at,
    p_metadata
  )
  RETURNING id INTO v_invitation_id;

  RETURN v_invitation_id;
END;
$$;

-- Dar permisos para ejecutar la función
GRANT EXECUTE ON FUNCTION create_client_invitation TO authenticated;
