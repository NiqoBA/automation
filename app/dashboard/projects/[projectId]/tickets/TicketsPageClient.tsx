'use client'

import { useState } from 'react'
import { getProjectTickets } from '@/app/actions/project-actions'
import CreateTicketModal from '@/components/projects/CreateTicketModal'
import { Plus, MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface TicketsPageClientProps {
    projectId: string
    initialTickets: any[]
}

export default function TicketsPageClient({ projectId, initialTickets }: TicketsPageClientProps) {
    const [showModal, setShowModal] = useState(false)
    const [tickets] = useState(initialTickets)

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
        return new Date(date).toLocaleDateString('es-UY', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-zinc-100">Tickets</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
                >
                    <Plus size={18} />
                    Nuevo Ticket
                </button>
            </div>

            {tickets.length === 0 ? (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400 mb-4">No hay tickets todavía</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="text-violet-400 hover:text-violet-300 font-medium"
                    >
                        Crear el primer ticket
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {tickets.map((ticket: any) => (
                        <div
                            key={ticket.id}
                            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:bg-zinc-800/50 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {getStatusIcon(ticket.status)}
                                        <h3 className="text-zinc-100 font-medium">{ticket.title}</h3>
                                    </div>
                                    {ticket.description && (
                                        <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{ticket.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                                        <span>Creado {formatDate(ticket.created_at)}</span>
                                        {ticket.created_by_profile && (
                                            <span>por {ticket.created_by_profile.full_name}</span>
                                        )}
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

            <CreateTicketModal
                projectId={projectId}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </div>
    )
}
