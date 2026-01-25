'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireMasterAdmin } from '@/lib/auth/guards'
import type { ContactSubmission } from '@/lib/types/database'

export type ContactFormData = {
  name: string
  email: string
  company: string
  phone?: string
  service: string
  message?: string
}

/**
 * Guardar envío del formulario de contacto (público, sin auth).
 * Usa admin client para insertar sin sesión.
 */
export async function submitContactForm(data: ContactFormData): Promise<{ error?: string }> {
  const name = String(data.name ?? '').trim()
  const email = String(data.email ?? '').trim()
  const company = String(data.company ?? '').trim()
  const service = String(data.service ?? 'automations').trim() || 'automations'
  const phone = data.phone != null ? String(data.phone).trim() || null : null
  const message = data.message != null ? String(data.message).trim() || null : null

  if (!name || !email || !company) {
    return { error: 'Nombre, email y empresa son obligatorios' }
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRe.test(email)) {
    return { error: 'Email inválido' }
  }

  const admin = createAdminClient()
  const { error } = await admin.from('contact_submissions').insert({
    name,
    email,
    company,
    phone,
    service,
    message,
  })

  if (error) {
    console.error('Error al guardar contacto:', error)
    return { error: 'No se pudo enviar el formulario. Intenta de nuevo.' }
  }

  return {}
}

/**
 * Listar envíos de contacto (solo master admin).
 */
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  await requireMasterAdmin()
  const supabase = createClient()

  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener contactos:', error)
    return []
  }

  return (data ?? []) as ContactSubmission[]
}

/**
 * Contar envíos de contacto (para badge en sidebar).
 */
export async function getContactSubmissionsCount(): Promise<number> {
  await requireMasterAdmin()
  const supabase = createClient()
  const { count, error } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
  if (error) return 0
  return count ?? 0
}
