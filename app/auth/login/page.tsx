import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  // No verificar usuario aquí - dejar que el formulario maneje la redirección
  // Esto evita problemas de timing con las cookies

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Botón Volver */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver a la página principal</span>
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Inflexo AI</h1>
          <p className="text-gray-400">Inicia sesión en tu cuenta</p>
        </div>
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8">
          {searchParams?.error === 'no-profile' && (
            <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
              Tu cuenta no está completamente configurada. Contacta al administrador.
            </div>
          )}
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
