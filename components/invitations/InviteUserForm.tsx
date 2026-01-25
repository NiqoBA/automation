'use client'

import { useState } from 'react'
import { createInvitation } from '@/app/actions/invitations'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { inviteUserSchema } from '@/lib/validations/auth'
import { Loader2 } from 'lucide-react'

interface InviteUserFormData {
  email: string
  role: 'org_admin' | 'org_member'
}

export default function InviteUserForm({ onSuccess }: { onSuccess?: () => void }) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      role: 'org_member',
    },
  })

  const onSubmit = async (data: InviteUserFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await createInvitation(data.email, data.role)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setSuccess(`Invitación enviada a ${data.email}`)
      reset()
      setIsLoading(false)
      if (onSuccess) {
        onSuccess()
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          {success}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email del usuario
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0d0d0d] text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors"
          placeholder="usuario@ejemplo.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
          Rol
        </label>
        <select
          {...register('role')}
          id="role"
          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0d0d0d] text-white focus:border-purple-500 focus:ring-purple-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors"
        >
          <option value="org_member">Miembro</option>
          <option value="org_admin">Administrador</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-400">{errors.role.message}</p>
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
            Enviando invitación...
          </>
        ) : (
          'Enviar invitación'
        )}
      </button>
    </form>
  )
}
