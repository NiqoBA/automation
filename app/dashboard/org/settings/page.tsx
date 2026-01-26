import { requireProfile } from '@/lib/auth/guards'
import { createClient } from '@/lib/supabase/server'
import SettingsForm from '@/components/client/SettingsForm'

export default async function SettingsPage() {
  const { profile } = await requireProfile()
  const supabase = createClient()

  // Obtener organización
  const { data: organization } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', profile.organization_id)
    .single()

  return (
    <div className="min-w-0 max-w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Configuración</h1>
        <p className="text-zinc-400 mt-1">Gestiona la información de tu organización y perfil</p>
      </div>

      <SettingsForm profile={profile} organization={organization} />
    </div>
  )
}
