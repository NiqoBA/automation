'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'

export async function createInvitation(email: string, role: 'org_admin' | 'org_member') {
  const supabase = createClient()
  
  // Get current user profile
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

  // Check if user is admin
  if (currentProfile.role !== 'master_admin' && currentProfile.role !== 'org_admin') {
    return { error: 'No tienes permisos para invitar usuarios' }
  }

  const organizationId = currentProfile.organization_id
  if (!organizationId) {
    return { error: 'No estás asociado a una organización' }
  }

  // Check if email already exists
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (existingUser) {
    return { error: 'Este email ya está registrado' }
  }

  // Check if there's already a pending invitation
  const { data: existingInvitation } = await supabase
    .from('invitations')
    .select('id')
    .eq('email', email)
    .eq('organization_id', organizationId)
    .eq('status', 'pending')
    .single()

  if (existingInvitation) {
    return { error: 'Ya existe una invitación pendiente para este email' }
  }

  // Generate token
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiration

  // Create invitation
  const { data: invitation, error } = await supabase
    .from('invitations')
    .insert({
      email,
      organization_id: organizationId,
      invited_by: user.id,
      role,
      token,
      expires_at: expiresAt.toISOString(),
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // TODO: Send email with invitation link
  // For now, we'll return the token so it can be used manually
  const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/register/${token}`

  revalidatePath('/dashboard')
  return { 
    success: true, 
    invitation,
    invitationUrl // For development - remove in production
  }
}

export async function getInvitationByToken(token: string) {
  const supabase = createClient()
  
  const { data: invitation, error } = await supabase
    .from('invitations')
    .select(`
      *,
      organizations (*),
      profiles!invitations_invited_by_fkey (*)
    `)
    .eq('token', token)
    .eq('status', 'pending')
    .single()

  if (error || !invitation) {
    return { error: 'Invitación no válida o expirada' }
  }

  // Check if expired
  if (new Date(invitation.expires_at) < new Date()) {
    // Update status to expired
    await supabase
      .from('invitations')
      .update({ status: 'expired' })
      .eq('id', invitation.id)

    return { error: 'La invitación ha expirado' }
  }

  return { invitation }
}

export async function getInvitations() {
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

  // Master admin can see all, org admin can see their org's invitations
  let query = supabase
    .from('invitations')
    .select(`
      *,
      organizations (*),
      profiles!invitations_invited_by_fkey (*)
    `)
    .order('created_at', { ascending: false })

  if (currentProfile.role !== 'master_admin') {
    query = query.eq('organization_id', currentProfile.organization_id)
  }

  const { data: invitations, error } = await query

  if (error) {
    return { error: error.message }
  }

  return { invitations }
}
