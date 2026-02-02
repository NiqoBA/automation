'use client'

import { useState, useEffect } from 'react'
import { getProjectProperties, consolidateDuplicateProperties, togglePropertyFavorite } from '@/app/actions/project-actions'
import { useTheme } from '@/contexts/ThemeContext'
import { ExternalLink, ChevronLeft, ChevronRight, Search, Loader2, Phone, MessageCircle, ChevronUp, ChevronDown, ArrowUpDown, Calendar, Star } from 'lucide-react'

interface PropertiesViewProps {
    projectId: string
}

export default function PropertiesView({ projectId }: PropertiesViewProps) {
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)
    const [page, setPage] = useState(1)
    const [selectedPortal, setSelectedPortal] = useState('')
    const [agencyFilter, setAgencyFilter] = useState('')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [sortColumn, setSortColumn] = useState('created_at')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
    const [onlyDuplicates, setOnlyDuplicates] = useState(false)
    const [onlyFavorites, setOnlyFavorites] = useState(false)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [consolidating, setConsolidating] = useState(false)
    const [optimisticFavorites, setOptimisticFavorites] = useState<Record<string, boolean>>({})

    const loadData = async () => {
        setLoading(true)
        const result = await getProjectProperties(projectId, {
            page,
            portal: selectedPortal || undefined,
            agency: agencyFilter.trim() || undefined,
            minPrice: minPrice ? parseInt(minPrice) : undefined,
            maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
            orderBy: sortColumn,
            orderDir: sortDir,
            onlyDuplicates,
            onlyFavorites,
            startDate,
            endDate,
        })
        setData(result.data)
        setLoading(false)
        setOptimisticFavorites({})
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1)
            loadData()
        }, 400) // Debounce of 400ms for real-time feel
        return () => clearTimeout(timer)
    }, [selectedPortal, agencyFilter, minPrice, maxPrice])

    useEffect(() => {
        loadData()
    }, [projectId, page, sortColumn, sortDir, onlyDuplicates, onlyFavorites, startDate, endDate])

    const handleFilter = () => {
        setPage(1)
        loadData()
    }

    const cardClass = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
    const headerClass = isLight ? 'bg-gray-50 text-gray-700' : 'bg-zinc-800/50 text-zinc-300'
    const rowClass = isLight ? 'hover:bg-gray-50 border-gray-100' : 'hover:bg-zinc-800/50 border-zinc-800'
    const textClass = isLight ? 'text-gray-900' : 'text-zinc-100'
    const mutedClass = isLight ? 'text-gray-500' : 'text-zinc-400'
    const inputClass = isLight
        ? 'bg-gray-50 border-gray-300 text-gray-900'
        : 'bg-zinc-800 border-zinc-700 text-zinc-100'

    const formatPrice = (price: number, currency: string) => {
        const formatter = new Intl.NumberFormat('es-UY', {
            style: 'currency',
            currency: currency === 'USD' ? 'USD' : 'UYU',
            maximumFractionDigits: 0,
        })
        return formatter.format(price)
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-UY', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }

    const portals = ['Mercado Libre', 'InfoCasas', 'CasasYMas', 'Gallito']

    return (
        <div className="space-y-4">
            <h2 className={`text-xl font-bold ${textClass}`}>Propiedades</h2>

            <div className={`border rounded-xl overflow-hidden ${cardClass}`}>
                {/* Filters */}
                <div className={`p-6 border-b ${isLight ? 'border-gray-200' : 'border-zinc-800'} space-y-4`}>
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex flex-wrap items-center gap-6">
                            {/* Agency Filter */}
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-medium ${mutedClass}`}>Inmobiliaria:</span>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre..."
                                    value={agencyFilter}
                                    onChange={(e) => setAgencyFilter(e.target.value)}
                                    className={`w-48 px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 ${inputClass}`}
                                />
                            </div>

                            {/* Price Range */}
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-medium ${mutedClass}`}>Precio:</span>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className={`w-24 px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 ${inputClass}`}
                                />
                                <span className={mutedClass}>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className={`w-24 px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 ${inputClass}`}
                                />
                            </div>

                            {/* Date Range */}
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className={mutedClass} />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className={`text-xs p-1.5 rounded border ${isLight ? 'bg-white border-gray-200' : 'bg-black border-zinc-800'} ${textClass} focus:outline-none focus:ring-1 focus:ring-violet-500`}
                                    placeholder="Desde"
                                />
                                <span className={mutedClass}>-</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className={`text-xs p-1.5 rounded border ${isLight ? 'bg-white border-gray-200' : 'bg-black border-zinc-800'} ${textClass} focus:outline-none focus:ring-1 focus:ring-violet-500`}
                                    placeholder="Hasta"
                                />
                                {(startDate || endDate) && (
                                    <button
                                        onClick={() => { setStartDate(''); setEndDate(''); }}
                                        className="text-[10px] text-violet-500 hover:text-violet-400 font-medium"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Portal Selection (Top Right) */}
                        <select
                            value={selectedPortal}
                            onChange={(e) => setSelectedPortal(e.target.value)}
                            className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500 ${inputClass}`}
                        >
                            <option value="">Todos los portales</option>
                            {portals.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    {/* Bottom Row: Duplicates Toggle */}
                    <div className="flex items-center gap-4 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={onlyDuplicates}
                                    onChange={(e) => setOnlyDuplicates(e.target.checked)}
                                />
                                <div className={`w-9 h-5 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-violet-500/20 
                                ${onlyDuplicates ? 'bg-violet-600' : isLight ? 'bg-gray-200' : 'bg-zinc-700'}`}>
                                </div>
                                <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform
                                ${onlyDuplicates ? 'translate-x-4' : 'translate-x-0'}`}>
                                </div>
                            </div>
                            <span className={`text-sm font-medium ${onlyDuplicates ? 'text-violet-500' : mutedClass} group-hover:text-violet-400 transition-colors`}>
                                Ver solo duplicados
                            </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={onlyFavorites}
                                    onChange={(e) => setOnlyFavorites(e.target.checked)}
                                />
                                <div className={`w-9 h-5 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-violet-500/20 
                                ${onlyFavorites ? 'bg-violet-600' : isLight ? 'bg-gray-200' : 'bg-zinc-700'}`}>
                                </div>
                                <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform
                                ${onlyFavorites ? 'translate-x-4' : 'translate-x-0'}`}>
                                </div>
                            </div>
                            <span className={`text-sm font-medium ${onlyFavorites ? 'text-violet-500' : mutedClass} group-hover:text-violet-400 transition-colors`}>
                                Solo favoritas
                            </span>
                        </label>

                        {(onlyDuplicates || onlyFavorites) && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                Filtro Activo
                            </span>
                        )}

                        <button
                            onClick={async () => {
                                setConsolidating(true)
                                const result = await consolidateDuplicateProperties(projectId)
                                setConsolidating(false)
                                if (result?.error) {
                                    alert(result.error)
                                } else if (result?.deletedCount !== undefined && result.deletedCount > 0) {
                                    loadData()
                                    alert(`Se consolidaron ${result.deletedCount} registros duplicados.`)
                                }
                            }}
                            disabled={consolidating}
                            className={`ml-auto px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                ${consolidating ? 'opacity-50 cursor-not-allowed' : ''}
                                ${isLight ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300' : 'bg-zinc-700 text-zinc-200 hover:bg-zinc-600'}`}
                        >
                            {consolidating ? 'Consolidando...' : 'Consolidar duplicados en DB'}
                        </button>
                    </div>
                </div>
                {/* Table */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                    </div>
                ) : (
                    <>
                        {/* Table Section with extra top margin */}
                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className={`${isLight ? 'bg-gray-50 border-b border-gray-200' : 'bg-zinc-800/50 border-b border-zinc-800'} transition-colors duration-200`}>
                                        <th
                                            className="text-left px-4 py-3 font-medium cursor-pointer hover:bg-zinc-700/30 transition-colors group"
                                            onClick={() => {
                                                const dir = sortColumn === 'created_at' && sortDir === 'asc' ? 'desc' : 'asc'
                                                setSortColumn('created_at')
                                                setSortDir(dir)
                                            }}
                                        >
                                            <div className="flex items-center gap-1">
                                                Fecha
                                                {sortColumn === 'created_at' ? (
                                                    sortDir === 'asc' ? <ChevronUp size={14} className="text-violet-500" /> : <ChevronDown size={14} className="text-violet-500" />
                                                ) : <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                                            </div>
                                        </th>
                                        <th className="w-10 px-2 py-3" title="Favorito"></th>
                                        <th className="text-left px-4 py-3 font-medium">Vista</th>
                                        <th className="text-left px-4 py-3 font-medium">Título</th>
                                        <th
                                            className="text-left px-4 py-3 font-medium cursor-pointer hover:bg-zinc-700/30 transition-colors group"
                                            onClick={() => {
                                                const dir = sortColumn === 'price' && sortDir === 'asc' ? 'desc' : 'asc'
                                                setSortColumn('price')
                                                setSortDir(dir)
                                            }}
                                        >
                                            <div className="flex items-center gap-1">
                                                Precio
                                                {sortColumn === 'price' ? (
                                                    sortDir === 'asc' ? <ChevronUp size={14} className="text-violet-500" /> : <ChevronDown size={14} className="text-violet-500" />
                                                ) : <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                                            </div>
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            m²
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium whitespace-nowrap">Ubicación/Barrio</th>
                                        <th className="text-left px-4 py-3 font-medium">Portales</th>
                                        <th className="text-left px-4 py-3 font-medium">Agencia</th>
                                        <th className="text-center px-4 py-3 font-medium">Contacto</th>
                                        <th className="text-center px-4 py-3 font-medium">Links</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!data?.properties?.length ? (
                                        <tr>
                                            <td colSpan={10} className={`text-center py-12 ${mutedClass}`}>
                                                No se encontraron propiedades
                                            </td>
                                        </tr>
                                    ) : (
                                        data.properties.map((property: any) => {
                                            const isDuplicate = property.is_cross_portal_duplicate
                                            const rowBg = isLight ? 'hover:bg-gray-50' : 'hover:bg-zinc-800/10'

                                            return (
                                                <tr key={property.id} className={`${rowBg} transition-colors group relative border-t border-zinc-800/20`}>
                                                    <td className={`px-4 py-3 ${mutedClass} whitespace-nowrap`}>
                                                        {new Date(property.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-2 py-3 w-10">
                                                        {(() => {
                                                            const isFav = property.id in optimisticFavorites
                                                                ? optimisticFavorites[property.id]
                                                                : property.is_favorite
                                                            return (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        const nextFav = !isFav
                                                                        setOptimisticFavorites(prev => ({ ...prev, [property.id]: nextFav }))
                                                                        togglePropertyFavorite(projectId, property.id).then((res) => {
                                                                            if (res?.error) {
                                                                                setOptimisticFavorites(prev => {
                                                                                    const next = { ...prev }
                                                                                    delete next[property.id]
                                                                                    return next
                                                                                })
                                                                                alert(res.error)
                                                                            }
                                                                        })
                                                                    }}
                                                                    className="p-1 rounded hover:bg-zinc-800/30 transition-colors"
                                                                    title={isFav ? 'Quitar de favoritos' : 'Marcar como favorita'}
                                                                >
                                                                    <Star
                                                                        size={18}
                                                                        className={isFav ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-500 hover:text-yellow-400'}
                                                                    />
                                                                </button>
                                                            )
                                                        })()}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="w-16 h-12 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700/50 flex-shrink-0">
                                                            {property.img_url ? (
                                                                <img src={property.img_url} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                                                            ) : (
                                                                <Search size={16} className="text-zinc-600" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className={`px-4 py-3 font-medium ${textClass} max-w-[200px]`}>
                                                        <div className="flex items-start gap-2">
                                                            <span className="truncate" title={property.title}>
                                                                {property.title || 'Sin título'}
                                                            </span>
                                                            {isDuplicate && (
                                                                <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                                                                    Dupli
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className={`px-4 py-3 font-bold ${textClass}`}>
                                                        {property.currency} {property.price?.toLocaleString()}
                                                    </td>
                                                    <td className={`px-4 py-3 ${mutedClass}`}>
                                                        {property.m2 ? `${property.m2} m²` : '-'}
                                                    </td>
                                                    <td className={`px-4 py-3 ${textClass} max-w-[200px]`}>
                                                        <div
                                                            className={`cursor-pointer group flex items-start gap-1`}
                                                            onClick={() => {
                                                                const newExpanded = new Set(expandedRows)
                                                                if (newExpanded.has(property.id)) {
                                                                    newExpanded.delete(property.id)
                                                                } else {
                                                                    newExpanded.add(property.id)
                                                                }
                                                                setExpandedRows(newExpanded)
                                                            }}
                                                        >
                                                            <span className={`${expandedRows.has(property.id) ? '' : 'truncate'}`}>
                                                                {property.neighborhood || '-'}
                                                            </span>
                                                            {!expandedRows.has(property.id) && property.neighborhood && property.neighborhood.length > 20 && (
                                                                <span className="text-violet-500 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">...</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className={`px-4 py-3 ${mutedClass}`}>
                                                        <div className="flex flex-wrap gap-1">
                                                            {(property.portals || [property.portal]).map((p: string, idx: number) => (
                                                                <span key={idx} className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider
                                                                        ${p === 'Mercado Libre' ? 'bg-yellow-500/20 text-yellow-500' :
                                                                        (p === 'Infocasas' || p === 'InfoCasas') ? 'bg-orange-500/20 text-orange-500' :
                                                                            (p === 'CasasYMas' || p === 'Gallito') ? 'bg-blue-500/20 text-blue-500' :
                                                                                'bg-zinc-500/20 text-zinc-500'}`}>
                                                                    {p}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className={`px-4 py-3 ${mutedClass}`}>
                                                        {property.agency || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex flex-col items-center gap-1">
                                                            {(property.phone || property.agency_phone) ? (
                                                                <>
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <a
                                                                            href={`https://wa.me/${(property.phone || property.agency_phone).replace(/[^0-9]/g, '')}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="p-1.5 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors"
                                                                            title="WhatsApp"
                                                                        >
                                                                            <MessageCircle size={14} />
                                                                        </a>
                                                                        <button
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(property.phone || property.agency_phone)
                                                                            }}
                                                                            className="p-1.5 rounded-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition-colors"
                                                                            title="Copiar teléfono"
                                                                        >
                                                                            <Phone size={14} />
                                                                        </button>
                                                                    </div>
                                                                    {!property.phone && property.agency_phone && (
                                                                        <span className="block text-[9px] text-amber-600 dark:text-amber-400 max-w-[180px] text-center leading-tight whitespace-normal" title="No se encontró el teléfono de la propiedad, se muestra el de la inmobiliaria">
                                                                            No se encontró el teléfono de la propiedad, se muestra el de la inmobiliaria
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span className="text-zinc-600 text-xs">-</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            {(property.all_links || [{ portal: property.portal, link: property.link }]).map((linkObj: any, idx: number) => (
                                                                <a
                                                                    key={idx}
                                                                    href={linkObj.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={`p-1 rounded-lg transition-colors
                                                                            ${linkObj.portal === 'Mercado Libre' ? 'text-yellow-500 hover:bg-yellow-500/10' :
                                                                            (linkObj.portal === 'Infocasas' || linkObj.portal === 'InfoCasas') ? 'text-orange-500 hover:bg-orange-500/10' :
                                                                                'text-blue-500 hover:bg-blue-500/10'}`}
                                                                    title={linkObj.portal}
                                                                >
                                                                    <ExternalLink size={14} />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {data && (
                            <div className={`flex items-center justify-between px-4 py-3 border-t ${isLight ? 'border-gray-200' : 'border-zinc-800'}`}>
                                <p className={`text-sm ${mutedClass}`}>
                                    Mostrando {((data.page - 1) * data.perPage) + 1} - {Math.min(data.page * data.perPage, data.total)} de {data.total}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page <= 1}
                                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                      ${isLight ? 'hover:bg-gray-100' : 'hover:bg-zinc-800'}`}
                                    >
                                        <ChevronLeft size={20} className={mutedClass} />
                                    </button>
                                    <span className={`text-sm ${textClass}`}>
                                        Página {data.page} de {data.totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                                        disabled={page >= data.totalPages}
                                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                      ${isLight ? 'hover:bg-gray-100' : 'hover:bg-zinc-800'}`}
                                    >
                                        <ChevronRight size={20} className={mutedClass} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
