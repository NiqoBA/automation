'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validations/auth'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

interface LoginFormData {
  email: string
  password: string
}

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Usar el cliente de Supabase directamente para login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        setError(authError.message)
        setIsLoading(false)
        return
      }

      if (!authData.user) {
        setError('Error al iniciar sesión')
        setIsLoading(false)
        return
      }

      // Esperar un momento para que las cookies se establezcan
      await new Promise(resolve => setTimeout(resolve, 500))

      // Verificar perfil desde el cliente
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle()

      if (profileError) {
        console.error('Error al obtener perfil:', profileError)
        await supabase.auth.signOut()
        setError('Error al verificar tu perfil. Contacta al administrador.')
        setIsLoading(false)
        return
      }

      if (!profile) {
        await supabase.auth.signOut()
        setError('Tu cuenta no está completamente configurada. Contacta al administrador.')
        setIsLoading(false)
        return
      }

      // Esperar un momento para que las cookies se establezcan
      console.log('Login exitoso, esperando sincronización de cookies...')
      await new Promise(resolve => setTimeout(resolve, 800))

      // Verificar que la sesión esté establecida
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Sesión:', session ? 'Establecida' : 'No establecida')
      
      if (!session) {
        setError('Error al establecer la sesión. Intenta de nuevo.')
        setIsLoading(false)
        return
      }

      console.log('Sesión establecida, obteniendo organización...')
      
      // Obtener el perfil para saber a qué organización pertenece
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('organization_id, role')
        .eq('id', authData.user.id)
        .single()

      if (!userProfile) {
        await supabase.auth.signOut()
        setError('Tu cuenta no está completamente configurada. Contacta al administrador.')
        setIsLoading(false)
        return
      }

      // Redirigir según rol
      let redirectUrl = '/auth/login'
      if (userProfile.role === 'master_admin') {
        redirectUrl = '/dashboard/admin'
      } else {
        redirectUrl = '/dashboard/org'
      }

      console.log('Redirigiendo a:', redirectUrl)
      window.location.href = redirectUrl
    } catch (err: any) {
      console.error('Error en login:', err)
      setError(err.message || 'Error inesperado al iniciar sesión')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0d0d0d] text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors"
          placeholder="tu@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
          Contraseña
        </label>
        <input
          {...register('password')}
          type="password"
          id="password"
          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0d0d0d] text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          'Iniciar sesión'
        )}
      </button>
    </form>
  )
}
