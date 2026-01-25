import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    detectSessionInUrl: true, // Detectar sesión en hash del URL
    autoRefreshToken: true,
    persistSession: true,
  },
})
