'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Loader2 } from 'lucide-react'
import { inviteClientSchema, type InviteClientInput } from '@/lib/validations/master-admin'
import { inviteClient } from '@/app/actions/master-admin'

interface InviteClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function InviteClientModal({
  isOpen,
  onClose,
  onSuccess,
}: InviteClientModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteClientInput>({
    resolver: zodResolver(inviteClientSchema),
  })

  if (!isOpen) return null

  const onSubmit = async (data: InviteClientInput) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await inviteClient(data)

      if (result.success) {
        setSuccess(true)
        reset()
        setTimeout(() => {
          onSuccess()
          onClose()
          setSuccess(false)
        }, 1500)
      } else {
        setError(result.error || 'Error al enviar la invitación')
      }
    } catch (err: any) {
      console.error('Error en InviteClientModal:', err)
      setError(err.message || 'Error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-100">
            Invitar Nuevo Cliente
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              ¡Invitación enviada exitosamente!
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Email del Admin del Cliente *
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="admin@empresa.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Nombre del Cliente/Empresa *
            </label>
            <input
              type="text"
              {...register('companyName')}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Empresa S.A."
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-400">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Plan
            </label>
            <select
              {...register('plan')}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Seleccionar plan</option>
              <option value="Starter">Starter</option>
              <option value="Professional">Professional</option>
              <option value="Enterprise">Enterprise</option>
            </select>
            {errors.plan && (
              <p className="mt-1 text-sm text-red-400">{errors.plan.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Notas internas (opcional)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="Cliente referido por..."
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-400">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Invitación'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
