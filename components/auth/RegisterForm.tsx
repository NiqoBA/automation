'use client'

import { useState, useEffect } from 'react'
import { registerWithInvitation } from '@/app/actions/register'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

const employeeCountOptions = [
  { value: '1-10', label: '1-10 empleados' },
  { value: '11-50', label: '11-50 empleados' },
  { value: '51-200', label: '51-200 empleados' },
  { value: '201-1000', label: '201-1000 empleados' },
  { value: '1000+', label: '1000+ empleados' },
]

const countries = ['Uruguay', 'Argentina', 'Brasil', 'Chile', 'Paraguay', 'Otro']

export default function RegisterForm({ 
  email: initialEmail, 
  companyName: initialCompanyName,
  hasError = false
}: { 
  email?: string
  companyName?: string
  hasError?: boolean
}) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingInvitation, setLoadingInvitation] = useState(true)
  const [userEmail, setUserEmail] = useState<string>('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      country: 'Uruguay',
    },
  })

  useEffect(() => {
    async function loadUserData() {
      try {
        // Primero, verificar si hay un hash en la URL que Supabase necesita procesar
        // Esto es necesario cuando el usuario hace clic en el link del email
        if (typeof window !== 'undefined' && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          
          // Si hay tokens en el hash, establecer la sesión
          if (accessToken && refreshToken) {
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
            
            if (sessionError) {
              console.error('Error al establecer sesión:', sessionError)
              setError('Error al procesar el link de invitación. Intenta de nuevo.')
              setLoadingInvitation(false)
              return
            }
            
            // Limpiar el hash de la URL después de procesarlo
            if (sessionData?.session) {
              window.history.replaceState(null, '', window.location.pathname + window.location.search)
            }
          }
        }
        
        // Esperar un momento para que Supabase procese el hash si existía
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Obtener el usuario actual (después de procesar el hash si existía)
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('Error al obtener usuario:', userError)
        }
        
        // También intentar obtener la sesión
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session && !user) {
          // Si hay sesión pero no usuario, intentar obtener el usuario de nuevo
          const { data: { user: retryUser } } = await supabase.auth.getUser()
          if (retryUser && retryUser.email) {
            const userMetadata = retryUser.user_metadata || {}
            const email = retryUser.email
            const companyName = userMetadata.company_name || initialCompanyName || ''
            
            setUserEmail(email)
            setValue('email', email)
            
            if (companyName) {
              setValue('company_name', companyName)
            }
            setLoadingInvitation(false)
            return
          }
        }
        
        if (user && user.email) {
          // Obtener metadata del usuario (company_name, etc.)
          const userMetadata = user.user_metadata || {}
          const email = user.email
          const companyName = userMetadata.company_name || initialCompanyName || ''
          
          // Establecer email (siempre del usuario invitado)
          setUserEmail(email)
          setValue('email', email)
          
          if (companyName) {
            setValue('company_name', companyName)
          }
        } else if (initialEmail) {
          // Si no hay usuario pero hay email en query params (fallback)
          setUserEmail(initialEmail)
          setValue('email', initialEmail)
          if (initialCompanyName) {
            setValue('company_name', initialCompanyName)
          }
        } else if (!hasError) {
          // Si no hay email disponible y no hay error de URL, mostrar error
          setError('No se encontró una invitación válida. Asegúrate de hacer clic en el link del email.')
        }
      } catch (err: any) {
        console.error('Error al cargar datos del usuario:', err)
        if (!hasError) {
          setError('Error al procesar la invitación. Intenta de nuevo.')
        }
      } finally {
        setLoadingInvitation(false)
      }
    }
    loadUserData()
  }, [initialEmail, initialCompanyName, setValue, hasError])

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    // Usar el email del usuario invitado (siempre correcto)
    const emailToUse = userEmail || data.email

    if (!emailToUse) {
      setError('No se encontró el email. Asegúrate de hacer clic en el link del email de invitación.')
      setIsLoading(false)
      return
    }

    const result = await registerWithInvitation(
      emailToUse,
      data.password,
      data.full_name,
      data.phone,
      data.company_name,
      data.employee_count,
      data.rut,
      data.country
    )

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  if (loadingInvitation && !hasError) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    )
  }

  // Si hay error de link expirado y no hay email, no mostrar el formulario
  if (hasError && !userEmail) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400 text-sm">
          El formulario no está disponible porque el link ha expirado.
        </p>
      </div>
    )
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Campo de email oculto - siempre se usa el del usuario invitado */}
      <input
        type="hidden"
        {...register('email')}
        value={userEmail}
      />
      
      {/* Mostrar email como información, no como campo editable */}
      {userEmail && (
        <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
          <p className="text-xs text-zinc-400 mb-1">Registrándote como:</p>
          <p className="text-sm font-medium text-zinc-200">{userEmail}</p>
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
          Contraseña <span className="text-red-400">*</span>
        </label>
        <input
          {...register('password')}
          type="password"
          id="password"
          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0d0d0d] text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors"
          placeholder="Mínimo 6 caracteres"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-2">
          Nombre completo <span className="text-red-400">*</span>
        </label>
        <input
          {...register('full_name')}
          type="text"
          id="full_name"
          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0d0d0d] text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors"
          placeholder="Juan Pérez"
        />
        {errors.full_name && (
          <p className="mt-1 text-sm text-red-400">{errors.full_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
          Teléfono
        </label>
        <input
          {...register('phone')}
          type="tel"
          id="phone"
          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0d0d0d] text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors"
          placeholder="+598 99 123 456"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="company_name" className="block text-sm font-medium text-gray-300 mb-2">
          Nombre de empresa <span className="text-red-400">*</span>
          {initialCompanyName && (
            <span className="text-gray-500 ml-2">(pre-llenado)</span>
          )}
        </label>
        <input
          {...register('company_name')}
          type="text"
          id="company_name"
          className={`w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0d0d0d] text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors ${
            initialCompanyName ? 'opacity-90' : ''
          }`}
          placeholder="Mi Empresa S.A."
          disabled={!!initialCompanyName}
        />
        {errors.company_name && (
          <p className="mt-1 text-sm text-red-400">{errors.company_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="employee_count" className="block text-sm font-medium text-gray-300 mb-2">
          Cantidad de empleados <span className="text-red-400">*</span>
        </label>
        <select
          {...register('employee_count')}
          id="employee_count"
          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0d0d0d] text-white focus:border-purple-500 focus:ring-purple-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors"
        >
          {employeeCountOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.employee_count && (
          <p className="mt-1 text-sm text-red-400">{errors.employee_count.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="rut" className="block text-sm font-medium text-gray-300 mb-2">
          RUT <span className="text-red-400">*</span>
        </label>
        <input
          {...register('rut')}
          type="text"
          id="rut"
          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0d0d0d] text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors"
          placeholder="12345678-9"
        />
        {errors.rut && (
          <p className="mt-1 text-sm text-red-400">{errors.rut.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
          País <span className="text-red-400">*</span>
        </label>
        <select
          {...register('country')}
          id="country"
          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0d0d0d] text-white focus:border-purple-500 focus:ring-purple-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors"
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.country && (
          <p className="mt-1 text-sm text-red-400">{errors.country.message}</p>
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
            Creando cuenta...
          </>
        ) : (
          'Completar registro'
        )}
      </button>
    </form>
  )
}
