'use server'

import { createClient } from '@/lib/supabase/server'

export async function getOrganizations() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'No autenticado' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return { error: 'Perfil no encontrado' }
  }

  // Only master admin can see all organizations
  if (profile.role !== 'master_admin') {
    return { error: 'No tienes permisos para ver todas las organizaciones' }
  }

  const { data: organizations, error } = await supabase
    .from('organizations')
    .select(`
      *,
      profiles (id, email, full_name, role)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { organizations }
}

export async function getOrganizationMembers(organizationId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'No autenticado' }
  }

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('organization_id, role')
    .eq('id', user.id)
    .single()

  if (!currentProfile) {
    return { error: 'Perfil no encontrado' }
  }

  // Check access
  if (currentProfile.role !== 'master_admin' && currentProfile.organization_id !== organizationId) {
    return { error: 'No tienes acceso a esta organización' }
  }

  const { data: members, error } = await supabase
    .from('organization_members')
    .select(`
      *,
      profiles (*)
    `)
    .eq('organization_id', organizationId)

  if (error) {
    return { error: error.message }
  }

  return { members }
}
