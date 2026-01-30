import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RegisterForm from '@/components/auth/RegisterForm'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: {
    email?: string
    company_name?: string
    error?: string
    error_code?: string
    error_description?: string
  }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Si el usuario ya está autenticado y tiene perfil, redirigir
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, organization_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (profile) {
      if (profile.role === 'master_admin') {
        redirect('/dashboard/admin')
      }
      redirect('/dashboard/org')
    }
    // Usuario invitado sin perfil: no redirigir, prellenar desde user
  }

  // Verificar si hay errores en la URL (link expirado, etc.)
  const hasError = searchParams?.error || searchParams?.error_code
  const errorMessage = searchParams?.error_description
    ? decodeURIComponent(searchParams.error_description.replace(/\+/g, ' '))
    : null

  // Obtener email y company_name de los query params o de la sesión del usuario invitado
  let email = searchParams?.email || ''
  let companyName = searchParams?.company_name || ''

  if (user) {
    email = user.email ?? email
    companyName = (user.user_metadata?.company_name as string | undefined) ?? companyName
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Completa tu registro</h1>
          <p className="text-gray-400">Has sido invitado a Inflexo AI</p>
        </div>
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8">
          {hasError && !email && (
            <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <h3 className="text-amber-400 font-semibold mb-2">Link Expirado o Inválido</h3>
              <p className="text-amber-300/80 text-sm mb-3">
                {errorMessage || 'El link de invitación ha expirado o es inválido.'}
              </p>
              <p className="text-zinc-400 text-sm">
                Por favor, contacta al administrador para que te envíe una nueva invitación.
              </p>
            </div>
          )}
          {hasError && email && (
            <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-blue-300 text-sm">
                Completa el formulario para finalizar tu registro.
              </p>
            </div>
          )}
          <RegisterForm email={email} companyName={companyName} hasError={!!hasError && !email} />
        </div>
      </div>
    </div>
  )
}
