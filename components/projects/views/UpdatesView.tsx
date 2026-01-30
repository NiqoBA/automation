'use client'

import { useState, useEffect } from 'react'
import { getProjectUpdates } from '@/app/actions/project-actions'
import { useTheme } from '@/contexts/ThemeContext'
import { Bell, Info, Sparkles, Wrench, AlertTriangle, Loader2 } from 'lucide-react'

interface UpdatesViewProps {
    projectId: string
}

export default function UpdatesView({ projectId }: UpdatesViewProps) {
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [loading, setLoading] = useState(true)
    const [updates, setUpdates] = useState<any[]>([])

    useEffect(() => {
        const loadUpdates = async () => {
            setLoading(true)
            const result = await getProjectUpdates(projectId)
            setUpdates(result.data || [])
            setLoading(false)
        }
        loadUpdates()
    }, [projectId])

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'feature': return <Sparkles className="w-5 h-5 text-violet-500" />
            case 'fix': return <Wrench className="w-5 h-5 text-emerald-500" />
            case 'breaking': return <AlertTriangle className="w-5 h-5 text-red-500" />
            default: return <Info className="w-5 h-5 text-blue-500" />
        }
    }

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'feature': return { text: 'Nueva Función', class: 'bg-violet-500/20 text-violet-400' }
            case 'fix': return { text: 'Corrección', class: 'bg-emerald-500/20 text-emerald-400' }
            case 'breaking': return { text: 'Cambio Importante', class: 'bg-red-500/20 text-red-400' }
            default: return { text: 'Información', class: 'bg-blue-500/20 text-blue-400' }
        }
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-UY', { day: '2-digit', month: 'long', year: 'numeric' })
    }

    const cardBg = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
    const textPrimary = isLight ? 'text-gray-900' : 'text-zinc-100'
    const textSecondary = isLight ? 'text-gray-500' : 'text-zinc-400'

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h2 className={`text-xl font-bold ${textPrimary}`}>Actualizaciones</h2>

            {updates.length === 0 ? (
                <div className={`border rounded-xl p-12 text-center ${cardBg}`}>
                    <Bell className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className={textSecondary}>No hay actualizaciones todavía</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {updates.map((update: any) => {
                        const badge = getTypeBadge(update.update_type)
                        return (
                            <div key={update.id} className={`border rounded-xl p-5 ${cardBg} hover:${isLight ? 'bg-gray-50' : 'bg-zinc-800/50'} transition-colors`}>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">{getTypeIcon(update.update_type)}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className={`font-semibold ${textPrimary}`}>{update.title}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.class}`}>{badge.text}</span>
                                        </div>
                                        {update.content && (
                                            <p className={`text-sm mb-3 whitespace-pre-wrap ${textSecondary}`}>{update.content}</p>
                                        )}
                                        <div className={`text-xs ${textSecondary}`}>
                                            {formatDate(update.created_at)}
                                            {update.created_by_profile && <span> · {update.created_by_profile.full_name}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
