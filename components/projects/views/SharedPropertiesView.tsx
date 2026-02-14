'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { getSharedProperties, detectSharedProperties } from '@/app/actions/project-actions'
import { ExternalLink, Loader2, RefreshCw, AlertTriangle, Building2 } from 'lucide-react'

interface SharedPropertiesViewProps {
    projectId: string
}

export default function SharedPropertiesView({ projectId }: SharedPropertiesViewProps) {
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [loading, setLoading] = useState(true)
    const [detecting, setDetecting] = useState(false)
    const [data, setData] = useState<any[]>([])

    const loadData = async () => {
        setLoading(true)
        const result = await getSharedProperties(projectId)
        setData(result.data || [])
        setLoading(false)
    }

    const runDetection = async () => {
        setDetecting(true)
        const result = await detectSharedProperties(projectId)
        setDetecting(false)
        if (result.error) {
            alert(result.error)
        } else {
            loadData()
        }
    }

    useEffect(() => {
        loadData()
    }, [projectId])

    const textPrimary = isLight ? 'text-gray-900' : 'text-zinc-100'
    const textSecondary = isLight ? 'text-gray-500' : 'text-zinc-400'
    const cardClass = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
    const headerClass = isLight ? 'bg-gray-50 text-gray-700' : 'bg-zinc-800/50 text-zinc-300'
    const rowClass = isLight ? 'hover:bg-gray-50 border-gray-100' : 'hover:bg-zinc-800/50 border-zinc-800'

    const portalBadge = (portal: string) => {
        const p = (portal || '').toLowerCase()
        if (p.includes('mercado')) return 'bg-yellow-500/20 text-yellow-500'
        if (p.includes('info')) return 'bg-orange-500/20 text-orange-500'
        if (p.includes('casas') || p.includes('gallito')) return 'bg-blue-500/20 text-blue-500'
        return 'bg-zinc-500/20 text-zinc-500'
    }

    const formatDate = (d: string) => new Date(d).toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className={`text-xl font-bold ${textPrimary}`}>Propiedades Compartidas</h2>
                    <p className={`text-sm ${textSecondary} mt-1`}>
                        Propiedades publicadas por diferentes inmobiliarias (misma zona + mismo precio)
                    </p>
                </div>
                <button
                    onClick={runDetection}
                    disabled={detecting}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        detecting ? 'opacity-50 cursor-not-allowed' : ''
                    } ${isLight ? 'bg-violet-100 text-violet-700 hover:bg-violet-200' : 'bg-violet-600 text-white hover:bg-violet-700'}`}
                >
                    {detecting ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    {detecting ? 'Detectando...' : 'Re-detectar'}
                </button>
            </div>

            <div className={`border rounded-xl overflow-hidden ${cardClass}`}>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <AlertTriangle className="w-10 h-10 text-zinc-600" />
                        <p className={textSecondary}>No se detectaron propiedades compartidas</p>
                        <button
                            onClick={runDetection}
                            disabled={detecting}
                            className="mt-2 text-sm text-violet-500 hover:text-violet-400 font-medium"
                        >
                            Ejecutar detección
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={`px-6 py-3 border-b ${isLight ? 'border-gray-200' : 'border-zinc-800'} flex items-center gap-2`}>
                            <Building2 size={16} className="text-amber-500" />
                            <span className={`text-sm font-medium ${textPrimary}`}>
                                {data.length} coincidencia{data.length !== 1 ? 's' : ''} detectada{data.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className={`${headerClass} border-b ${isLight ? 'border-gray-200' : 'border-zinc-800'}`}>
                                        <th className="text-left px-4 py-3 font-medium">Barrio</th>
                                        <th className="text-center px-4 py-3 font-medium">Precio</th>
                                        <th className="text-left px-4 py-3 font-medium">Inmobiliaria A</th>
                                        <th className="text-center px-4 py-3 font-medium">Portal A</th>
                                        <th className="text-left px-4 py-3 font-medium">Inmobiliaria B</th>
                                        <th className="text-center px-4 py-3 font-medium">Portal B</th>
                                        <th className="text-center px-4 py-3 font-medium">Links</th>
                                        <th className="text-right px-4 py-3 font-medium">Detectado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item: any) => (
                                        <tr
                                            key={item.id}
                                            className={`${rowClass} transition-colors border-t ${isLight ? 'border-gray-100' : 'border-zinc-800/20'}`}
                                        >
                                            <td className={`px-4 py-3 font-medium ${textPrimary} max-w-[200px] truncate`} title={item.neighborhood}>
                                                {item.neighborhood || '-'}
                                            </td>
                                            <td className={`px-4 py-3 text-center font-bold ${textPrimary}`}>
                                                U$S {Number(item.price).toLocaleString()}
                                            </td>
                                            <td className={`px-4 py-3 ${textPrimary} max-w-[180px] truncate`} title={item.agency_a}>
                                                {item.agency_a}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {item.property?.portal && (
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${portalBadge(item.property.portal)}`}>
                                                        {item.property.portal}
                                                    </span>
                                                )}
                                            </td>
                                            <td className={`px-4 py-3 ${textPrimary} max-w-[180px] truncate`} title={item.agency_b}>
                                                {item.agency_b}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {item.matched_property?.portal && (
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${portalBadge(item.matched_property.portal)}`}>
                                                        {item.matched_property.portal}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    {item.property?.link && (
                                                        <a href={item.property.link} target="_blank" rel="noopener noreferrer"
                                                            className="p-1 rounded text-violet-500 hover:bg-violet-500/10" title={`Ver ${item.agency_a}`}>
                                                            <ExternalLink size={14} />
                                                        </a>
                                                    )}
                                                    {item.matched_property?.link && (
                                                        <a href={item.matched_property.link} target="_blank" rel="noopener noreferrer"
                                                            className="p-1 rounded text-amber-500 hover:bg-amber-500/10" title={`Ver ${item.agency_b}`}>
                                                            <ExternalLink size={14} />
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={`px-4 py-3 text-right text-sm ${textSecondary}`}>
                                                {formatDate(item.detected_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
