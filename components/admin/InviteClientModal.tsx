'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Loader2 } from 'lucide-react'
import { inviteClientSchema, type InviteClientInput } from '@/lib/validations/master-admin'
import { inviteClient } from '@/app/actions/master-admin'
import { useTheme } from '@/contexts/ThemeContext'

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
  const { theme } = useTheme()
  const isLight = theme === 'light'

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

  const bgClass = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900 border-zinc-800'
  const borderClass = isLight ? 'border-gray-200' : 'border-zinc-800'
  const textPrimaryClass = isLight ? 'text-gray-900' : 'text-zinc-100'
  const textSecondaryClass = isLight ? 'text-gray-600' : 'text-zinc-400'
  const textLabelClass = isLight ? 'text-gray-700' : 'text-zinc-300'
  const inputBgClass = isLight ? 'bg-gray-50 border-gray-300' : 'bg-zinc-800 border-zinc-700'
  const inputTextClass = isLight ? 'text-gray-900' : 'text-zinc-100'
  const placeholderClass = isLight ? 'placeholder-gray-400' : 'placeholder-zinc-500'
  const buttonBgClass = isLight ? 'bg-gray-100 hover:bg-gray-200' : 'bg-zinc-800 hover:bg-zinc-700'
  const buttonTextClass = isLight ? 'text-gray-700' : 'text-zinc-300'
  const closeButtonHoverClass = isLight ? 'hover:bg-gray-100' : 'hover:bg-zinc-800'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`${bgClass} border rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl transition-colors`}>
        <div className={`flex items-center justify-between p-4 border-b transition-colors ${borderClass}`}>
          <h2 className={`text-lg font-bold ${textPrimaryClass}`}>
            Invitar Nuevo Cliente
          </h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${textSecondaryClass} ${closeButtonHoverClass} ${isLight ? 'hover:text-gray-900' : 'hover:text-zinc-100'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
          {error && (
            <div className={`p-3 rounded-lg border text-sm transition-colors ${
              isLight 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {error}
            </div>
          )}

          {success && (
            <div className={`p-3 rounded-lg border text-sm transition-colors ${
              isLight 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              ¡Invitación enviada exitosamente!
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${textLabelClass}`}>
              Email del Admin del Cliente *
            </label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${inputBgClass} ${inputTextClass} ${placeholderClass}`}
              placeholder="admin@empresa.com"
            />
            {errors.email && (
              <p className={`mt-1 text-sm ${isLight ? 'text-red-600' : 'text-red-400'}`}>{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${textLabelClass}`}>
              Nombre del Cliente/Empresa *
            </label>
            <input
              type="text"
              {...register('companyName')}
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${inputBgClass} ${inputTextClass} ${placeholderClass}`}
              placeholder="Empresa S.A."
            />
            {errors.companyName && (
              <p className={`mt-1 text-sm ${isLight ? 'text-red-600' : 'text-red-400'}`}>
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${textLabelClass}`}>
              Plan
            </label>
            <select
              {...register('plan')}
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${inputBgClass} ${inputTextClass}`}
            >
              <option value="">Seleccionar plan</option>
              <option value="Starter">Starter</option>
              <option value="Professional">Professional</option>
              <option value="Enterprise">Enterprise</option>
            </select>
            {errors.plan && (
              <p className={`mt-1 text-sm ${isLight ? 'text-red-600' : 'text-red-400'}`}>{errors.plan.message}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${textLabelClass}`}>
              Notas internas (opcional)
            </label>
            <textarea
              {...register('notes')}
              rows={2}
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none transition-colors ${inputBgClass} ${inputTextClass} ${placeholderClass}`}
              placeholder="Cliente referido por..."
            />
            {errors.notes && (
              <p className={`mt-1 text-sm ${isLight ? 'text-red-600' : 'text-red-400'}`}>{errors.notes.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${buttonBgClass} ${buttonTextClass}`}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
