'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireMasterAdmin } from '@/lib/auth/guards'
import { inviteClientSchema } from '@/lib/validations/master-admin'
import { z } from 'zod'

interface MasterAdminStats {
  totalClients: number
  totalProjects: number
  pendingInvitations: number
  monthlyRevenue: number
}

interface ClientWithStats {
  id: string
  name: string
  rut: string
  country: string
  employee_count: string
  status: string
  created_at: string
  user_count: number
  project_count: number
}

/**
 * Obtener estadísticas del dashboard master admin
 */
export async function getMasterAdminStats(): Promise<MasterAdminStats> {
  const { user: profile } = await requireMasterAdmin()
  const supabase = createClient()

  // Total de clientes (organizaciones activas, excluyendo la del master admin)
  let totalClientsQuery = supabase
    .from('organizations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  if (profile.organization_id) {
    totalClientsQuery = totalClientsQuery.neq('id', profile.organization_id)
  }

  const { count: totalClients } = await totalClientsQuery

  // Total de proyectos (suma de todos los proyectos de todas las orgs)
  const { count: totalProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  // Invitaciones pendientes
  const { count: pendingInvitations } = await supabase
    .from('invitations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString())

  // Ingresos del mes (suma de facturas pagadas este mes)
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: paidInvoices } = await supabase
    .from('invoices')
    .select('amount')
    .eq('status', 'paid')
    .gte('paid_date', startOfMonth.toISOString().split('T')[0])

  const monthlyRevenue = paidInvoices?.reduce((sum, inv) => sum + Number(inv.amount || 0), 0) || 0

  return {
    totalClients: totalClients || 0,
    totalProjects: totalProjects || 0,
    pendingInvitations: pendingInvitations || 0,
    monthlyRevenue,
  }
}

/**
 * Obtener lista de todos los clientes con estadísticas
 */
export async function getAllClients(): Promise<ClientWithStats[]> {
  await requireMasterAdmin()
  const supabase = createClient()

  // Usar la nueva vista de gestión de clientes que ya trae los conteos
  const { data: clients, error } = await supabase
    .from('client_management_view')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !clients) {
    console.error('Error al obtener clientes:', error)
    return []
  }

  // Mapear al formato esperado por el frontend si es necesario
  return clients.map(client => ({
    id: client.id,
    name: client.name || 'Sin nombre',
    rut: client.rut || '-',
    country: client.country || 'Uruguay',
    employee_count: client.employee_count || '-',
    status: client.status,
    created_at: client.created_at,
    user_count: client.user_count || 0,
    project_count: client.project_count || 0,
  }))
}

/**
 * Invitar nuevo cliente
 */
export async function inviteClient(data: z.infer<typeof inviteClientSchema>) {
  const { user: profile } = await requireMasterAdmin()
  const adminSupabase = createAdminClient()

  // Validar schema
  const validated = inviteClientSchema.parse(data)

  // 1. Verificar si ya existe una organización pendiente para este email
  const { data: existingOrg } = await adminSupabase
    .from('organizations')
    .select('id')
    .eq('account_email', validated.email)
    .maybeSingle()

  let orgId = existingOrg?.id

  if (!orgId) {
    // Solo crear si no existe
    const { data: org, error: orgError } = await adminSupabase
      .from('organizations')
      .insert({
        name: validated.companyName,
        status: 'Solicitud',
        account_email: validated.email,
      })
      .select()
      .single()

    if (orgError) {
      console.error('Error al crear organización para invitación:', orgError)
      return { error: 'Error al crear la organización' }
    }
    orgId = org.id
  }

  // 2. Invitar al usuario usando Supabase Auth
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://somosinflexo.com'
  // Incluir email y company_name en la URL para que el formulario pueda pre-llenarse aunque el token expire
  const redirectUrl = `${siteUrl}/auth/register?email=${encodeURIComponent(validated.email)}&company_name=${encodeURIComponent(validated.companyName)}`

  const { data: inviteData, error: inviteError } = await adminSupabase.auth.admin.inviteUserByEmail(
    validated.email,
    {
      data: {
        company_name: validated.companyName,
        organization_id: orgId,
        plan: validated.plan || 'Starter',
      },
      redirectTo: redirectUrl,
    }
  )

  if (inviteError) {
    console.error('Error al invitar usuario:', inviteError)
    return { error: inviteError.message || 'Error al enviar invitación' }
  }

  return { success: true, message: `Invitación enviada a ${validated.email}. Estado: Solicitud` }
}

/**
 * Obtener dashboard de cliente específico
 */
export async function getClientDashboard(organizationId: string) {
  await requireMasterAdmin()
  const supabase = createClient()

  const { data: organization } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', organizationId)
    .single()

  if (!organization) {
    return { success: false, error: 'Organización no encontrada' }
  }

  const [usersResult, projectsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('organization_id', organizationId),
    supabase
      .from('projects')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false }),
  ])

  return {
    success: true,
    data: {
      organization,
      users: usersResult.data || [],
      projects: projectsResult.data || [],
      userCount: usersResult.data?.length || 0,
      projectCount: projectsResult.data?.length || 0,
    },
  }
}

/**
 * Obtener invitaciones
 */
export async function getInvitations() {
  await requireMasterAdmin()
  const supabase = createClient()

  const { data: invitations, error } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener invitaciones:', error)
    return []
  }

  return invitations || []
}

/**
 * Obtener facturas
 */
export async function getInvoices() {
  await requireMasterAdmin()
  const supabase = createClient()

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select(`
      *,
      organizations (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener facturas:', error)
    return []
  }

  return invoices || []
}

/**
 * Obtener todas las organizaciones para selector
 */
export async function getAllOrganizationsForSelect() {
  await requireMasterAdmin()
  const supabase = createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('role', 'master_admin')
    .single()

  let orgsQuery = supabase
    .from('organizations')
    .select('id, name')
    .eq('status', 'active')
    .order('name', { ascending: true })

  if (profile?.organization_id) {
    orgsQuery = orgsQuery.neq('id', profile.organization_id)
  }

  const { data: organizations, error } = await orgsQuery

  if (error) {
    console.error('Error al obtener organizaciones:', error)
    return []
  }

  return organizations || []
}

/**
 * Crear proyecto para una organización específica (solo master admin)
 */
export async function createProjectForOrganization(data: {
  organization_id: string
  name: string
  description?: string
  type?: string
  status?: 'active' | 'paused' | 'completed' | 'cancelled'
}) {
  const { user: profile } = await requireMasterAdmin()
  const supabase = createClient()

  // Validar que la organización existe
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id')
    .eq('id', data.organization_id)
    .single()

  if (orgError || !organization) {
    return { error: 'Organización no encontrada' }
  }

  // Validar datos del proyecto
  if (!data.name || data.name.trim().length === 0) {
    return { error: 'El nombre del proyecto es requerido' }
  }

  // Crear el proyecto
  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      organization_id: data.organization_id,
      name: data.name.trim(),
      description: data.description?.trim() || null,
      type: data.type?.trim() || null,
      status: data.status || 'active',
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
 * Obtener todos los proyectos con información de organización
 */
export async function getAllProjects() {
  await requireMasterAdmin()
  const supabase = createClient()

  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      organizations (
        id,
        name
      ),
      profiles!projects_created_by_fkey (
        id,
        full_name,
        email
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener proyectos:', error)
    return []
  }

  return projects || []
}
