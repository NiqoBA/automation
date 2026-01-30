'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateOrganization, updateProfile } from '@/app/actions/client'
import { useTheme } from '@/contexts/ThemeContext'
import type { Organization, Profile } from '@/lib/types/database'

interface SettingsFormProps {
  profile: Profile
  organization: Organization | null
}

export default function SettingsForm({ profile, organization }: SettingsFormProps) {
  const router = useRouter()
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [orgData, setOrgData] = useState({
    name: organization?.name || '',
    country: organization?.country || '',
    employee_count: organization?.employee_count || '',
  })

  const [profileData, setProfileData] = useState({
    full_name: profile.full_name,
    phone: profile.phone || '',
  })

  const isLight = theme === 'light'

  // Theme classes
  const cardClass = isLight
    ? 'bg-white border-gray-200'
    : 'bg-zinc-900/50 border-zinc-800'
  const titleClass = isLight ? 'text-gray-900' : 'text-zinc-100'
  const labelClass = isLight ? 'text-gray-700' : 'text-zinc-300'
  const inputClass = isLight
    ? 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500 focus:border-violet-500'
    : 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-violet-500'
  const inputDisabledClass = isLight
    ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
    : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 cursor-not-allowed'
  const helperTextClass = isLight ? 'text-gray-500' : 'text-zinc-500'

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await updateOrganization(orgData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Organización actualizada correctamente')
        router.refresh()
      }
    } catch (err) {
      setError('Error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await updateProfile(profileData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Perfil actualizado correctamente')
        router.refresh()
      }
    } catch (err) {
      setError('Error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Organization Settings */}
      {organization && ['org_admin', 'master_admin'].includes(profile.role) && (
        <div className={`border rounded-xl p-6 transition-colors ${cardClass}`}>
          <h2 className={`text-xl font-bold mb-4 ${titleClass}`}>
            Información de la Organización
          </h2>
          {error && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${isLight ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
              {error}
            </div>
          )}
          {success && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${isLight ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
              {success}
            </div>
          )}
          <form onSubmit={handleOrgSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                Nombre de Empresa
              </label>
              <input
                type="text"
                value={orgData.name}
                onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${inputClass}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                País
              </label>
              <input
                type="text"
                value={orgData.country}
                onChange={(e) => setOrgData({ ...orgData, country: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${inputClass}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                Cantidad de Empleados
              </label>
              <input
                type="text"
                value={orgData.employee_count}
                onChange={(e) => setOrgData({ ...orgData, employee_count: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${inputClass}`}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium transition-all disabled:opacity-50"
              >
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Profile Settings */}
      <div className={`border rounded-xl p-6 transition-colors ${cardClass}`}>
        <h2 className={`text-xl font-bold mb-4 ${titleClass}`}>Mi Perfil</h2>
        {error && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${isLight ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
            {error}
          </div>
        )}
        {success && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${isLight ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
            {success}
          </div>
        )}
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
              Nombre Completo
            </label>
            <input
              type="text"
              value={profileData.full_name}
              onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${inputClass}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className={`w-full px-4 py-2 rounded-lg border ${inputDisabledClass}`}
            />
            <p className={`text-xs mt-1 ${helperTextClass}`}>El email no se puede cambiar</p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
              Teléfono
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${inputClass}`}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium transition-all disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
