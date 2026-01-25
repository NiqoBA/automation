'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateOrganization, updateProfile } from '@/app/actions/client'
import type { Organization, Profile } from '@/lib/types/database'

interface SettingsFormProps {
  profile: Profile
  organization: Organization | null
}

export default function SettingsForm({ profile, organization }: SettingsFormProps) {
  const router = useRouter()
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
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-zinc-100 mb-4">
            Información de la Organización
          </h2>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              {success}
            </div>
          )}
          <form onSubmit={handleOrgSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Nombre de Empresa
              </label>
              <input
                type="text"
                value={orgData.name}
                onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                País
              </label>
              <input
                type="text"
                value={orgData.country}
                onChange={(e) => setOrgData({ ...orgData, country: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Cantidad de Empleados
              </label>
              <input
                type="text"
                value={orgData.employee_count}
                onChange={(e) => setOrgData({ ...orgData, employee_count: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
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
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-zinc-100 mb-4">Mi Perfil</h2>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            {success}
          </div>
        )}
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={profileData.full_name}
              onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700 text-zinc-400 cursor-not-allowed"
            />
            <p className="text-xs text-zinc-500 mt-1">El email no se puede cambiar</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
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
