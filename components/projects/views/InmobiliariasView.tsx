'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { Search, MessageCircle, ChevronDown, ChevronRight, ExternalLink, Loader2, Merge } from 'lucide-react'
import { getProjectProperties, consolidateAgencies } from '@/app/actions/project-actions'

interface InmobiliariasViewProps {
    projectId: string
    allAgencies: { name: string; count: number; phone?: string }[]
}

export default function InmobiliariasView({ projectId, allAgencies }: InmobiliariasViewProps) {
    const router = useRouter()
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [search, setSearch] = useState('')
    const [expandedAgency, setExpandedAgency] = useState<string | null>(null)
    const [propertiesCache, setPropertiesCache] = useState<Record<string, { loading: boolean; data: any[] }>>({})
    const [selectedAgencies, setSelectedAgencies] = useState<Set<string>>(new Set())
    const [consolidateModal, setConsolidateModal] = useState<{ a: typeof allAgencies[0]; b: typeof allAgencies[0] } | null>(null)
    const [consolidating, setConsolidating] = useState(false)

    const normAccent = (s: string) =>
        (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

    const filtered = allAgencies.filter(
        (a) => !search.trim() || normAccent(a.name).includes(normAccent(search.trim()))
    )

    useEffect(() => {
        if (!expandedAgency) return
        if (propertiesCache[expandedAgency]) return
        setPropertiesCache((prev) => ({ ...prev, [expandedAgency]: { loading: true, data: [] } }))
        getProjectProperties(projectId, { agency: expandedAgency, perPage: 200 })
            .then((res) => {
                const data = res?.data?.properties ?? []
                setPropertiesCache((prev) => ({ ...prev, [expandedAgency]: { loading: false, data } }))
            })
            .catch(() => {
                setPropertiesCache((prev) => ({ ...prev, [expandedAgency]: { loading: false, data: [] } }))
            })
    }, [expandedAgency, projectId])

    const toggleExpand = (agencyName: string) => {
        setExpandedAgency((prev) => (prev === agencyName ? null : agencyName))
    }

    const toggleSelect = (_e: React.MouseEvent | React.ChangeEvent, agency: { name: string; count: number }) => {
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
        const a = filtered.find((x) => x.name === arr[0])
        const b = filtered.find((x) => x.name === arr[1])
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
            router.refresh()
        }
    }

    const cardClass = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
    const headerClass = isLight ? 'bg-gray-50 text-gray-700' : 'bg-zinc-800/50 text-zinc-300'
    const textPrimary = isLight ? 'text-gray-900' : 'text-zinc-100'
    const textSecondary = isLight ? 'text-gray-500' : 'text-zinc-400'
    const inputClass = isLight
        ? 'bg-gray-50 border-gray-300 text-gray-900'
        : 'bg-zinc-800 border-zinc-700 text-zinc-100'
    const rowClass = isLight ? 'hover:bg-gray-50 border-gray-100' : 'hover:bg-zinc-800/50 border-zinc-800'

    return (
        <div className="space-y-4">
            <h2 className={`text-xl font-bold ${textPrimary}`}>Inmobiliarias</h2>

            <div className={`border rounded-xl overflow-hidden ${cardClass}`}>
                <div className={`p-6 border-b ${isLight ? 'border-gray-200' : 'border-zinc-800'} flex flex-wrap items-center justify-between gap-4`}>
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

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`${headerClass} border-b ${isLight ? 'border-gray-200' : 'border-zinc-800'}`}>
                                <th className="w-10 px-2 py-3" title="Expandir"></th>
                                <th className="w-10 px-2 py-3" title="Seleccionar para consolidar"></th>
                                <th className="text-left px-4 py-3 font-medium">Inmobiliaria</th>
                                <th className="text-left px-4 py-3 font-medium">Cantidad de propiedades</th>
                                <th className="text-center px-4 py-3 font-medium">Teléfono</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className={`text-center py-12 ${textSecondary}`}>
                                        {search.trim() ? 'No se encontraron inmobiliarias' : 'No hay inmobiliarias'}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((agency) => {
                                    const isExpanded = expandedAgency === agency.name
                                    const cached = propertiesCache[agency.name]
                                    return (
                                        <React.Fragment key={agency.name}>
                                            <tr
                                                key={agency.name}
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
                                                    {agency.name}
                                                </td>
                                                <td className={`px-4 py-3 ${textSecondary}`}>
                                                    {agency.count} {agency.count === 1 ? 'propiedad' : 'propiedades'}
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
                                                    <td colSpan={5} className={`p-0 ${isLight ? 'bg-gray-50' : 'bg-zinc-900/30'}`}>
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
                                                                                                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                                                                                        port === 'Mercado Libre' ? 'bg-yellow-500/20 text-yellow-500' :
                                                                                                        (port === 'InfoCasas' || port === 'Infocasas') ? 'bg-orange-500/20 text-orange-500' :
                                                                                                        'bg-blue-500/20 text-blue-500'
                                                                                                    }`}
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

                {filtered.length > 0 && (
                    <div
                        className={`px-4 py-3 text-sm ${textSecondary} border-t ${
                            isLight ? 'border-gray-200' : 'border-zinc-800'
                        }`}
                    >
                        {filtered.length} inmobiliaria{filtered.length !== 1 ? 's' : ''}
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
