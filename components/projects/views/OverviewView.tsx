'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { FileText, History, MessageSquare, Bell, Play, Pause, CheckCircle2, XCircle, Loader2, TrendingUp, Building2, Sparkles, Calendar, ChevronRight, GitCompareArrows, MapPin } from 'lucide-react'
import { updateProjectStatus } from '@/app/actions/master-admin'
import SharedPropertiesView from './SharedPropertiesView'
import MarketView from './MarketView'

interface PlatformStat {
    portal: string
    total: number
    agencies: number
    avgPrice: number
}

interface NewAgency {
    name: string
    portal: string
    firstSeen: string
    count: number
}

interface MonthlyStat {
    month: string
    portal: string
    total: number
    agencies: number
}

type OverviewSection = 'resumen' | 'compartidas' | 'mercado'

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
    platformStats?: PlatformStat[]
    newAgencies?: NewAgency[]
    monthlyStats?: MonthlyStat[]
    project: any
    userRole: string
    selectedPlatform: string
    onPlatformChange: (platform: string) => void
}

export default function OverviewView({
    projectId,
    stats,
    topAgencies = [],
    platformStats = [],
    newAgencies = [],
    monthlyStats = [],
    project,
    userRole,
    selectedPlatform,
    onPlatformChange,
}: OverviewViewProps) {
    const { theme } = useTheme()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const isLight = theme === 'light'
    const [status, setStatus] = useState(project?.status || 'active')
    const [updating, setUpdating] = useState(false)
    const [activeSection, setActiveSection] = useState<OverviewSection>('resumen')

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
        { label: 'Agencias', value: stats?.agencies || 0, icon: Building2, color: 'emerald' },
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

    const colorMap: Record<string, string> = {
        violet: isLight ? 'bg-violet-50 text-violet-600 border-violet-100' : 'bg-violet-500/10 text-violet-400 border-violet-500/10',
        blue: isLight ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-blue-500/10 text-blue-400 border-blue-500/10',
        emerald: isLight ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10',
        amber: isLight ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-amber-500/10 text-amber-400 border-amber-500/10',
    }

    const portalStyle = (portal: string) => {
        const p = portal.toLowerCase()
        if (p.includes('mercado'))
            return {
                bg: isLight ? 'bg-yellow-50 border-yellow-200' : 'bg-yellow-500/5 border-yellow-500/20',
                badge: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
                accent: 'text-yellow-600 dark:text-yellow-400',
            }
        if (p.includes('info'))
            return {
                bg: isLight ? 'bg-orange-50 border-orange-200' : 'bg-orange-500/5 border-orange-500/20',
                badge: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
                accent: 'text-orange-600 dark:text-orange-400',
            }
        if (p.includes('casas'))
            return {
                bg: isLight ? 'bg-blue-50 border-blue-200' : 'bg-blue-500/5 border-blue-500/20',
                badge: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
                accent: 'text-blue-600 dark:text-blue-400',
            }
        if (p.includes('gallito'))
            return {
                bg: isLight ? 'bg-cyan-50 border-cyan-200' : 'bg-cyan-500/5 border-cyan-500/20',
                badge: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400',
                accent: 'text-cyan-600 dark:text-cyan-400',
            }
        return {
            bg: isLight ? 'bg-gray-50 border-gray-200' : 'bg-zinc-800/50 border-zinc-700',
            badge: 'bg-zinc-500/20 text-zinc-500',
            accent: 'text-zinc-500',
        }
    }

    const formatMonth = (monthStr: string) => {
        const [year, month] = monthStr.split('-')
        const date = new Date(parseInt(year), parseInt(month) - 1)
        return date.toLocaleDateString('es-UY', { month: 'long', year: 'numeric' })
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-UY', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }

    const inmobiliariasVerMasHref = (() => {
        const p = new URLSearchParams(searchParams.toString())
        p.set('tab', 'inmobiliarias')
        p.set('soloNuevas', '1')
        return `${pathname}?${p.toString()}`
    })()

    // Group monthly stats by month
    const monthGroups: Record<string, MonthlyStat[]> = {}
    monthlyStats.forEach(stat => {
        if (!monthGroups[stat.month]) monthGroups[stat.month] = []
        monthGroups[stat.month].push(stat)
    })
    const sortedMonths = Object.keys(monthGroups).sort((a, b) => b.localeCompare(a))

    return (
        <div className="space-y-8">
            {/* Header + Status */}
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

            {/* Section Selector */}
            <div className={`flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border ${
                isLight ? 'bg-gray-50 border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
            }`}>
                {([
                    { id: 'resumen' as OverviewSection, label: 'Resumen', icon: TrendingUp, color: 'violet' },
                    { id: 'compartidas' as OverviewSection, label: 'Compartidas', icon: GitCompareArrows, color: 'amber' },
                    { id: 'mercado' as OverviewSection, label: 'Mercado', icon: MapPin, color: 'emerald' },
                ]).map(section => {
                    const Icon = section.icon
                    const isActive = activeSection === section.id
                    const activeColors: Record<string, string> = {
                        violet: 'bg-violet-600 text-white shadow-lg shadow-violet-500/25',
                        amber: 'bg-amber-500 text-black shadow-lg shadow-amber-500/25',
                        emerald: 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25',
                    }
                    return (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? activeColors[section.color]
                                    : isLight ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                            }`}
                        >
                            <Icon size={15} />
                            <span>{section.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Sub-view: Compartidas */}
            {activeSection === 'compartidas' && (
                <SharedPropertiesView projectId={projectId} />
            )}

            {/* Sub-view: Mercado */}
            {activeSection === 'mercado' && (
                <MarketView
                    projectId={projectId}
                    selectedPlatform={selectedPlatform}
                    onPlatformChange={onPlatformChange}
                />
            )}

            {/* Sub-view: Resumen (default) */}
            {activeSection === 'resumen' && <>

            {/* General Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {cards.map((card) => {
                    const Icon = card.icon
                    return (
                        <div
                            key={card.label}
                            className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${cardBg}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2.5 rounded-xl border ${colorMap[card.color]}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className={`text-3xl font-bold tracking-tight ${textPrimary}`}>{card.value}</p>
                                <p className={`text-xs font-medium uppercase tracking-wider ${textSecondary}`}>{card.label}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Platform Breakdown */}
            {platformStats.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className={`w-5 h-5 ${textSecondary}`} />
                        <h3 className={`text-lg font-bold ${textPrimary}`}>Desglose por Plataforma</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {platformStats.map((ps) => {
                            const style = portalStyle(ps.portal)
                            return (
                                <div
                                    key={ps.portal}
                                    className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] ${style.bg}`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${style.badge}`}>
                                            {ps.portal}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <p className={`text-2xl font-bold ${textPrimary}`}>{ps.total}</p>
                                            <p className={`text-[10px] uppercase tracking-wider font-medium ${textSecondary}`}>Propiedades</p>
                                        </div>
                                        <div>
                                            <p className={`text-2xl font-bold ${textPrimary}`}>{ps.agencies}</p>
                                            <p className={`text-[10px] uppercase tracking-wider font-medium ${textSecondary}`}>Inmobiliarias</p>
                                        </div>
                                        <div>
                                            <p className={`text-2xl font-bold ${textPrimary}`}>
                                                {ps.avgPrice > 0 ? `$${(ps.avgPrice / 1000).toFixed(0)}k` : '-'}
                                            </p>
                                            <p className={`text-[10px] uppercase tracking-wider font-medium ${textSecondary}`}>Precio Prom.</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* New Agencies */}
            {newAgencies.length > 0 && (
                <div className={`p-6 rounded-2xl border transition-all ${sectionBg}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <h3 className={`text-lg font-bold ${textPrimary}`}>
                            Inmobiliarias Nuevas
                            <span className={`ml-2 text-sm font-normal ${textSecondary}`}>(últimos 3 días)</span>
                        </h3>
                        <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">
                            {newAgencies.length} nueva{newAgencies.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`text-xs uppercase tracking-wider ${textSecondary}`}>
                                    <th className="text-left py-2 px-3 font-medium">Inmobiliaria</th>
                                    <th className="text-left py-2 px-3 font-medium">Portal</th>
                                    <th className="text-center py-2 px-3 font-medium">Propiedades</th>
                                    <th className="text-right py-2 px-3 font-medium">Primera aparición</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newAgencies.slice(0, 5).map((agency, idx) => {
                                    const style = portalStyle(agency.portal)
                                    return (
                                        <tr
                                            key={`${agency.name}-${agency.portal}-${idx}`}
                                            className={`border-t ${isLight ? 'border-gray-100' : 'border-zinc-800/30'}`}
                                        >
                                            <td className={`py-2.5 px-3 font-medium ${textPrimary}`}>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                                                    <span className="truncate max-w-[200px]" title={agency.name}>{agency.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${style.badge}`}>
                                                    {agency.portal}
                                                </span>
                                            </td>
                                            <td className={`py-2.5 px-3 text-center font-semibold ${textPrimary}`}>
                                                {agency.count}
                                            </td>
                                            <td className={`py-2.5 px-3 text-right text-sm ${textSecondary}`}>
                                                {formatDate(agency.firstSeen)}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    {newAgencies.length > 5 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
                            <Link
                                href={inmobiliariasVerMasHref}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
                            >
                                Ver más
                                <ChevronRight size={16} className="shrink-0" />
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* Monthly Evolution */}
            {sortedMonths.length > 0 && (
                <div className={`p-6 rounded-2xl border transition-all ${sectionBg}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <h3 className={`text-lg font-bold ${textPrimary}`}>Evolución Mensual</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`text-xs uppercase tracking-wider ${textSecondary}`}>
                                    <th className="text-left py-2 px-3 font-medium">Mes</th>
                                    <th className="text-left py-2 px-3 font-medium">Portal</th>
                                    <th className="text-center py-2 px-3 font-medium">Propiedades</th>
                                    <th className="text-center py-2 px-3 font-medium">Inmobiliarias</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedMonths.map((month, monthIdx) => {
                                    const stats = monthGroups[month]
                                    const monthTotal = stats.reduce((sum, s) => sum + s.total, 0)
                                    return stats.map((stat, idx) => {
                                        const style = portalStyle(stat.portal)
                                        const isFirstInMonth = idx === 0
                                        return (
                                            <tr
                                                key={`${month}-${stat.portal}`}
                                                className={`border-t ${isLight ? 'border-gray-100' : 'border-zinc-800/30'} ${
                                                    isFirstInMonth && monthIdx > 0
                                                        ? isLight ? 'border-t-gray-300' : 'border-t-zinc-700'
                                                        : ''
                                                }`}
                                            >
                                                <td className={`py-2.5 px-3 ${textPrimary}`}>
                                                    {isFirstInMonth ? (
                                                        <div>
                                                            <span className="font-semibold capitalize">{formatMonth(month)}</span>
                                                            <span className={`ml-2 text-xs ${textSecondary}`}>({monthTotal} total)</span>
                                                        </div>
                                                    ) : null}
                                                </td>
                                                <td className="py-2.5 px-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${style.badge}`}>
                                                        {stat.portal}
                                                    </span>
                                                </td>
                                                <td className={`py-2.5 px-3 text-center font-semibold ${textPrimary}`}>
                                                    {stat.total}
                                                </td>
                                                <td className={`py-2.5 px-3 text-center ${textSecondary}`}>
                                                    {stat.agencies}
                                                </td>
                                            </tr>
                                        )
                                    })
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Top Agencies */}
            {topAgencies.length > 0 && (
                <div className={`p-6 rounded-2xl border transition-all ${sectionBg}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <Building2 className="w-5 h-5 text-emerald-500" />
                        <h3 className={`text-lg font-bold ${textPrimary}`}>Top Inmobiliarias</h3>
                    </div>
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

            </>}
        </div>
    )
}
