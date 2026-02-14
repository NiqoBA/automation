'use client'

import { useState, useEffect } from 'react'
import { getProjectUpdates, generateScraperAlerts } from '@/app/actions/project-actions'
import { useTheme } from '@/contexts/ThemeContext'
import { Bell, Info, Sparkles, Wrench, AlertTriangle, Loader2, GitCompareArrows, MapPin, TrendingUp, RefreshCw } from 'lucide-react'

interface UpdatesViewProps {
    projectId: string
}

export default function UpdatesView({ projectId }: UpdatesViewProps) {
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [updates, setUpdates] = useState<any[]>([])
    const [filter, setFilter] = useState<string>('all')

    const loadUpdates = async () => {
        setLoading(true)
        const result = await getProjectUpdates(projectId)
        setUpdates(result.data || [])
        setLoading(false)
    }

    useEffect(() => {
        loadUpdates()
    }, [projectId])

    const handleGenerateAlerts = async () => {
        setGenerating(true)
        const result = await generateScraperAlerts(projectId)
        setGenerating(false)
        if (result.error) {
            alert(result.error)
        } else {
            loadUpdates()
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'feature': return <Sparkles className="w-5 h-5 text-violet-500" />
            case 'fix': return <Wrench className="w-5 h-5 text-emerald-500" />
            case 'breaking': return <AlertTriangle className="w-5 h-5 text-red-500" />
            case 'alert_shared_property': return <GitCompareArrows className="w-5 h-5 text-amber-500" />
            case 'alert_new_agency_zone': return <MapPin className="w-5 h-5 text-blue-500" />
            case 'alert_high_activity': return <TrendingUp className="w-5 h-5 text-orange-500" />
            default: return <Info className="w-5 h-5 text-blue-500" />
        }
    }

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'feature': return { text: 'Nueva Función', class: 'bg-violet-500/20 text-violet-400' }
            case 'fix': return { text: 'Corrección', class: 'bg-emerald-500/20 text-emerald-400' }
            case 'breaking': return { text: 'Cambio Importante', class: 'bg-red-500/20 text-red-400' }
            case 'alert_shared_property': return { text: 'Propiedad Compartida', class: 'bg-amber-500/20 text-amber-400' }
            case 'alert_new_agency_zone': return { text: 'Nueva en Zona', class: 'bg-blue-500/20 text-blue-400' }
            case 'alert_high_activity': return { text: 'Alta Actividad', class: 'bg-orange-500/20 text-orange-400' }
            default: return { text: 'Información', class: 'bg-blue-500/20 text-blue-400' }
        }
    }

    const isAlertType = (type: string) => type.startsWith('alert_')

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-UY', { day: '2-digit', month: 'long', year: 'numeric' })
    }

    const filteredUpdates = updates.filter(u => {
        if (filter === 'all') return true
        if (filter === 'alerts') return isAlertType(u.update_type)
        if (filter === 'updates') return !isAlertType(u.update_type)
        return u.update_type === filter
    })

    const alertCount = updates.filter(u => isAlertType(u.update_type)).length
    const updateCount = updates.filter(u => !isAlertType(u.update_type)).length

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
            <div className="flex items-center justify-between gap-4">
                <h2 className={`text-xl font-bold ${textPrimary}`}>Actualizaciones y Alertas</h2>
                <button
                    onClick={handleGenerateAlerts}
                    disabled={generating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        generating ? 'opacity-50 cursor-not-allowed' : ''
                    } ${isLight ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-amber-600 text-white hover:bg-amber-700'}`}
                >
                    {generating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    {generating ? 'Generando...' : 'Generar alertas'}
                </button>
            </div>

            {/* Filter Tabs */}
            <div className={`flex items-center gap-1.5 p-1.5 rounded-xl border ${
                isLight ? 'bg-gray-50 border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
            }`}>
                {[
                    { id: 'all', label: 'Todos', count: updates.length },
                    { id: 'alerts', label: 'Alertas', count: alertCount },
                    { id: 'updates', label: 'Actualizaciones', count: updateCount },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            filter === tab.id
                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                                : isLight ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                        }`}
                    >
                        <span>{tab.label}</span>
                        {tab.count > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                                filter === tab.id
                                    ? 'bg-white/20'
                                    : isLight ? 'bg-gray-200 text-gray-600' : 'bg-zinc-700 text-zinc-300'
                            }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {filteredUpdates.length === 0 ? (
                <div className={`border rounded-xl p-12 text-center ${cardBg}`}>
                    <Bell className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className={textSecondary}>
                        {filter === 'alerts' ? 'No hay alertas. Haz clic en "Generar alertas" para analizar los datos.' : 'No hay actualizaciones todavía'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredUpdates.map((update: any) => {
                        const badge = getTypeBadge(update.update_type)
                        const isAlert = isAlertType(update.update_type)
                        return (
                            <div key={update.id} className={`border rounded-xl p-5 ${cardBg} ${
                                isAlert ? (isLight ? 'border-l-4 border-l-amber-400' : 'border-l-4 border-l-amber-500') : ''
                            } hover:${isLight ? 'bg-gray-50' : 'bg-zinc-800/50'} transition-colors`}>
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
                                            {!update.created_by && isAlert && <span> · Generado automáticamente</span>}
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
