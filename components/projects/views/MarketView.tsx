'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { getNeighborhoodStats } from '@/app/actions/project-actions'
import { Loader2, MapPin, ChevronDown, ChevronRight } from 'lucide-react'
import PlatformSelector from '@/components/projects/PlatformSelector'

interface NeighborhoodStat {
    neighborhood: string
    totalProperties: number
    totalAgencies: number
    avgPrice: number
    minPrice: number
    maxPrice: number
    topAgencies: { name: string; count: number }[]
    dominanceIndex: number
}

interface MarketViewProps {
    projectId: string
    selectedPlatform: string
    onPlatformChange: (platform: string) => void
}

export default function MarketView({ projectId, selectedPlatform, onPlatformChange }: MarketViewProps) {
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<NeighborhoodStat[]>([])
    const [expandedZone, setExpandedZone] = useState<string | null>(null)

    const loadData = async () => {
        setLoading(true)
        const result = await getNeighborhoodStats(projectId, {
            portal: selectedPlatform || undefined
        })
        setData(result.data || [])
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [projectId, selectedPlatform])

    const textPrimary = isLight ? 'text-gray-900' : 'text-zinc-100'
    const textSecondary = isLight ? 'text-gray-500' : 'text-zinc-400'
    const cardClass = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
    const headerClass = isLight ? 'bg-gray-50 text-gray-700' : 'bg-zinc-800/50 text-zinc-300'
    const rowClass = isLight ? 'hover:bg-gray-50 border-gray-100' : 'hover:bg-zinc-800/50 border-zinc-800'

    const dominanceLabel = (idx: number) => {
        if (idx >= 0.5) return { text: 'Concentrado', class: 'bg-red-500/15 text-red-500' }
        if (idx >= 0.25) return { text: 'Moderado', class: 'bg-amber-500/15 text-amber-500' }
        return { text: 'Distribuido', class: 'bg-emerald-500/15 text-emerald-500' }
    }

    // Summary stats
    const totalZones = data.length
    const totalProperties = data.reduce((s, d) => s + d.totalProperties, 0)
    const avgZonePrice = data.length > 0
        ? Math.round(data.filter(d => d.avgPrice > 0).reduce((s, d) => s + d.avgPrice, 0) / data.filter(d => d.avgPrice > 0).length)
        : 0

    return (
        <div className="space-y-4">
            <div>
                <h2 className={`text-xl font-bold ${textPrimary}`}>Inteligencia de Mercado</h2>
                <p className={`text-sm ${textSecondary} mt-1`}>
                    Datos de mercado por zona: precios, competencia e inmobiliarias activas
                </p>
            </div>

            <PlatformSelector
                selected={selectedPlatform}
                onChange={onPlatformChange}
            />

            {/* Summary Cards */}
            {!loading && data.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl border ${cardClass}`}>
                        <p className={`text-3xl font-bold ${textPrimary}`}>{totalZones}</p>
                        <p className={`text-xs font-medium uppercase tracking-wider ${textSecondary}`}>Zonas activas</p>
                    </div>
                    <div className={`p-4 rounded-xl border ${cardClass}`}>
                        <p className={`text-3xl font-bold ${textPrimary}`}>{totalProperties}</p>
                        <p className={`text-xs font-medium uppercase tracking-wider ${textSecondary}`}>Propiedades en zonas</p>
                    </div>
                    <div className={`p-4 rounded-xl border ${cardClass}`}>
                        <p className={`text-3xl font-bold ${textPrimary}`}>
                            {avgZonePrice > 0 ? `U$S ${(avgZonePrice / 1000).toFixed(0)}k` : '-'}
                        </p>
                        <p className={`text-xs font-medium uppercase tracking-wider ${textSecondary}`}>Precio promedio general</p>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className={`border rounded-xl overflow-hidden ${cardClass}`}>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <MapPin className="w-10 h-10 text-zinc-600" />
                        <p className={textSecondary}>No hay datos de mercado disponibles</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`${headerClass} border-b ${isLight ? 'border-gray-200' : 'border-zinc-800'}`}>
                                    <th className="w-10 px-2 py-3"></th>
                                    <th className="text-left px-4 py-3 font-medium">Zona</th>
                                    <th className="text-center px-4 py-3 font-medium">Props</th>
                                    <th className="text-center px-4 py-3 font-medium">Inmobiliarias</th>
                                    <th className="text-center px-4 py-3 font-medium">Precio Prom.</th>
                                    <th className="text-center px-4 py-3 font-medium">Rango</th>
                                    <th className="text-center px-4 py-3 font-medium">Competencia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(zone => {
                                    const isExpanded = expandedZone === zone.neighborhood
                                    const dom = dominanceLabel(zone.dominanceIndex)
                                    return (
                                        <React.Fragment key={zone.neighborhood}>
                                            <tr
                                                className={`${rowClass} transition-colors border-t ${isLight ? 'border-gray-100' : 'border-zinc-800/20'} cursor-pointer`}
                                                onClick={() => setExpandedZone(isExpanded ? null : zone.neighborhood)}
                                            >
                                                <td className="px-2 py-3 w-10">
                                                    {isExpanded
                                                        ? <ChevronDown size={18} className={textSecondary} />
                                                        : <ChevronRight size={18} className={textSecondary} />
                                                    }
                                                </td>
                                                <td className={`px-4 py-3 font-medium ${textPrimary} max-w-[250px]`}>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={14} className={textSecondary} />
                                                        <span className="truncate" title={zone.neighborhood}>{zone.neighborhood}</span>
                                                    </div>
                                                </td>
                                                <td className={`px-4 py-3 text-center font-semibold ${textPrimary}`}>
                                                    {zone.totalProperties}
                                                </td>
                                                <td className={`px-4 py-3 text-center ${textSecondary}`}>
                                                    {zone.totalAgencies}
                                                </td>
                                                <td className={`px-4 py-3 text-center ${textPrimary}`}>
                                                    {zone.avgPrice > 0 ? `U$S ${zone.avgPrice.toLocaleString()}` : '-'}
                                                </td>
                                                <td className={`px-4 py-3 text-center text-sm ${textSecondary}`}>
                                                    {zone.minPrice > 0 && zone.maxPrice > 0
                                                        ? `${(zone.minPrice / 1000).toFixed(0)}k - ${(zone.maxPrice / 1000).toFixed(0)}k`
                                                        : '-'
                                                    }
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${dom.class}`}>
                                                        {dom.text}
                                                    </span>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={7} className={`p-0 ${isLight ? 'bg-gray-50' : 'bg-zinc-900/30'}`}>
                                                        <div className={`px-6 py-4 border-t ${isLight ? 'border-gray-200' : 'border-zinc-800'}`}>
                                                            <h4 className={`text-sm font-semibold ${textPrimary} mb-3`}>
                                                                Top inmobiliarias en {zone.neighborhood}
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {zone.topAgencies.map((ag, idx) => (
                                                                    <div key={ag.name} className={`flex items-center justify-between py-1.5 ${idx > 0 ? `border-t ${isLight ? 'border-gray-200' : 'border-zinc-800/30'}` : ''}`}>
                                                                        <span className={`flex items-center gap-2 ${textPrimary}`}>
                                                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isLight ? 'bg-violet-100 text-violet-700' : 'bg-violet-500/20 text-violet-400'}`}>
                                                                                {idx + 1}
                                                                            </span>
                                                                            <span className="text-sm">{ag.name}</span>
                                                                        </span>
                                                                        <span className={`text-sm font-semibold ${textSecondary}`}>
                                                                            {ag.count} prop{ag.count !== 1 ? 's' : ''}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && data.length > 0 && (
                    <div className={`px-4 py-3 text-sm ${textSecondary} border-t ${isLight ? 'border-gray-200' : 'border-zinc-800'}`}>
                        {data.length} zona{data.length !== 1 ? 's' : ''} con actividad
                        {selectedPlatform && ` en ${selectedPlatform}`}
                    </div>
                )}
            </div>
        </div>
    )
}
