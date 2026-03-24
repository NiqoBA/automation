'use client'

import { useState, useEffect } from 'react'
import { getProjectUpdates, generateScraperAlerts, checkSystemHealth } from '@/app/actions/project-actions'
import { useTheme } from '@/contexts/ThemeContext'
import {
    Bell, Info, Sparkles, Wrench, AlertTriangle, Loader2, GitCompareArrows, MapPin,
    TrendingUp, RefreshCw, ShieldAlert, Server, Activity, Calendar, Shield
} from 'lucide-react'

interface UpdatesViewProps {
    projectId: string
    userRole?: string
}

type ChannelFilter = 'all' | 'technical' | 'functional' | 'manual'

export default function UpdatesView({ projectId, userRole }: UpdatesViewProps) {
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [updates, setUpdates] = useState<any[]>([])
    const [channelFilter, setChannelFilter] = useState<ChannelFilter>('all')
    const [healthStatus, setHealthStatus] = useState<any>(null)
    const [checkingHealth, setCheckingHealth] = useState(false)
    const isMasterAdmin = userRole === 'master_admin'

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

    const handleCheckHealth = async () => {
        setCheckingHealth(true)
        const result = await checkSystemHealth(projectId)
        setHealthStatus(result.data || null)
        setCheckingHealth(false)
    }

    const getTypeIcon = (update: any) => {
        if (update.channel === 'technical') {
            switch (update.severity) {
                case 'critical': return <ShieldAlert className="w-5 h-5 text-red-500" />
                case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />
                default: return <Server className="w-5 h-5 text-blue-400" />
            }
        }
        switch (update.update_type) {
            case 'feature': return <Sparkles className="w-5 h-5 text-violet-500" />
            case 'fix': return <Wrench className="w-5 h-5 text-emerald-500" />
            case 'breaking': return <AlertTriangle className="w-5 h-5 text-red-500" />
            case 'alert_shared_property': return <GitCompareArrows className="w-5 h-5 text-amber-500" />
            case 'alert_new_agency_zone': return <MapPin className="w-5 h-5 text-blue-500" />
            case 'alert_high_activity': return <TrendingUp className="w-5 h-5 text-orange-500" />
            case 'alert_daily_properties': return <Calendar className="w-5 h-5 text-emerald-500" />
            default: return <Info className="w-5 h-5 text-blue-500" />
        }
    }

    const getTypeBadge = (update: any) => {
        if (update.channel === 'technical') {
            const sevMap: Record<string, { text: string; class: string }> = {
                critical: { text: 'Crítico', class: 'bg-red-500/20 text-red-400' },
                warning: { text: 'Advertencia', class: 'bg-amber-500/20 text-amber-400' },
                info: { text: 'Info técnica', class: 'bg-blue-500/20 text-blue-400' },
            }
            return sevMap[update.severity || 'info'] || sevMap.info
        }
        const typeMap: Record<string, { text: string; class: string }> = {
            feature: { text: 'Nueva Función', class: 'bg-violet-500/20 text-violet-400' },
            fix: { text: 'Corrección', class: 'bg-emerald-500/20 text-emerald-400' },
            breaking: { text: 'Cambio Importante', class: 'bg-red-500/20 text-red-400' },
            alert_shared_property: { text: 'Propiedad Compartida', class: 'bg-amber-500/20 text-amber-400' },
            alert_new_agency_zone: { text: 'Nueva en Zona', class: 'bg-blue-500/20 text-blue-400' },
            alert_high_activity: { text: 'Alta Actividad', class: 'bg-orange-500/20 text-orange-400' },
            alert_daily_properties: { text: 'Propiedades del día', class: 'bg-emerald-500/20 text-emerald-400' },
        }
        return typeMap[update.update_type] || { text: 'Información', class: 'bg-blue-500/20 text-blue-400' }
    }

    const getBorderColor = (update: any) => {
        if (update.channel === 'technical') {
            if (update.severity === 'critical') return isLight ? 'border-l-red-500' : 'border-l-red-500'
            if (update.severity === 'warning') return isLight ? 'border-l-amber-400' : 'border-l-amber-500'
            return isLight ? 'border-l-blue-300' : 'border-l-blue-500'
        }
        if (update.update_type?.startsWith('alert_')) {
            return isLight ? 'border-l-violet-400' : 'border-l-violet-500'
        }
        return ''
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-UY', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    const isManual = (u: any) => !u.update_type?.startsWith('alert_') && u.channel !== 'technical'

    const filteredUpdates = updates.filter(u => {
        if (channelFilter === 'all') return isMasterAdmin ? true : u.channel !== 'technical'
        if (channelFilter === 'technical') return u.channel === 'technical'
        if (channelFilter === 'functional') return u.channel === 'functional' && u.update_type?.startsWith('alert_')
        if (channelFilter === 'manual') return isManual(u)
        return true
    })

    const technicalCount = updates.filter(u => u.channel === 'technical').length
    const functionalCount = updates.filter(u => u.channel === 'functional' && u.update_type?.startsWith('alert_')).length
    const manualCount = updates.filter(u => isManual(u)).length
    const criticalCount = updates.filter(u => u.channel === 'technical' && u.severity === 'critical').length

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

    const tabs: { id: ChannelFilter; label: string; count: number; color: string; hidden?: boolean }[] = [
        { id: 'all', label: 'Todos', count: updates.length, color: 'violet' },
        { id: 'technical', label: 'Técnicas', count: technicalCount, color: 'red', hidden: !isMasterAdmin },
        { id: 'functional', label: 'Funcionales', count: functionalCount, color: 'emerald' },
        { id: 'manual', label: 'Actualizaciones', count: manualCount, color: 'blue' },
    ]

    const tabColors: Record<string, string> = {
        violet: 'bg-violet-600 text-white shadow-lg shadow-violet-500/25',
        red: 'bg-red-600 text-white shadow-lg shadow-red-500/25',
        emerald: 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25',
        blue: 'bg-blue-600 text-white shadow-lg shadow-blue-500/25',
    }

    const healthDot = healthStatus
        ? healthStatus.status === 'healthy'
            ? 'bg-emerald-500'
            : healthStatus.status === 'warning'
            ? 'bg-amber-500'
            : 'bg-red-500'
        : 'bg-zinc-500'

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <h2 className={`text-xl font-bold ${textPrimary}`}>Actualizaciones y Alertas</h2>
                <div className="flex items-center gap-2">
                    {isMasterAdmin && (
                        <button
                            onClick={handleCheckHealth}
                            disabled={checkingHealth}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                checkingHealth ? 'opacity-50 cursor-not-allowed' : ''
                            } ${isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                        >
                            {checkingHealth ? <Loader2 size={14} className="animate-spin" /> : <Activity size={14} />}
                            Health Check
                        </button>
                    )}
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
            </div>

            {/* Health Check Banner */}
            {healthStatus && isMasterAdmin && (
                <div className={`border rounded-xl p-4 ${
                    healthStatus.status === 'healthy'
                        ? isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-900/20 border-emerald-800'
                        : healthStatus.status === 'warning'
                        ? isLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-900/20 border-amber-800'
                        : isLight ? 'bg-red-50 border-red-200' : 'bg-red-900/20 border-red-800'
                }`}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${healthDot} animate-pulse`} />
                        <span className={`font-semibold text-sm ${textPrimary}`}>
                            Estado del sistema: {healthStatus.status === 'healthy' ? 'Saludable' : healthStatus.status === 'warning' ? 'Con advertencias' : 'Problemas detectados'}
                        </span>
                        <span className={`text-xs ${textSecondary}`}>
                            {healthStatus.totalProperties} propiedades · Último log: {healthStatus.lastLogAt ? new Date(healthStatus.lastLogAt).toLocaleString('es-UY') : 'Ninguno'}
                        </span>
                    </div>
                    {healthStatus.issues.length > 0 && (
                        <div className="space-y-1 mt-2">
                            {healthStatus.issues.map((issue: any, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    {issue.severity === 'critical'
                                        ? <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0" />
                                        : <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                    }
                                    <span className={textSecondary}>{issue.message}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Channel Tabs */}
            <div className={`flex items-center gap-1.5 p-1.5 rounded-xl border ${
                isLight ? 'bg-gray-50 border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
            }`}>
                {tabs.filter(t => !t.hidden).map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setChannelFilter(tab.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            channelFilter === tab.id
                                ? tabColors[tab.color]
                                : isLight ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                        }`}
                    >
                        {tab.id === 'technical' && <Shield size={14} />}
                        <span>{tab.label}</span>
                        {tab.count > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                                channelFilter === tab.id
                                    ? 'bg-white/20'
                                    : tab.id === 'technical' && criticalCount > 0
                                    ? 'bg-red-500/20 text-red-400'
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
                        {channelFilter === 'technical'
                            ? 'Sin alertas técnicas. El sistema está funcionando correctamente.'
                            : channelFilter === 'functional'
                            ? 'No hay alertas funcionales. Haz clic en "Generar alertas" para analizar datos.'
                            : 'No hay actualizaciones todavía.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredUpdates.map((update: any) => {
                        const badge = getTypeBadge(update)
                        const borderColor = getBorderColor(update)
                        return (
                            <div key={update.id} className={`border rounded-xl p-5 ${cardBg} ${
                                borderColor ? `border-l-4 ${borderColor}` : ''
                            } hover:${isLight ? 'bg-gray-50' : 'bg-zinc-800/50'} transition-colors`}>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">{getTypeIcon(update)}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 className={`font-semibold ${textPrimary}`}>{update.title}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.class}`}>{badge.text}</span>
                                            {update.channel === 'technical' && (
                                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-zinc-500/20 text-zinc-400">Técnica</span>
                                            )}
                                            {update.tier && (
                                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-500/15 text-purple-400">{update.tier}</span>
                                            )}
                                        </div>
                                        {update.content && (
                                            <p className={`text-sm mb-3 whitespace-pre-wrap ${textSecondary}`}>{update.content}</p>
                                        )}
                                        <div className={`text-xs ${textSecondary}`}>
                                            {formatDate(update.created_at)}
                                            {update.created_by_profile && <span> · {update.created_by_profile.full_name}</span>}
                                            {!update.created_by && update.update_type?.startsWith('alert_') && <span> · Generado automáticamente</span>}
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
