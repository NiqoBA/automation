'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { FileText, History, MessageSquare, Bell, Play, Pause, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { updateProjectStatus } from '@/app/actions/master-admin'

interface OverviewViewProps {
    projectId: string
    stats: {
        properties: number
        logs: number
        tickets: number
        updates: number
        agencies: number
    }
    topAgencies?: { name: string; count: number }[]
    project: any
    userRole: string
}

export default function OverviewView({ projectId, stats, topAgencies = [], project, userRole }: OverviewViewProps) {
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [status, setStatus] = useState(project?.status || 'active')
    const [updating, setUpdating] = useState(false)

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === status) return
        setUpdating(true)
        const result = await updateProjectStatus(projectId, newStatus as any)
        if (result.success) {
            setStatus(newStatus)
        } else {
            alert('Error al actualizar el estado')
        }
        setUpdating(false)
    }

    const cards = [
        { label: 'Propiedades', value: stats?.properties || 0, icon: FileText, color: 'violet' },
        { label: 'Logs de Ejecución', value: stats?.logs || 0, icon: History, color: 'blue' },
        { label: 'Tickets', value: stats?.tickets || 0, icon: MessageSquare, color: 'emerald' },
        { label: 'Actualizaciones', value: stats?.updates || 0, icon: Bell, color: 'amber' },
        { label: 'Agencias', value: stats?.agencies || 0, icon: FileText, color: 'emerald' },
    ]

    const cardBg = isLight ? 'bg-white border-gray-200 hover:bg-gray-50' : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50'
    const textPrimary = isLight ? 'text-gray-900' : 'text-zinc-100'
    const textSecondary = isLight ? 'text-gray-500' : 'text-zinc-400'
    const sectionBg = isLight ? 'bg-white border-gray-100' : 'bg-zinc-900/30 border-zinc-800/50'

    const statusOptions = [
        { id: 'active', label: 'Activo', icon: Play, color: 'text-emerald-500', variant: 'success' },
        { id: 'paused', label: 'Pausado', icon: Pause, color: 'text-amber-500', variant: 'warning' },
        { id: 'completed', label: 'Completado', icon: CheckCircle2, color: 'text-blue-500', variant: 'info' },
        { id: 'cancelled', label: 'Cancelado', icon: XCircle, color: 'text-red-500', variant: 'default' },
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-2xl font-bold ${textPrimary}`}>Resumen del Proyecto</h2>
                    <p className={`text-sm ${textSecondary} mt-1`}>Vista general de actividad y estado</p>
                </div>

                {userRole === 'master_admin' && (
                    <div className={`flex items-center gap-2 p-1.5 rounded-xl border transition-colors ${sectionBg}`}>
                        <span className={`text-xs font-semibold px-2 uppercase tracking-wider ${textSecondary}`}>Estado:</span>
                        <div className="flex items-center gap-1">
                            {statusOptions.map((opt) => {
                                const Icon = opt.icon
                                const isActive = status === opt.id
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleStatusChange(opt.id)}
                                        disabled={updating}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive
                                            ? isLight
                                                ? 'bg-gray-100 text-gray-900 shadow-sm'
                                                : 'bg-zinc-800 text-white shadow-sm'
                                            : isLight
                                                ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                                            } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {updating && isActive ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                            <Icon className={`w-3.5 h-3.5 ${isActive ? opt.color : ''}`} />
                                        )}
                                        {opt.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => {
                    const Icon = card.icon
                    const isAgencies = card.label === 'Agencias'
                    const colorMap: any = {
                        violet: isLight ? 'bg-violet-50 text-violet-600 border-violet-100' : 'bg-violet-500/10 text-violet-400 border-violet-500/10',
                        blue: isLight ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-blue-500/10 text-blue-400 border-blue-500/10',
                        emerald: isLight ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10',
                        amber: isLight ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-amber-500/10 text-amber-400 border-amber-500/10',
                    }

                    return (
                        <div
                            key={card.label}
                            className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${cardBg} 
                            ${isAgencies ? 'lg:col-span-1' : ''}`}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className={`p-3 rounded-xl border ${colorMap[card.color]}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className={`text-4xl font-bold tracking-tight ${textPrimary}`}>{card.value}</p>
                                <p className={`text-sm font-medium uppercase tracking-wider ${textSecondary}`}>{card.label}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {topAgencies.length > 0 && (
                <div className={`p-6 rounded-2xl border transition-all ${sectionBg}`}>
                    <h3 className={`text-lg font-bold ${textPrimary} mb-4`}>Inmobiliarias con más propiedades</h3>
                    <ul className="space-y-3">
                        {topAgencies.map((agency, idx) => (
                            <li
                                key={agency.name}
                                className={`flex items-center justify-between gap-4 py-2 border-b ${isLight ? 'border-gray-200' : 'border-zinc-800/30'} last:border-0`}
                            >
                                <span className={`flex items-center gap-2 ${textPrimary}`}>
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                        {idx + 1}
                                    </span>
                                    <span className="truncate" title={agency.name}>{agency.name}</span>
                                </span>
                                <span className={`text-sm font-semibold shrink-0 ${textSecondary}`}>
                                    {agency.count} {agency.count === 1 ? 'propiedad' : 'propiedades'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

