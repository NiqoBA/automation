'use client'

import { useState, useEffect } from 'react'
import { getProjectProperties } from '@/app/actions/project-actions'
import { useTheme } from '@/contexts/ThemeContext'
import { ExternalLink, ChevronLeft, ChevronRight, Search, Filter, Loader2 } from 'lucide-react'

interface PropertiesViewProps {
    projectId: string
}

export default function PropertiesView({ projectId }: PropertiesViewProps) {
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)
    const [page, setPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedPortal, setSelectedPortal] = useState('')

    const loadData = async () => {
        setLoading(true)
        const result = await getProjectProperties(projectId, {
            page,
            neighborhood: searchTerm || undefined,
            portal: selectedPortal || undefined,
        })
        setData(result.data)
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [projectId, page])

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

    const portals = ['Mercadolibre', 'InfoCasas', 'CasasYMas', 'Gallito']

    return (
        <div className="space-y-4">
            <h2 className={`text-xl font-bold ${textClass}`}>Propiedades</h2>

            <div className={`border rounded-xl overflow-hidden ${cardClass}`}>
                {/* Filters */}
                <div className={`p-4 border-b ${isLight ? 'border-gray-200' : 'border-zinc-800'}`}>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedClass}`} />
                                <input
                                    type="text"
                                    placeholder="Buscar por barrio..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                    className={`w-full pl-9 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500 ${inputClass}`}
                                />
                            </div>
                        </div>
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
                        <button
                            onClick={handleFilter}
                            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors flex items-center gap-2"
                        >
                            <Filter size={16} />
                            Filtrar
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
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={headerClass}>
                                    <tr>
                                        <th className="text-left px-4 py-3 font-medium">Vista</th>
                                        <th className="text-left px-4 py-3 font-medium">Título</th>
                                        <th className="text-left px-4 py-3 font-medium">Precio</th>
                                        <th className="text-left px-4 py-3 font-medium">m²</th>
                                        <th className="text-left px-4 py-3 font-medium">Hab.</th>
                                        <th className="text-left px-4 py-3 font-medium">Barrio</th>
                                        <th className="text-left px-4 py-3 font-medium">Portal</th>
                                        <th className="text-left px-4 py-3 font-medium">Agencia</th>
                                        <th className="text-center px-4 py-3 font-medium">Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!data?.properties?.length ? (
                                        <tr>
                                            <td colSpan={8} className={`text-center py-12 ${mutedClass}`}>
                                                No se encontraron propiedades
                                            </td>
                                        </tr>
                                    ) : (
                                        data.properties.map((property: any) => (
                                            <tr key={property.id} className={`border-t transition-colors ${rowClass}`}>
                                                <td className="px-4 py-3">
                                                    <div className="w-16 h-12 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-700/50">
                                                        {property.img_url ? (
                                                            <img
                                                                src={property.img_url}
                                                                alt={property.title}
                                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/18181b/a1a1aa?text=Sin+Imagen'
                                                                }}
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-500 font-medium bg-zinc-800/50">
                                                                NO IMG
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className={`px-4 py-3 ${textClass}`}>
                                                    <div className="max-w-[250px] truncate" title={property.title}>
                                                        {property.title || 'Sin título'}
                                                    </div>
                                                    {property.is_duplicate && (
                                                        <span className="text-xs text-amber-500">Duplicado</span>
                                                    )}
                                                </td>
                                                <td className={`px-4 py-3 font-semibold ${textClass}`}>
                                                    {formatPrice(property.price, property.currency)}
                                                </td>
                                                <td className={`px-4 py-3 ${mutedClass}`}>
                                                    {property.m2 ? `${property.m2} m²` : '-'}
                                                </td>
                                                <td className={`px-4 py-3 ${mutedClass}`}>
                                                    {property.rooms || '-'}
                                                </td>
                                                <td className={`px-4 py-3 ${textClass}`}>
                                                    {property.neighborhood || '-'}
                                                </td>
                                                <td className={`px-4 py-3 ${mutedClass}`}>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium
                            ${property.portal === 'Mercadolibre' ? 'bg-yellow-500/20 text-yellow-500' :
                                                            (property.portal === 'Infocasas' || property.portal === 'InfoCasas') ? 'bg-blue-500/20 text-blue-500' :
                                                                (property.portal === 'CasasYMas' || property.portal === 'Gallito') ? 'bg-emerald-500/20 text-emerald-500' :
                                                                    'bg-zinc-500/20 text-zinc-500'}`}
                                                    >
                                                        {property.portal}
                                                    </span>
                                                </td>
                                                <td className={`px-4 py-3 ${mutedClass}`}>
                                                    <div className="max-w-[120px] truncate" title={property.agency}>
                                                        {property.agency || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {property.link && (
                                                        <a
                                                            href={property.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/20 text-violet-500 hover:bg-violet-500/30 transition-colors"
                                                        >
                                                            <ExternalLink size={16} />
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
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
