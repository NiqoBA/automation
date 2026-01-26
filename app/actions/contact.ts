'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireMasterAdmin } from '@/lib/auth/guards'
import type { ContactSubmission } from '@/lib/types/database'

const CONTACT_WEBHOOK_URL =
  process.env.CONTACT_WEBHOOK_URL ||
  'https://n8n.srv908725.hstgr.cloud/webhook/notificaciones_inflexo'

export type ContactFormData = {
  name: string
  email: string
  company: string
  phone?: string
  service: string
  message?: string
}

/**
 * Enviar payload al webhook de n8n (no bloquea ni falla el flujo).
 */
async function notifyWebhook(payload: Record<string, string | null>) {
  try {
    const res = await fetch(CONTACT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.warn('[contact] Webhook responded', res.status, await res.text())
    }
  } catch (e) {
    console.warn('[contact] Webhook request failed:', e)
  }
}

/**
 * Guardar envío del formulario de contacto (público, sin auth).
 * Usa admin client para insertar sin sesión.
 * Además envía un webhook a n8n con los datos del formulario.
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

  await notifyWebhook({
    name,
    email,
    company,
    phone,
    service,
    message,
  })

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
