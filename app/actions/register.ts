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

  // Verificar que el usuario existe y está invitado
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    // Si el error es de link expirado, dar mensaje más específico
    if (userError?.message?.includes('expired') || userError?.message?.includes('invalid')) {
      return { error: 'El link de invitación ha expirado. Por favor, solicita una nueva invitación al administrador.' }
    }
    return { error: 'No se encontró una invitación válida. Asegúrate de hacer clic en el link del email de invitación.' }
  }

  // Usar SIEMPRE el email del usuario invitado (el único válido)
  const finalEmail = user.email
  
  if (!finalEmail) {
    return { error: 'No se encontró el email del usuario invitado' }
  }

  // Verificar si el usuario ya tiene perfil (ya completó el registro)
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (existingProfile) {
    // Si ya tiene perfil, redirigir al dashboard según su rol
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, organization_id')
      .eq('id', user.id)
      .single()
    
    revalidatePath('/', 'layout')
    if (profile?.role === 'master_admin') {
      redirect('/dashboard/admin')
    } else if (profile?.organization_id) {
      redirect('/dashboard/org')
    } else {
      redirect('/auth/login')
    }
    return // Esto nunca se ejecutará por el redirect, pero TypeScript lo necesita
  }

  // Actualizar la contraseña del usuario y metadata
  // Nota: Si el email ya está confirmado (por el link), esto solo actualiza la contraseña
  const { error: updateError } = await supabase.auth.updateUser({
    password,
    data: {
      full_name: fullName,
    },
  })

  if (updateError) {
    // Si el error es que la contraseña es la misma o similar, continuar de todas formas
    if (updateError.message?.includes('same') || updateError.message?.includes('similar')) {
      // Continuar con el registro
    } else {
      return { error: updateError.message || 'Error al establecer la contraseña' }
    }
  }

  // Obtener metadata de la invitación (company_name, etc.)
  const userMetadata = user.user_metadata || {}
  const finalCompanyName = userMetadata.company_name || companyName

  // Buscar invitación en nuestra tabla para obtener información
  const { data: invitation } = await adminSupabase
    .from('invitations')
    .select('*')
    .eq('email', finalEmail)
    .eq('status', 'pending')
    .maybeSingle()

  // Crear organización (siempre nueva para invitaciones de master admin)
  // Usar cliente admin para evitar problemas de RLS
  const { data: newOrg, error: orgError } = await adminSupabase
    .from('organizations')
    .insert({
      name: finalCompanyName,
      rut,
      country,
      employee_count: employeeCount,
    })
    .select()
    .single()

  if (orgError || !newOrg) {
    console.error('Error al crear organización:', orgError)
    return { error: orgError?.message || 'Error al crear organización' }
  }

  // Create profile usando cliente admin para evitar RLS
  const { error: profileError } = await adminSupabase
    .from('profiles')
    .insert({
      id: user.id,
      organization_id: newOrg.id,
      email: finalEmail,
      full_name: fullName,
      phone: phone || null,
      role: 'org_admin', // Los invitados por master admin son org_admin
    })

  if (profileError) {
    console.error('Error al crear perfil:', profileError)
    // Si el error es que el perfil ya existe, verificar y redirigir
    if (profileError.code === '23505' || profileError.message?.includes('duplicate')) {
      revalidatePath('/', 'layout')
      const { data: existingProfile } = await adminSupabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
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
      organization_id: newOrg.id,
      user_id: user.id,
      role: 'admin',
    })

  if (memberError) {
    console.error('Error al agregar a organization_members:', memberError)
    // No fallar si ya existe
    if (memberError.code !== '23505') {
      console.warn('Error al agregar miembro, pero continuando:', memberError)
    }
  }

  // Update invitation status si existe en nuestra tabla
  if (invitation) {
    await adminSupabase
      .from('invitations')
      .update({ status: 'accepted' })
      .eq('id', invitation.id)
  }

  // Obtener el perfil creado para verificar el rol y organization_id
  const { data: createdProfile } = await supabase
    .from('profiles')
    .select('role, organization_id')
    .eq('id', user.id)
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
