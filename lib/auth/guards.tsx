import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/lib/types/database'

export async function requireAuth() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return user
}

export async function requireProfile() {
  const supabase = createClient()
  
  // Obtener usuario con sesión refrescada
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/auth/login')
  }

  // Intentar obtener perfil
  // Usar maybeSingle() para evitar error 404 si no existe
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  // Si hay error de RLS (PGRST116 es "no rows returned", otros son errores de permisos)
  if (profileError) {
    // Si es un error de "no rows", el perfil no existe
    if (profileError.code === 'PGRST116') {
      await supabase.auth.signOut()
      redirect('/auth/login?error=no-profile')
    }
    
    // Para otros errores (probablemente RLS), intentar una vez más después de un breve delay
    // Esto puede ayudar si hay un problema de timing con las cookies
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const { data: retryProfile, error: retryError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
    
    if (retryError || !retryProfile) {
      await supabase.auth.signOut()
      redirect('/auth/login?error=no-profile')
    }
    
    return { user, profile: retryProfile }
  }

  if (!profile) {
    // Si no tiene perfil, cerrar sesión y redirigir
    await supabase.auth.signOut()
    redirect('/auth/login?error=no-profile')
  }

  return { user, profile }
}

export async function requireRole(allowedRoles: UserRole[]) {
  const profileResult = await requireProfile()
  
  if (!profileResult || !profileResult.profile) {
    redirect('/auth/login')
  }
  
  const { profile } = profileResult

  if (!allowedRoles.includes(profile.role)) {
    // Redirigir según rol - evitar bucles
    // Si es master admin intentando acceder a ruta de org, ir a admin
    // Si es org user intentando acceder a ruta de admin, ir a org
    if (profile.role === 'master_admin') {
      redirect('/dashboard/admin')
    } else if (profile.role === 'org_admin' || profile.role === 'org_member') {
      redirect('/dashboard/org')
    } else {
      redirect('/auth/login')
    }
  }

  return { user: profile }
}

export async function requireMasterAdmin() {
  return requireRole(['master_admin'])
}

export async function requireOrgAccess(organizationId: string) {
  const { profile } = await requireProfile()

  // Master admin can access any organization
  if (profile.role === 'master_admin') {
    return { user: profile }
  }

  // Check if user belongs to the organization
  if (profile.organization_id !== organizationId) {
    // Redirigir según rol
    if (profile.role === 'master_admin') {
      redirect('/dashboard/admin')
    } else {
      redirect('/dashboard/org')
    }
  }

  return { user: profile }
}
