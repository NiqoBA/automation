// Cliente de Supabase con permisos de administrador (bypass RLS)
// SOLO para uso interno en server actions cuando sea absolutamente necesario
import { createClient } from '@supabase/supabase-js'

// ⚠️ IMPORTANTE: Este cliente bypass RLS - usar SOLO cuando sea necesario
// No exponer esto al cliente
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
