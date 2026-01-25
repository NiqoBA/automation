import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RegisterForm from '@/components/auth/RegisterForm'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { email?: string; company_name?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Si el usuario ya está autenticado, redirigir
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id, role')
      .eq('id', user.id)
      .maybeSingle()
    
    if (profile?.role === 'master_admin') {
      redirect('/dashboard/admin')
    } else {
      redirect('/dashboard/org')
    }
  }

  // Obtener email y company_name de los query params o de la sesión
  const email = searchParams?.email || ''
  const companyName = searchParams?.company_name || ''

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Completa tu registro</h1>
          <p className="text-gray-400">Has sido invitado a Inflexo AI</p>
        </div>
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8">
          <RegisterForm email={email} companyName={companyName} />
        </div>
      </div>
    </div>
  )
}
