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

  // Obtener todas las organizaciones (excepto la del master admin si tiene una)
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('role', 'master_admin')
    .single()

  let orgsQuery = supabase
    .from('organizations')
    .select('*')
    .order('created_at', { ascending: false })

  if (profile?.organization_id) {
    orgsQuery = orgsQuery.neq('id', profile.organization_id)
  }

  const { data: organizations, error: orgError } = await orgsQuery

  if (orgError || !organizations) {
    console.error('Error al obtener organizaciones:', orgError)
    return []
  }

  // Para cada organización, contar usuarios y proyectos
  const clientsWithStats: ClientWithStats[] = []

  for (const org of organizations) {
    const [usersResult, projectsResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', org.id),
      supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', org.id),
    ])

    clientsWithStats.push({
      id: org.id,
      name: org.name,
      rut: org.rut,
      country: org.country,
      employee_count: org.employee_count,
      status: org.status || 'active',
      created_at: org.created_at,
      user_count: usersResult.count || 0,
      project_count: projectsResult.count || 0,
    })
  }

  return clientsWithStats
}

/**
 * Invitar nuevo cliente
 */
export async function inviteClient(data: z.infer<typeof inviteClientSchema>) {
  const { user: profile } = await requireMasterAdmin()
  const adminSupabase = createAdminClient()
  const supabase = createClient()

  // Validar schema
  const validated = inviteClientSchema.parse(data)

  // Verificar que el email no esté registrado
  const { data: listData } = await adminSupabase.auth.admin.listUsers({ perPage: 1000 })
  const existingUser = listData?.users?.find(
    (u) => u.email?.toLowerCase() === validated.email.toLowerCase()
  )
  if (existingUser) {
    return { error: 'Este email ya está registrado' }
  }

  // Verificar que no haya invitación pendiente
  const { data: existingInvitation } = await supabase
    .from('invitations')
    .select('*')
    .eq('email', validated.email)
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (existingInvitation) {
    return { error: 'Ya existe una invitación pendiente para este email' }
  }

  // Crear invitación usando Supabase Auth
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const { data: inviteData, error: inviteError } = await adminSupabase.auth.admin.inviteUserByEmail(
    validated.email,
    {
      data: {
        company_name: validated.companyName,
        plan: validated.plan || 'Starter',
        notes: validated.notes || '',
      },
      redirectTo: `${siteUrl}/auth/register`,
    }
  )

  if (inviteError || !inviteData.user) {
    console.error('Error al invitar usuario:', inviteError)
    return { error: inviteError?.message || 'Error al crear la invitación' }
  }

  // Crear registro en nuestra tabla de invitations para tracking
  const { error: invitationError } = await adminSupabase
    .from('invitations')
    .insert({
      email: validated.email,
      organization_id: null, // Se creará cuando acepte
      invited_by: profile.id,
      role: 'org_admin',
      token: inviteData.user.id, // Usar el ID del usuario como token
      status: 'pending',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días
      metadata: {
        company_name: validated.companyName,
        plan: validated.plan || 'Starter',
        notes: validated.notes || '',
      },
    })

  if (invitationError) {
    console.error('Error al crear registro de invitación:', invitationError)
    return { error: 'Error al crear el registro de invitación' }
  }

  return { success: true, message: `Invitación enviada a ${validated.email}` }
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
