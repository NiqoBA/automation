'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireProfile, requireMasterAdmin } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

/**
 * Verificar acceso a un proyecto
 */
async function verifyProjectAccess(projectId: string) {
    const { profile } = await requireProfile()
    const supabase = createClient()

    // Master admin tiene acceso a todo
    if (profile.role === 'master_admin') {
        const { data: project } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single()
        return { hasAccess: !!project, project, profile }
    }

    // Verificar si es de su organización
    const { data: orgProject } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('organization_id', profile.organization_id)
        .single()

    if (orgProject) {
        return { hasAccess: true, project: orgProject, profile }
    }

    // Verificar si es miembro del proyecto
    const { data: membership } = await supabase
        .from('project_members')
        .select('*, projects(*)')
        .eq('project_id', projectId)
        .eq('user_id', profile.id)
        .single()

    if (membership) {
        return { hasAccess: true, project: membership.projects, profile, membership }
    }

    return { hasAccess: false, project: null, profile }
}

/**
 * Obtener dashboard del proyecto
 */
export async function getProjectDashboard(projectId: string) {
    const access = await verifyProjectAccess(projectId)

    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createClient()

    // Obtener estadísticas
    const [propertiesCount, logsCount, ticketsCount, updatesCount] = await Promise.all([
        supabase.from('scraper_properties').select('id', { count: 'exact', head: true }).eq('project_id', projectId),
        supabase.from('scraper_logs').select('id', { count: 'exact', head: true }).eq('project_id', projectId),
        supabase.from('tickets').select('id', { count: 'exact', head: true }).eq('project_id', projectId),
        supabase.from('project_updates').select('id', { count: 'exact', head: true }).eq('project_id', projectId),
    ])

    return {
        success: true,
        data: {
            project: access.project,
            stats: {
                properties: propertiesCount.count || 0,
                logs: logsCount.count || 0,
                tickets: ticketsCount.count || 0,
                updates: updatesCount.count || 0,
            },
            userRole: access.profile.role,
        }
    }
}

/**
 * Obtener propiedades del proyecto con paginación y filtros
 */
export async function getProjectProperties(
    projectId: string,
    options: {
        page?: number
        perPage?: number
        neighborhood?: string
        minPrice?: number
        maxPrice?: number
        portal?: string
    } = {}
) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createClient()
    const { page = 1, perPage = 20, neighborhood, minPrice, maxPrice, portal } = options
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
        .from('scraper_properties')
        .select('*', { count: 'exact' })
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

    if (neighborhood) {
        query = query.ilike('neighborhood', `%${neighborhood}%`)
    }
    if (minPrice) {
        query = query.gte('price', minPrice)
    }
    if (maxPrice) {
        query = query.lte('price', maxPrice)
    }
    if (portal) {
        query = query.eq('portal', portal)
    }

    const { data, count, error } = await query.range(from, to)

    if (error) {
        console.error('Error fetching properties:', error)
        return { error: 'Error al obtener propiedades' }
    }

    return {
        success: true,
        data: {
            properties: data || [],
            total: count || 0,
            page,
            perPage,
            totalPages: Math.ceil((count || 0) / perPage),
        }
    }
}

/**
 * Obtener logs del proyecto
 */
export async function getProjectLogs(projectId: string) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createClient()
    const { data, error } = await supabase
        .from('scraper_logs')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(50)

    if (error) {
        console.error('Error fetching logs:', error)
        return { error: 'Error al obtener logs' }
    }

    return { success: true, data: data || [] }
}

/**
 * Obtener tickets del proyecto
 */
export async function getProjectTickets(projectId: string) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createClient()
    const { data, error } = await supabase
        .from('tickets')
        .select('*, created_by_profile:profiles!tickets_created_by_fkey(full_name, email)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching tickets:', error)
        return { error: 'Error al obtener tickets' }
    }

    return { success: true, data: data || [] }
}

/**
 * Crear un ticket
 */
export async function createTicket(projectId: string, data: { title: string; description?: string; priority?: string }) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createClient()
    const { error } = await supabase
        .from('tickets')
        .insert({
            project_id: projectId,
            created_by: access.profile.id,
            title: data.title,
            description: data.description,
            priority: data.priority || 'medium',
        })

    if (error) {
        console.error('Error creating ticket:', error)
        return { error: 'Error al crear ticket' }
    }

    revalidatePath(`/dashboard/projects/${projectId}/tickets`)
    return { success: true }
}

/**
 * Obtener actualizaciones del proyecto
 */
export async function getProjectUpdates(projectId: string) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createClient()
    const { data, error } = await supabase
        .from('project_updates')
        .select('*, created_by_profile:profiles!project_updates_created_by_fkey(full_name)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching updates:', error)
        return { error: 'Error al obtener actualizaciones' }
    }

    return { success: true, data: data || [] }
}

/**
 * Crear una actualización (solo master admin)
 */
export async function createProjectUpdate(
    projectId: string,
    data: { title: string; content?: string; update_type?: string }
) {
    const { user: profile } = await requireMasterAdmin()

    const adminSupabase = createAdminClient()
    const { error } = await adminSupabase
        .from('project_updates')
        .insert({
            project_id: projectId,
            created_by: profile.id,
            title: data.title,
            content: data.content,
            update_type: data.update_type || 'info',
        })

    if (error) {
        console.error('Error creating update:', error)
        return { error: 'Error al crear actualización' }
    }

    revalidatePath(`/dashboard/projects/${projectId}/updates`)
    return { success: true }
}

/**
 * Obtener miembros del proyecto
 */
export async function getProjectMembers(projectId: string) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createClient()
    const { data, error } = await supabase
        .from('project_members')
        .select('*, user:profiles!project_members_user_id_fkey(id, full_name, email)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching members:', error)
        return { error: 'Error al obtener miembros' }
    }

    return { success: true, data: data || [] }
}

/**
 * Compartir proyecto con un usuario (solo master admin)
 */
export async function shareProject(projectId: string, email: string, role: string = 'viewer') {
    const { user: profile } = await requireMasterAdmin()
    const adminSupabase = createAdminClient()

    // Buscar usuario por email
    const { data: targetProfile } = await adminSupabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', email)
        .single()

    if (!targetProfile) {
        return { error: 'Usuario no encontrado. El usuario debe estar registrado primero.' }
    }

    // Verificar si ya es miembro
    const { data: existingMember } = await adminSupabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', targetProfile.id)
        .single()

    if (existingMember) {
        return { error: 'Este usuario ya tiene acceso al proyecto' }
    }

    // Agregar como miembro
    const { error } = await adminSupabase
        .from('project_members')
        .insert({
            project_id: projectId,
            user_id: targetProfile.id,
            role: role,
            invited_by: profile.id,
        })

    if (error) {
        console.error('Error sharing project:', error)
        return { error: 'Error al compartir proyecto' }
    }

    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true, message: `Proyecto compartido con ${targetProfile.full_name || email}` }
}

/**
 * Remover miembro del proyecto (solo master admin)
 */
export async function removeProjectMember(projectId: string, userId: string) {
    await requireMasterAdmin()
    const adminSupabase = createAdminClient()

    const { error } = await adminSupabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', userId)

    if (error) {
        console.error('Error removing member:', error)
        return { error: 'Error al remover miembro' }
    }

    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true }
}

/**
 * Obtener lista de proyectos accesibles por el usuario
 */
export async function getAccessibleProjects() {
    const { profile } = await requireProfile()
    const supabase = createClient()

    if (profile.role === 'master_admin') {
        // Master admin ve todos los proyectos
        const { data } = await supabase
            .from('projects')
            .select('*, organization:organizations(name)')
            .order('created_at', { ascending: false })
        return { success: true, data: data || [] }
    }

    // Proyectos de su organización
    const { data: orgProjects } = await supabase
        .from('projects')
        .select('*, organization:organizations(name)')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })

    // Proyectos compartidos
    const { data: sharedProjects } = await supabase
        .from('project_members')
        .select('project_id, role, projects(*, organization:organizations(name))')
        .eq('user_id', profile.id)

    const allProjects = [
        ...(orgProjects || []).map(p => ({ ...p, accessType: 'organization' })),
        ...(sharedProjects || []).map(pm => ({ ...pm.projects, accessType: 'shared', sharedRole: pm.role })),
    ]

    // Eliminar duplicados
    const uniqueProjects = allProjects.filter((project, index, self) =>
        index === self.findIndex(p => p.id === project.id)
    )

    return { success: true, data: uniqueProjects }
}
