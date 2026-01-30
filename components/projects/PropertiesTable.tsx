'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { ExternalLink, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react'

interface Property {
    id: string
    title: string
    price: number
    currency: string
    m2: number
    rooms: number
    neighborhood: string
    portal: string
    agency: string
    link: string
    is_duplicate: boolean
    created_at: string
}

interface PropertiesTableProps {
    properties: Property[]
    total: number
    page: number
    perPage: number
    totalPages: number
    onPageChange: (page: number) => void
    onFilter: (filters: { neighborhood?: string; portal?: string }) => void
}

export default function PropertiesTable({
    properties,
    total,
    page,
    perPage,
    totalPages,
    onPageChange,
    onFilter,
}: PropertiesTableProps) {
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedPortal, setSelectedPortal] = useState('')

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

    const handleSearch = () => {
        onFilter({ neighborhood: searchTerm || undefined, portal: selectedPortal || undefined })
    }

    const portals = ['Mercadolibre', 'Infocasas', 'Gallito']

    return (
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
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                        onClick={handleSearch}
                        className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors flex items-center gap-2"
                    >
                        <Filter size={16} />
                        Filtrar
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={headerClass}>
                        <tr>
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
                        {properties.length === 0 ? (
                            <tr>
                                <td colSpan={8} className={`text-center py-12 ${mutedClass}`}>
                                    No se encontraron propiedades
                                </td>
                            </tr>
                        ) : (
                            properties.map((property) => (
                                <tr key={property.id} className={`border-t transition-colors ${rowClass}`}>
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
                                                property.portal === 'Infocasas' ? 'bg-blue-500/20 text-blue-500' :
                                                    'bg-green-500/20 text-green-500'}`}
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
            <div className={`flex items-center justify-between px-4 py-3 border-t ${isLight ? 'border-gray-200' : 'border-zinc-800'}`}>
                <p className={`text-sm ${mutedClass}`}>
                    Mostrando {((page - 1) * perPage) + 1} - {Math.min(page * perPage, total)} de {total} propiedades
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page <= 1}
                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              ${isLight ? 'hover:bg-gray-100' : 'hover:bg-zinc-800'}`}
                    >
                        <ChevronLeft size={20} className={mutedClass} />
                    </button>
                    <span className={`text-sm ${textClass}`}>
                        Página {page} de {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages}
                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              ${isLight ? 'hover:bg-gray-100' : 'hover:bg-zinc-800'}`}
                    >
                        <ChevronRight size={20} className={mutedClass} />
                    </button>
                </div>
            </div>
        </div>
    )
}
