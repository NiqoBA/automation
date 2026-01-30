'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { FileText, History, MessageSquare, Bell } from 'lucide-react'
import Link from 'next/link'

interface OverviewViewProps {
    projectId: string
    stats: {
        properties: number
        logs: number
        tickets: number
        updates: number
    }
}

export default function OverviewView({ projectId, stats }: OverviewViewProps) {
    const { theme } = useTheme()
    const isLight = theme === 'light'

    const cards = [
        { label: 'Propiedades', value: stats?.properties || 0, icon: FileText, color: 'violet' },
        { label: 'Logs de Ejecución', value: stats?.logs || 0, icon: History, color: 'blue' },
        { label: 'Tickets', value: stats?.tickets || 0, icon: MessageSquare, color: 'emerald' },
        { label: 'Actualizaciones', value: stats?.updates || 0, icon: Bell, color: 'amber' },
    ]

    const cardBg = isLight ? 'bg-white border-gray-200 hover:bg-gray-50' : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50'
    const textPrimary = isLight ? 'text-gray-900' : 'text-zinc-100'
    const textSecondary = isLight ? 'text-gray-500' : 'text-zinc-400'

    return (
        <div className="space-y-6">
            <h2 className={`text-xl font-bold ${textPrimary}`}>Resumen del Proyecto</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card) => {
                    const Icon = card.icon
                    return (
                        <div
                            key={card.label}
                            className={`p-6 rounded-xl border transition-all cursor-pointer ${cardBg}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${isLight ? `bg-${card.color}-100` : `bg-${card.color}-500/20`}`}>
                                    <Icon className={`w-6 h-6 ${isLight ? `text-${card.color}-600` : `text-${card.color}-500`}`} />
                                </div>
                            </div>
                            <p className={`text-3xl font-bold ${textPrimary} mb-1`}>{card.value}</p>
                            <p className={`text-sm ${textSecondary}`}>{card.label}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
