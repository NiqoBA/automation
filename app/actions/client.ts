'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireProfile } from '@/lib/auth/guards'
import { z } from 'zod'

interface ClientStats {
  totalUsers: number
  totalProjects: number
  projectsThisMonth: number
  completedProjects: number
}

const createProjectSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(['active', 'paused', 'completed', 'cancelled']).optional(),
})

/**
 * Obtener estadísticas del dashboard cliente
 */
export async function getClientStats(): Promise<ClientStats> {
  const { profile } = await requireProfile()
  const supabase = createClient()

  if (!profile.organization_id) {
    return {
      totalUsers: 0,
      totalProjects: 0,
      projectsThisMonth: 0,
      completedProjects: 0,
    }
  }

  // Total de usuarios en la organización
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', profile.organization_id)

  // Total de proyectos
  const { count: totalProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', profile.organization_id)

  // Proyectos creados este mes
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count: projectsThisMonth } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', profile.organization_id)
    .gte('created_at', startOfMonth.toISOString())

  // Proyectos completados
  const { count: completedProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', profile.organization_id)
    .eq('status', 'completed')

  return {
    totalUsers: totalUsers || 0,
    totalProjects: totalProjects || 0,
    projectsThisMonth: projectsThisMonth || 0,
    completedProjects: completedProjects || 0,
  }
}

/**
 * Obtener proyectos de la organización
 */
export async function getProjects() {
  const { profile } = await requireProfile()
  const supabase = createClient()

  if (!profile.organization_id) {
    return []
  }

  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      profiles!projects_created_by_fkey (
        id,
        full_name,
        email
      )
    `)
    .eq('organization_id', profile.organization_id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener proyectos:', error)
    return []
  }

  return projects || []
}

/**
 * Crear nuevo proyecto
 */
export async function createProject(data: z.infer<typeof createProjectSchema>) {
  const { profile } = await requireProfile()
  const supabase = createClient()

  if (!profile.organization_id) {
    return { error: 'No perteneces a una organización' }
  }

  // Verificar que sea admin
  if (!['org_admin', 'master_admin'].includes(profile.role)) {
    return { error: 'Solo los administradores pueden crear proyectos' }
  }

  const validated = createProjectSchema.parse(data)

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      organization_id: profile.organization_id,
      name: validated.name,
      description: validated.description || null,
      type: validated.type || null,
      status: validated.status || 'active',
      created_by: profile.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error al crear proyecto:', error)
    return { error: 'Error al crear el proyecto' }
  }

  return { success: true, data: project }
}

/**
 * Actualizar proyecto
 */
export async function updateProject(id: string, data: Partial<z.infer<typeof createProjectSchema>>) {
  const { profile } = await requireProfile()
  const supabase = createClient()

  if (!profile.organization_id) {
    return { error: 'No perteneces a una organización' }
  }

  // Verificar que sea admin
  if (!['org_admin', 'master_admin'].includes(profile.role)) {
    return { error: 'Solo los administradores pueden editar proyectos' }
  }

  // Verificar que el proyecto pertenezca a su organización
  const { data: project } = await supabase
    .from('projects')
    .select('organization_id')
    .eq('id', id)
    .single()

  if (!project || project.organization_id !== profile.organization_id) {
    return { error: 'Proyecto no encontrado' }
  }

  const { data: updatedProject, error } = await supabase
    .from('projects')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error al actualizar proyecto:', error)
    return { error: 'Error al actualizar el proyecto' }
  }

  return { success: true, data: updatedProject }
}

/**
 * Eliminar proyecto
 */
export async function deleteProject(id: string) {
  const { profile } = await requireProfile()
  const supabase = createClient()

  if (!profile.organization_id) {
    return { error: 'No perteneces a una organización' }
  }

  // Verificar que sea admin
  if (!['org_admin', 'master_admin'].includes(profile.role)) {
    return { error: 'Solo los administradores pueden eliminar proyectos' }
  }

  // Verificar que el proyecto pertenezca a su organización
  const { data: project } = await supabase
    .from('projects')
    .select('organization_id')
    .eq('id', id)
    .single()

  if (!project || project.organization_id !== profile.organization_id) {
    return { error: 'Proyecto no encontrado' }
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error al eliminar proyecto:', error)
    return { error: 'Error al eliminar el proyecto' }
  }

  return { success: true }
}

/**
 * Obtener miembros del equipo
 */
export async function getTeamMembers() {
  const { profile } = await requireProfile()
  const supabase = createClient()

  if (!profile.organization_id) {
    return []
  }

  const { data: members, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('organization_id', profile.organization_id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener miembros:', error)
    return []
  }

  return members || []
}

/**
 * Invitar miembro del equipo
 */
export async function inviteTeamMember(data: {
  email: string
  role: 'org_admin' | 'org_member'
  message?: string
}) {
  const { profile } = await requireProfile()
  const adminSupabase = createAdminClient()
  const supabase = createClient()

  if (!profile.organization_id) {
    return { error: 'No perteneces a una organización' }
  }

  // Verificar que sea admin
  if (!['org_admin', 'master_admin'].includes(profile.role)) {
    return { error: 'Solo los administradores pueden invitar miembros' }
  }

  // Verificar que el email no esté registrado
  const { data: listData } = await adminSupabase.auth.admin.listUsers({ perPage: 1000 })
  const existingUser = listData?.users?.find(
    (u) => u.email?.toLowerCase() === data.email.toLowerCase()
  )
  if (existingUser) {
    return { error: 'Este email ya está registrado' }
  }

  // Verificar que no haya invitación pendiente
  const { data: existingInvitation } = await supabase
    .from('invitations')
    .select('*')
    .eq('email', data.email)
    .eq('organization_id', profile.organization_id)
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (existingInvitation) {
    return { error: 'Ya existe una invitación pendiente para este email' }
  }

  // Obtener nombre de la organización
  const { data: organization } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', profile.organization_id)
    .single()

  // Crear invitación usando Supabase Auth
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://somosinflexo.com'
  const { data: inviteData, error: inviteError } = await adminSupabase.auth.admin.inviteUserByEmail(
    data.email,
    {
      data: {
        company_name: organization?.name || '',
        invited_by_name: profile.full_name,
        role: data.role,
      },
      redirectTo: `${siteUrl}/auth/register`,
    }
  )

  if (inviteError || !inviteData.user) {
    console.error('Error al invitar usuario:', inviteError)
    
    // Manejar específicamente el error de rate limit
    if (inviteError?.message?.toLowerCase().includes('rate limit') || 
        inviteError?.message?.toLowerCase().includes('too many requests')) {
      return { 
        error: 'Se alcanzó el límite de envío de emails. Por favor, espera unos minutos antes de intentar nuevamente. Si el problema persiste, contacta al soporte.' 
      }
    }
    
    return { error: inviteError?.message || 'Error al crear la invitación' }
  }

  // Crear registro en nuestra tabla de invitations
  const { error: invitationError } = await adminSupabase
    .from('invitations')
    .insert({
      email: data.email,
      organization_id: profile.organization_id,
      invited_by: profile.id,
      role: data.role,
      token: inviteData.user.id,
      status: 'pending',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        company_name: organization?.name || '',
        invited_by_name: profile.full_name,
        role: data.role,
        message: data.message || '',
      },
    })

  if (invitationError) {
    console.error('Error al crear registro de invitación:', invitationError)
    return { error: 'Error al crear el registro de invitación' }
  }

  return { success: true, message: `Invitación enviada a ${data.email}` }
}

/**
 * Actualizar organización
 */
export async function updateOrganization(data: {
  name?: string
  country?: string
  employee_count?: string
  phone?: string
}) {
  const { profile } = await requireProfile()
  const supabase = createClient()

  if (!profile.organization_id) {
    return { error: 'No perteneces a una organización' }
  }

  // Verificar que sea admin
  if (!['org_admin', 'master_admin'].includes(profile.role)) {
    return { error: 'Solo los administradores pueden editar la organización' }
  }

  const { data: updatedOrg, error } = await supabase
    .from('organizations')
    .update(data)
    .eq('id', profile.organization_id)
    .select()
    .single()

  if (error) {
    console.error('Error al actualizar organización:', error)
    return { error: 'Error al actualizar la organización' }
  }

  return { success: true, data: updatedOrg }
}

/**
 * Actualizar perfil
 */
export async function updateProfile(data: {
  full_name?: string
  phone?: string
}) {
  const { profile } = await requireProfile()
  const supabase = createClient()

  const { data: updatedProfile, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', profile.id)
    .select()
    .single()

  if (error) {
    console.error('Error al actualizar perfil:', error)
    return { error: 'Error al actualizar el perfil' }
  }

  return { success: true, data: updatedProfile }
}
