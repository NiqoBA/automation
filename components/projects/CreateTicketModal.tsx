'use client'

import { useState } from 'react'
import { createTicket } from '@/app/actions/project-actions'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { X, AlertCircle } from 'lucide-react'

interface CreateTicketModalProps {
    projectId: string
    isOpen: boolean
    onClose: () => void
}

export default function CreateTicketModal({ projectId, isOpen, onClose }: CreateTicketModalProps) {
    const router = useRouter()
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
    })

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const result = await createTicket(projectId, formData)

        if (result.error) {
            setError(result.error)
            setLoading(false)
        } else {
            router.refresh()
            onClose()
            setFormData({ title: '', description: '', priority: 'medium' })
        }
    }

    const bgClass = isLight ? 'bg-white' : 'bg-zinc-900'
    const inputClass = isLight
        ? 'bg-gray-50 border-gray-300 text-gray-900'
        : 'bg-zinc-800 border-zinc-700 text-zinc-100'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className={`w-full max-w-md rounded-xl border ${isLight ? 'border-gray-200' : 'border-zinc-800'} ${bgClass} p-6`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-xl font-bold ${isLight ? 'text-gray-900' : 'text-zinc-100'}`}>
                        Nuevo Ticket
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                        <X size={20} className={isLight ? 'text-gray-500' : 'text-zinc-400'} />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-gray-700' : 'text-zinc-300'}`}>
                            Título *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500 ${inputClass}`}
                            placeholder="Describe brevemente el problema"
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-gray-700' : 'text-zinc-300'}`}>
                            Descripción
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500 ${inputClass}`}
                            placeholder="Describe el problema en detalle..."
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-gray-700' : 'text-zinc-300'}`}>
                            Prioridad
                        </label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500 ${inputClass}`}
                        >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                            <option value="urgent">Urgente</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 px-4 py-2 rounded-lg border font-medium transition-colors
                ${isLight ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'}`}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Creando...' : 'Crear Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
