'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { inviteTeamMember } from '@/app/actions/client'
import { X } from 'lucide-react'

interface InviteTeamModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function InviteTeamModal({
  isOpen,
  onClose,
}: InviteTeamModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    role: 'org_member' as 'org_admin' | 'org_member',
    message: '',
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await inviteTeamMember(formData)

      if (result.error) {
        setError(result.error)
        return
      }

      router.refresh()
      onClose()
      setFormData({
        email: '',
        role: 'org_member',
        message: '',
      })
    } catch (err) {
      setError('Error inesperado al enviar la invitación')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-100">Invitar Miembro</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Rol
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as typeof formData.role,
                })
              }
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="org_member">Miembro</option>
              <option value="org_admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Mensaje Personal (opcional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium transition-all disabled:opacity-50"
            >
              {isLoading ? 'Enviando...' : 'Enviar Invitación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
