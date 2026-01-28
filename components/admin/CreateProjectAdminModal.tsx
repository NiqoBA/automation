'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createProjectForOrganization, getAllOrganizationsForSelect } from '@/app/actions/master-admin'
import { X } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface CreateProjectAdminModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Organization {
  id: string
  name: string
}

export default function CreateProjectAdminModal({
  isOpen,
  onClose,
}: CreateProjectAdminModalProps) {
  const router = useRouter()
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [formData, setFormData] = useState({
    organization_id: '',
    name: '',
    description: '',
    type: '',
    status: 'active' as 'active' | 'paused' | 'completed' | 'cancelled',
  })

  useEffect(() => {
    if (isOpen) {
      loadOrganizations()
    }
  }, [isOpen])

  const loadOrganizations = async () => {
    setIsLoadingOrgs(true)
    try {
      const orgs = await getAllOrganizationsForSelect()
      setOrganizations(orgs)
    } catch (err) {
      setError('Error al cargar organizaciones')
    } finally {
      setIsLoadingOrgs(false)
    }
  }

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!formData.organization_id) {
      setError('Debes seleccionar una organización')
      setIsLoading(false)
      return
    }

    try {
      const result = await createProjectForOrganization(formData)

      if (result.error) {
        setError(result.error)
        return
      }

      router.refresh()
      onClose()
      setFormData({
        organization_id: '',
        name: '',
        description: '',
        type: '',
        status: 'active',
      })
    } catch (err) {
      setError('Error inesperado al crear el proyecto')
    } finally {
      setIsLoading(false)
    }
  }

  const bgClass = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900 border-zinc-800'
  const borderClass = isLight ? 'border-gray-200' : 'border-zinc-800'
  const textPrimaryClass = isLight ? 'text-gray-900' : 'text-zinc-100'
  const textSecondaryClass = isLight ? 'text-gray-600' : 'text-zinc-400'
  const textLabelClass = isLight ? 'text-gray-700' : 'text-zinc-300'
  const inputBgClass = isLight ? 'bg-gray-50 border-gray-300' : 'bg-zinc-800 border-zinc-700'
  const inputTextClass = isLight ? 'text-gray-900' : 'text-zinc-100'
  const buttonBgClass = isLight ? 'bg-gray-100 hover:bg-gray-200' : 'bg-zinc-800 hover:bg-zinc-700'
  const buttonTextClass = isLight ? 'text-gray-700' : 'text-zinc-300'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className={`${bgClass} border rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto transition-colors`}>
        <div className={`flex items-center justify-between p-4 border-b transition-colors ${borderClass}`}>
          <h2 className={`text-lg font-bold ${textPrimaryClass}`}>Nuevo Proyecto</h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${textSecondaryClass} ${isLight ? 'hover:bg-gray-100' : 'hover:bg-zinc-800'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${textLabelClass}`}>
              Organización *
            </label>
            {isLoadingOrgs ? (
              <div className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputBgClass} ${textSecondaryClass}`}>
                Cargando organizaciones...
              </div>
            ) : (
              <select
                required
                value={formData.organization_id}
                onChange={(e) =>
                  setFormData({ ...formData, organization_id: e.target.value })
                }
                className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${inputBgClass} ${inputTextClass}`}
              >
                <option value="">Seleccionar organización</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${textLabelClass}`}>
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${inputBgClass} ${inputTextClass}`}
              placeholder="Ej: Sistema de gestión"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${textLabelClass}`}>
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${inputBgClass} ${inputTextClass}`}
              placeholder="Descripción del proyecto..."
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${textLabelClass}`}>
              Tipo
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${inputBgClass} ${inputTextClass}`}
            >
              <option value="">Seleccionar tipo</option>
              <option value="Automatización">Automatización</option>
              <option value="Chatbot">Chatbot</option>
              <option value="Integration">Integration</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${textLabelClass}`}>
              Estado Inicial
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as typeof formData.status,
                })
              }
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${inputBgClass} ${inputTextClass}`}
            >
              <option value="active">Activo</option>
              <option value="paused">Pausado</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${buttonBgClass} ${buttonTextClass}`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || isLoadingOrgs}
              className="px-3 py-1.5 text-sm rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium transition-all disabled:opacity-50"
            >
              {isLoading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
