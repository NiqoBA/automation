'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { Search, MessageCircle, ChevronDown, ChevronRight, ChevronUp, ArrowUpDown, ExternalLink, Loader2, Merge } from 'lucide-react'
import { getProjectProperties, consolidateAgencies, getEnrichedAgencies } from '@/app/actions/project-actions'
import PlatformSelector from '@/components/projects/PlatformSelector'

interface EnrichedAgency {
    name: string
    count: number
    phone: string
    portals: string[]
    avgPrice: number
    minPrice: number
    maxPrice: number
    neighborhoodCount: number
    publicationsPerWeek: number
    activityScore: number
    firstSeen: string
    lastSeen: string
    isNew: boolean
}

interface InmobiliariasViewProps {
    projectId: string
    selectedPlatform: string
    onPlatformChange: (platform: string) => void
}

export default function InmobiliariasView({ projectId, selectedPlatform, onPlatformChange }: InmobiliariasViewProps) {
    const router = useRouter()
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [search, setSearch] = useState('')
    const [expandedAgency, setExpandedAgency] = useState<string | null>(null)
    const [propertiesCache, setPropertiesCache] = useState<Record<string, { loading: boolean; data: any[] }>>({})
    const [selectedAgencies, setSelectedAgencies] = useState<Set<string>>(new Set())
    const [consolidateModal, setConsolidateModal] = useState<{ a: EnrichedAgency; b: EnrichedAgency } | null>(null)
    const [consolidating, setConsolidating] = useState(false)
    const [onlyNew, setOnlyNew] = useState(false)
    const [agencies, setAgencies] = useState<EnrichedAgency[]>([])
    const [loading, setLoading] = useState(true)
    const [platformCounts, setPlatformCounts] = useState<Record<string, number>>({})
    const [sortColumn, setSortColumn] = useState<'count' | 'avgPrice' | 'neighborhoodCount' | 'activityScore'>('count')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

    const normAccent = (s: string) =>
        (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

    // Load agencies data
    const loadAgencies = async () => {
        setLoading(true)
        const result = await getEnrichedAgencies(projectId, {
            portal: selectedPlatform || undefined,
            onlyNew: false, // We filter client-side to keep both lists
        })
        if (result.data) {
            setAgencies(result.data)
        }
        setLoading(false)
    }

    // Load platform counts for selector
    useEffect(() => {
        const loadCounts = async () => {
            const result = await getEnrichedAgencies(projectId)
            if (result.data) {
                const counts: Record<string, number> = {}
                result.data.forEach((a: EnrichedAgency) => {
                    a.portals.forEach(p => {
                        counts[p] = (counts[p] || 0) + 1
                    })
                })
                setPlatformCounts(counts)
            }
        }
        loadCounts()
    }, [projectId])

    useEffect(() => {
        loadAgencies()
        setExpandedAgency(null)
        setPropertiesCache({})
    }, [projectId, selectedPlatform])

    const searchParams = useSearchParams()
    useEffect(() => {
        if (searchParams.get('soloNuevas') === '1') setOnlyNew(true)
    }, [searchParams])

    const filtered = agencies
        .filter(a => !search.trim() || normAccent(a.name).includes(normAccent(search.trim())))
        .filter(a => !onlyNew || a.isNew)

    const sorted = [...filtered].sort((a, b) => {
        const valA = (a as any)[sortColumn] || 0
        const valB = (b as any)[sortColumn] || 0
        if (sortDir === 'asc') return valA > valB ? 1 : -1
        return valA < valB ? 1 : -1
    })

    const newCount = agencies.filter(a => a.isNew).length

    useEffect(() => {
        if (!expandedAgency) return
        if (propertiesCache[expandedAgency]) return
        setPropertiesCache((prev) => ({ ...prev, [expandedAgency]: { loading: true, data: [] } }))
        getProjectProperties(projectId, {
            agency: expandedAgency,
            portal: selectedPlatform || undefined,
            perPage: 200,
        })
            .then((res) => {
                const data = res?.data?.properties ?? []
                setPropertiesCache((prev) => ({ ...prev, [expandedAgency]: { loading: false, data } }))
            })
            .catch(() => {
                setPropertiesCache((prev) => ({ ...prev, [expandedAgency]: { loading: false, data: [] } }))
            })
    }, [expandedAgency, projectId, selectedPlatform])

    const toggleExpand = (agencyName: string) => {
        setExpandedAgency((prev) => (prev === agencyName ? null : agencyName))
    }

    const toggleSelect = (_e: React.MouseEvent | React.ChangeEvent, agency: EnrichedAgency) => {
        setSelectedAgencies((prev) => {
            const next = new Set(prev)
            if (next.has(agency.name)) {
                next.delete(agency.name)
            } else if (next.size >= 2) {
                next.delete([...next][0])
                next.add(agency.name)
            } else {
                next.add(agency.name)
            }
            return next
        })
    }

    const handleConsolidate = () => {
        const arr = [...selectedAgencies]
        if (arr.length !== 2) return
        const a = sorted.find((x) => x.name === arr[0])
        const b = sorted.find((x) => x.name === arr[1])
        if (a && b) setConsolidateModal({ a, b })
    }

    const confirmConsolidate = async (keepName: string, mergeIntoName: string) => {
        setConsolidating(true)
        const result = await consolidateAgencies(projectId, mergeIntoName, keepName)
        setConsolidating(false)
        setConsolidateModal(null)
        setSelectedAgencies(new Set())
        if (result?.error) {
            alert(result.error)
        } else {
            loadAgencies()
            router.refresh()
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-UY', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }

    const cardClass = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
    const headerClass = isLight ? 'bg-gray-50 text-gray-700' : 'bg-zinc-800/50 text-zinc-300'
    const textPrimary = isLight ? 'text-gray-900' : 'text-zinc-100'
    const textSecondary = isLight ? 'text-gray-500' : 'text-zinc-400'
    const inputClass = isLight
        ? 'bg-gray-50 border-gray-300 text-gray-900'
        : 'bg-zinc-800 border-zinc-700 text-zinc-100'
    const rowClass = isLight ? 'hover:bg-gray-50 border-gray-100' : 'hover:bg-zinc-800/50 border-zinc-800'

    const portalBadge = (portal: string) => {
        const p = portal.toLowerCase()
        if (p.includes('mercado')) return 'bg-yellow-500/20 text-yellow-500'
        if (p.includes('info')) return 'bg-orange-500/20 text-orange-500'
        if (p.includes('casas') || p.includes('gallito')) return 'bg-blue-500/20 text-blue-500'
        return 'bg-zinc-500/20 text-zinc-500'
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${textPrimary}`}>Inmobiliarias</h2>
            </div>

            {/* Platform Selector */}
            <PlatformSelector
                selected={selectedPlatform}
                onChange={(p) => { onPlatformChange(p) }}
                counts={platformCounts}
            />

            <div className={`border rounded-xl overflow-hidden ${cardClass}`}>
                {/* Filters Row */}
                <div className={`p-6 border-b ${isLight ? 'border-gray-200' : 'border-zinc-800'} flex flex-wrap items-center justify-between gap-4`}>
                    <div className="flex flex-wrap items-center gap-4 flex-1">
                        <div className="relative max-w-md flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Buscar inmobiliaria..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`w-full pl-9 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 ${inputClass}`}
                            />
                        </div>

                        {/* Only New Toggle */}
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={onlyNew}
                                    onChange={(e) => setOnlyNew(e.target.checked)}
                                />
                                <div className={`w-9 h-5 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-amber-500/20 
                                    ${onlyNew ? 'bg-amber-500' : isLight ? 'bg-gray-200' : 'bg-zinc-700'}`}>
                                </div>
                                <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform
                                    ${onlyNew ? 'translate-x-4' : 'translate-x-0'}`}>
                                </div>
                            </div>
                            <span className={`text-sm font-medium ${onlyNew ? 'text-amber-500' : textSecondary} group-hover:text-amber-400 transition-colors`}>
                                Solo nuevas
                            </span>
                            {newCount > 0 && (
                                <span className="px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold">
                                    {newCount}
                                </span>
                            )}
                        </label>
                    </div>

                    {selectedAgencies.size === 2 && (
                        <button
                            onClick={handleConsolidate}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
                        >
                            <Merge size={16} />
                            Consolidar seleccionadas
                        </button>
                    )}
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`${headerClass} border-b ${isLight ? 'border-gray-200' : 'border-zinc-800'}`}>
                                    <th className="w-10 px-2 py-3" title="Expandir"></th>
                                    <th className="w-10 px-2 py-3" title="Seleccionar"></th>
                                    <th className="text-left px-4 py-3 font-medium">Inmobiliaria</th>
                                    <th className="text-left px-4 py-3 font-medium">Portales</th>
                                    <th className="text-center px-4 py-3 font-medium">Props</th>
                                    <th
                                        className="text-center px-4 py-3 font-medium cursor-pointer hover:bg-zinc-700/30 transition-colors group"
                                        onClick={(e) => { e.stopPropagation(); setSortColumn('avgPrice'); setSortDir(sortColumn === 'avgPrice' && sortDir === 'asc' ? 'desc' : 'asc') }}
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            Precio Prom.
                                            {sortColumn === 'avgPrice' ? (sortDir === 'asc' ? <ChevronUp size={14} className="text-violet-500" /> : <ChevronDown size={14} className="text-violet-500" />) : <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                                        </div>
                                    </th>
                                    <th
                                        className="text-center px-4 py-3 font-medium cursor-pointer hover:bg-zinc-700/30 transition-colors group"
                                        onClick={(e) => { e.stopPropagation(); setSortColumn('neighborhoodCount'); setSortDir(sortColumn === 'neighborhoodCount' && sortDir === 'asc' ? 'desc' : 'asc') }}
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            Zonas
                                            {sortColumn === 'neighborhoodCount' ? (sortDir === 'asc' ? <ChevronUp size={14} className="text-violet-500" /> : <ChevronDown size={14} className="text-violet-500" />) : <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                                        </div>
                                    </th>
                                    <th
                                        className="text-center px-4 py-3 font-medium cursor-pointer hover:bg-zinc-700/30 transition-colors group"
                                        onClick={(e) => { e.stopPropagation(); setSortColumn('activityScore'); setSortDir(sortColumn === 'activityScore' && sortDir === 'asc' ? 'desc' : 'asc') }}
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            Score
                                            {sortColumn === 'activityScore' ? (sortDir === 'asc' ? <ChevronUp size={14} className="text-violet-500" /> : <ChevronDown size={14} className="text-violet-500" />) : <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                                        </div>
                                    </th>
                                    <th className="text-center px-4 py-3 font-medium">Teléfono</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className={`text-center py-12 ${textSecondary}`}>
                                            {search.trim() ? 'No se encontraron inmobiliarias' : loading ? 'Cargando...' : 'No hay inmobiliarias'}
                                        </td>
                                    </tr>
                                ) : (
                                    sorted.map((agency) => {
                                        const isExpanded = expandedAgency === agency.name
                                        const cached = propertiesCache[agency.name]
                                        return (
                                            <React.Fragment key={agency.name}>
                                                <tr
                                                    className={`${rowClass} transition-colors border-t ${isLight ? 'border-gray-100' : 'border-zinc-800/20'} cursor-pointer`}
                                                    onClick={() => toggleExpand(agency.name)}
                                                >
                                                    <td className="px-2 py-3 w-10">
                                                        <button
                                                            type="button"
                                                            className="p-1 rounded hover:bg-zinc-800/30 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                toggleExpand(agency.name)
                                                            }}
                                                        >
                                                            {isExpanded ? (
                                                                <ChevronDown size={18} className={textSecondary} />
                                                            ) : (
                                                                <ChevronRight size={18} className={textSecondary} />
                                                            )}
                                                        </button>
                                                    </td>
                                                    <td className="px-2 py-3 w-10" onClick={(e) => e.stopPropagation()}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedAgencies.has(agency.name)}
                                                            onChange={(e) => {
                                                                e.stopPropagation()
                                                                toggleSelect(e as any, agency)
                                                            }}
                                                            className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                                        />
                                                    </td>
                                                    <td className={`px-4 py-3 font-medium ${textPrimary}`}>
                                                        <div className="flex items-center gap-2">
                                                            {agency.isNew && (
                                                                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" title="Nueva" />
                                                            )}
                                                            <span className="truncate max-w-[200px]" title={agency.name}>
                                                                {agency.name}
                                                            </span>
                                                            {agency.isNew && (
                                                                <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[9px] font-bold uppercase tracking-wider">
                                                                    Nueva
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-wrap gap-1">
                                                            {agency.portals.map((p, i) => (
                                                                <span
                                                                    key={i}
                                                                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${portalBadge(p)}`}
                                                                >
                                                                    {p}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className={`px-4 py-3 text-center font-semibold ${textPrimary}`}>
                                                        {agency.count}
                                                    </td>
                                                    <td className={`px-4 py-3 text-center ${textSecondary}`}>
                                                        {agency.avgPrice > 0 ? `U$S ${agency.avgPrice.toLocaleString()}` : '-'}
                                                    </td>
                                                    <td className={`px-4 py-3 text-center ${textSecondary}`}>
                                                        {agency.neighborhoodCount}
                                                    </td>
                                                    <td className={`px-4 py-3 text-center`}>
                                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                                                            agency.activityScore >= 50
                                                                ? 'bg-emerald-500/15 text-emerald-500'
                                                                : agency.activityScore >= 20
                                                                    ? 'bg-amber-500/15 text-amber-500'
                                                                    : isLight ? 'bg-gray-100 text-gray-500' : 'bg-zinc-800 text-zinc-400'
                                                        }`}>
                                                            {agency.activityScore}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                                        {agency.phone ? (
                                                            <div className="flex items-center justify-center gap-2 min-h-[28px]">
                                                                <a
                                                                    href={`https://wa.me/${agency.phone.replace(/[^0-9]/g, '')}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center justify-center p-1.5 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors shrink-0"
                                                                    title="WhatsApp"
                                                                >
                                                                    <MessageCircle size={14} />
                                                                </a>
                                                                <span className={`text-sm ${textPrimary}`}>{agency.phone}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-zinc-600 text-xs">-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr>
                                                        <td colSpan={9} className={`p-0 ${isLight ? 'bg-gray-50' : 'bg-zinc-900/30'}`}>
                                                            <div className={`px-6 py-4 border-t ${isLight ? 'border-gray-200' : 'border-zinc-800'}`}>
                                                                <h4 className={`text-sm font-semibold ${textPrimary} mb-3`}>
                                                                    Propiedades de {agency.name}
                                                                </h4>
                                                                {cached?.loading ? (
                                                                    <div className="flex items-center gap-2 py-6">
                                                                        <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
                                                                        <span className={textSecondary}>Cargando...</span>
                                                                    </div>
                                                                ) : cached?.data?.length ? (
                                                                    <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                                                                        <table className="w-full text-sm">
                                                                            <thead>
                                                                                <tr className={textSecondary}>
                                                                                    <th className="text-left py-2 font-medium">Título</th>
                                                                                    <th className="text-left py-2 font-medium">Precio</th>
                                                                                    <th className="text-left py-2 font-medium">Ubicación</th>
                                                                                    <th className="text-left py-2 font-medium">Portales</th>
                                                                                    <th className="text-center py-2 font-medium">Link</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {cached.data.map((p: any) => (
                                                                                    <tr
                                                                                        key={p.id}
                                                                                        className={`border-t ${isLight ? 'border-gray-200' : 'border-zinc-800/50'}`}
                                                                                    >
                                                                                        <td className={`py-2 pr-4 max-w-[200px] truncate ${textPrimary}`} title={p.title}>
                                                                                            {p.title || 'Sin título'}
                                                                                        </td>
                                                                                        <td className={`py-2 pr-4 ${textSecondary}`}>
                                                                                            {p.currency} {p.price?.toLocaleString()}
                                                                                        </td>
                                                                                        <td className={`py-2 pr-4 max-w-[150px] truncate ${textSecondary}`} title={p.neighborhood}>
                                                                                            {p.neighborhood || '-'}
                                                                                        </td>
                                                                                        <td className="py-2 pr-4">
                                                                                            <div className="flex flex-wrap gap-1">
                                                                                                {(p.portals || [p.portal]).map((port: string, i: number) => (
                                                                                                    <span
                                                                                                        key={i}
                                                                                                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${portalBadge(port)}`}
                                                                                                    >
                                                                                                        {port}
                                                                                                    </span>
                                                                                                ))}
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="py-2 text-center">
                                                                                            {(p.all_links || [{ portal: p.portal, link: p.link }]).map((linkObj: any, i: number) => (
                                                                                                <a
                                                                                                    key={i}
                                                                                                    href={linkObj.link}
                                                                                                    target="_blank"
                                                                                                    rel="noopener noreferrer"
                                                                                                    className="inline-flex p-1 rounded text-violet-500 hover:bg-violet-500/10"
                                                                                                    title={linkObj.portal}
                                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                                >
                                                                                                    <ExternalLink size={14} />
                                                                                                </a>
                                                                                            ))}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                ) : (
                                                                    <p className={`py-4 ${textSecondary}`}>No se encontraron propiedades</p>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && sorted.length > 0 && (
                    <div
                        className={`px-4 py-3 text-sm ${textSecondary} border-t ${
                            isLight ? 'border-gray-200' : 'border-zinc-800'
                        }`}
                    >
                        {sorted.length} inmobiliaria{sorted.length !== 1 ? 's' : ''}
                        {onlyNew && ` nueva${sorted.length !== 1 ? 's' : ''}`}
                        {selectedPlatform && ` en ${selectedPlatform}`}
                    </div>
                )}
            </div>

            {/* Modal Consolidar */}
            {consolidateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !consolidating && setConsolidateModal(null)}>
                    <div
                        className={`w-full max-w-md rounded-xl shadow-xl ${cardClass} p-6`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>Consolidar inmobiliarias</h3>
                        <p className={`text-sm ${textSecondary} mb-4`}>
                            Todas las propiedades de una inmobiliaria pasarán a nombre de la otra. ¿Bajo qué nombre quieres unificarlas?
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => confirmConsolidate(consolidateModal.a.name, consolidateModal.b.name)}
                                disabled={consolidating}
                                className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                                    isLight ? 'border-violet-200 hover:border-violet-400 hover:bg-violet-50' : 'border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/10'
                                } ${consolidating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span className={`font-medium ${textPrimary}`}>{consolidateModal.a.name}</span>
                                <span className={`text-sm ${textSecondary}`}>{consolidateModal.a.count} props</span>
                            </button>
                            <button
                                onClick={() => confirmConsolidate(consolidateModal.b.name, consolidateModal.a.name)}
                                disabled={consolidating}
                                className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                                    isLight ? 'border-violet-200 hover:border-violet-400 hover:bg-violet-50' : 'border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/10'
                                } ${consolidating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span className={`font-medium ${textPrimary}`}>{consolidateModal.b.name}</span>
                                <span className={`text-sm ${textSecondary}`}>{consolidateModal.b.count} props</span>
                            </button>
                        </div>
                        {consolidating && (
                            <div className="flex items-center justify-center gap-2 mt-4 text-violet-500">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-sm">Consolidando...</span>
                            </div>
                        )}
                        <button
                            onClick={() => !consolidating && setConsolidateModal(null)}
                            disabled={consolidating}
                            className={`mt-4 w-full py-2 rounded-lg text-sm ${textSecondary} hover:bg-zinc-800/30 transition-colors ${consolidating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
