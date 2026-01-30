'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function registerWithInvitation(
  email: string,
  password: string,
  fullName: string,
  phone: string | undefined,
  companyName: string,
  employeeCount: string,
  rut: string,
  country: string
) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  // 1. Intentar obtener el usuario de la sesión actual
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  // Usamos el email proporcionado o el de la sesión
  const finalEmail = currentUser?.email || email

  if (!finalEmail) {
    return { error: 'No se pudo determinar el email para el registro.' }
  }

  // Verificar si el usuario ya tiene perfil (ya completó el registro)
  // Intentamos obtener el ID del usuario actual o buscamos por email
  let userId = currentUser?.id

  if (!userId) {
    const { data: { users }, error: listError } = await adminSupabase.auth.admin.listUsers()
    if (!listError) {
      userId = users.find(u => u.email === finalEmail)?.id
    }
  }

  if (userId) {
    const { data: existingProfile } = await adminSupabase
      .from('profiles')
      .select('id, role, organization_id')
      .eq('id', userId)
      .maybeSingle()

    if (existingProfile) {
      if (existingProfile.role === 'master_admin') redirect('/dashboard/admin')
      if (existingProfile.organization_id) redirect('/dashboard/org')
      redirect('/auth/login')
    }
  }

  // Si no tenemos userId, significa que el usuario de Auth aún no se creó o el link falló
  // Lo creamos manualmente usando el admin client
  if (!userId) {
    const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
      email: finalEmail,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: fullName, company_name: companyName }
    })

    if (createError) return { error: createError.message }
    userId = newUser.user.id
  } else {
    // Si ya existe pero no tiene perfil, aseguramos la contraseña y metadata
    await adminSupabase.auth.admin.updateUserById(userId, {
      password: password,
      user_metadata: { full_name: fullName }
    })
  }

  // Obtener metadata de la invitación (company_name, etc.)
  const userMetadata = currentUser?.user_metadata || {}
  const finalCompanyName = userMetadata.company_name || companyName

  // Buscar si ya existe una organización para este email (creada durante la invitación)
  const { data: existingOrg } = await adminSupabase
    .from('organizations')
    .select('*')
    .eq('account_email', finalEmail)
    .maybeSingle()

  let finalOrgId: string;

  if (existingOrg) {
    // Si existe, la actualizamos y usamos su ID
    const { data: updatedOrg, error: updateOrgError } = await adminSupabase
      .from('organizations')
      .update({
        name: finalCompanyName,
        rut,
        country,
        employee_count: employeeCount,
        status: 'active', // <--- Transición a Activo
      })
      .eq('id', existingOrg.id)
      .select()
      .single()

    if (updateOrgError) {
      console.error('Error al actualizar organización existente:', updateOrgError)
      return { error: 'Error al actualizar la organización' }
    }
    finalOrgId = updatedOrg.id
  } else {
    // Si NO existe (caso raro/antiguo), creamos una nueva directamente activa
    const { data: newOrg, error: orgError } = await adminSupabase
      .from('organizations')
      .insert({
        name: finalCompanyName,
        rut,
        country,
        employee_count: employeeCount,
        status: 'active',
        account_email: finalEmail,
      })
      .select()
      .single()

    if (orgError || !newOrg) {
      console.error('Error al crear organización nueva:', orgError)
      return { error: orgError?.message || 'Error al crear la organización' }
    }
    finalOrgId = newOrg.id
  }

  // Create profile usando cliente admin para evitar RLS
  const { error: profileError } = await adminSupabase
    .from('profiles')
    .insert({
      id: userId,
      organization_id: finalOrgId,
      email: finalEmail,
      full_name: fullName,
      phone: phone || null,
      role: 'org_admin',
    })

  if (profileError) {
    console.error('Error al crear perfil:', profileError)
    // Si el error es que el perfil ya existe, verificar y redirigir
    if (profileError.code === '23505' || profileError.message?.includes('duplicate')) {
      revalidatePath('/', 'layout')
      const { data: existingProfile } = await adminSupabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (existingProfile?.role === 'master_admin') {
        redirect('/dashboard/admin')
      } else {
        redirect('/dashboard/org')
      }
      return
    }
    return { error: profileError.message }
  }

  // Add to organization_members usando cliente admin
  const { error: memberError } = await adminSupabase
    .from('organization_members')
    .insert({
      organization_id: finalOrgId,
      user_id: userId,
      role: 'admin',
    })

  if (memberError) {
    console.error('Error al agregar a organization_members:', memberError)
    // No fallar si ya existe
    if (memberError.code !== '23505') {
      console.warn('Error al agregar miembro, pero continuando:', memberError)
    }
  }

  // Obtener el perfil creado para verificar el rol y organization_id
  const { data: createdProfile } = await supabase
    .from('profiles')
    .select('role, organization_id')
    .eq('id', userId)
    .single()

  revalidatePath('/', 'layout')

  // Redirigir al dashboard según el rol
  if (createdProfile?.role === 'master_admin') {
    redirect('/dashboard/admin')
  } else if (createdProfile?.organization_id) {
    redirect('/dashboard/org')
  } else {
    redirect('/auth/login')
  }
}
