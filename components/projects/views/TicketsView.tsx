'use client'

import { useState, useEffect } from 'react'
import { getProjectTickets, createTicket } from '@/app/actions/project-actions'
import { useTheme } from '@/contexts/ThemeContext'
import { Plus, MessageSquare, AlertCircle, CheckCircle, Clock, Loader2, X } from 'lucide-react'

interface TicketsViewProps {
    projectId: string
}

export default function TicketsView({ projectId }: TicketsViewProps) {
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [loading, setLoading] = useState(true)
    const [tickets, setTickets] = useState<any[]>([])
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium' })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        loadTickets()
    }, [projectId])

    const loadTickets = async () => {
        setLoading(true)
        const result = await getProjectTickets(projectId)
        setTickets(result.data || [])
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        await createTicket(projectId, formData)
        setShowModal(false)
        setFormData({ title: '', description: '', priority: 'medium' })
        setSubmitting(false)
        loadTickets()
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-500/20 text-red-400'
            case 'high': return 'bg-orange-500/20 text-orange-400'
            case 'medium': return 'bg-amber-500/20 text-amber-400'
            default: return 'bg-zinc-500/20 text-zinc-400'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'resolved':
            case 'closed':
                return <CheckCircle className="w-4 h-4 text-emerald-500" />
            case 'in_progress':
                return <Clock className="w-4 h-4 text-amber-500" />
            default:
                return <AlertCircle className="w-4 h-4 text-blue-500" />
        }
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-UY', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    const cardBg = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
    const textPrimary = isLight ? 'text-gray-900' : 'text-zinc-100'
    const textSecondary = isLight ? 'text-gray-500' : 'text-zinc-400'
    const inputClass = isLight ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-zinc-800 border-zinc-700 text-zinc-100'

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${textPrimary}`}>Tickets</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
                >
                    <Plus size={18} />
                    Nuevo Ticket
                </button>
            </div>

            {tickets.length === 0 ? (
                <div className={`border rounded-xl p-12 text-center ${cardBg}`}>
                    <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className={textSecondary}>No hay tickets todavía</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tickets.map((ticket: any) => (
                        <div key={ticket.id} className={`border rounded-xl p-4 ${cardBg} hover:${isLight ? 'bg-gray-50' : 'bg-zinc-800/50'} transition-colors`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {getStatusIcon(ticket.status)}
                                        <h3 className={`font-medium ${textPrimary}`}>{ticket.title}</h3>
                                    </div>
                                    {ticket.description && (
                                        <p className={`text-sm mb-3 line-clamp-2 ${textSecondary}`}>{ticket.description}</p>
                                    )}
                                    <div className={`text-xs ${textSecondary}`}>
                                        Creado {formatDate(ticket.created_at)}
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority === 'urgent' ? 'Urgente' :
                                        ticket.priority === 'high' ? 'Alta' :
                                            ticket.priority === 'medium' ? 'Media' : 'Baja'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className={`w-full max-w-md rounded-xl border p-6 ${cardBg}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-xl font-bold ${textPrimary}`}>Nuevo Ticket</h3>
                            <button onClick={() => setShowModal(false)} className={`p-2 rounded-lg ${isLight ? 'hover:bg-gray-100' : 'hover:bg-zinc-800'}`}>
                                <X size={20} className={textSecondary} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${textSecondary}`}>Título *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-violet-500 ${inputClass}`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${textSecondary}`}>Descripción</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-violet-500 ${inputClass}`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${textSecondary}`}>Prioridad</label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-violet-500 ${inputClass}`}
                                >
                                    <option value="low">Baja</option>
                                    <option value="medium">Media</option>
                                    <option value="high">Alta</option>
                                    <option value="urgent">Urgente</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 px-4 py-2 rounded-lg border ${isLight ? 'border-gray-300 text-gray-700' : 'border-zinc-700 text-zinc-300'}`}>
                                    Cancelar
                                </button>
                                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium disabled:opacity-50">
                                    {submitting ? 'Creando...' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
