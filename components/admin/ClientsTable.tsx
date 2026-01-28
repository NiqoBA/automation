'use client'

import { useState } from 'react'
import { ExternalLink, MoreVertical, Edit, Eye } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

interface Client {
  id: string
  name: string
  rut: string
  country: string
  employee_count: string
  status: string
  created_at: string
  user_count: number
  project_count: number
}

interface ClientsTableProps {
  clients: Client[]
}

export default function ClientsTable({ clients }: ClientsTableProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const { theme } = useTheme()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const isLight = theme === 'light'
  const bgClass = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
  const borderClass = isLight ? 'border-gray-200' : 'border-zinc-800'
  const headerBgClass = isLight ? 'bg-gray-50 border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
  const textPrimaryClass = isLight ? 'text-black' : 'text-zinc-100'
  const textSecondaryClass = isLight ? 'text-gray-600' : 'text-zinc-400'
  const textMutedClass = isLight ? 'text-gray-500' : 'text-zinc-400'
  const subtitleClass = isLight ? 'text-black' : 'text-zinc-400'
  const hoverBgClass = isLight ? 'hover:bg-gray-50' : 'hover:bg-zinc-900/30'
  const dividerClass = isLight ? 'divide-gray-200' : 'divide-zinc-800'
  const menuBgClass = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900 border-zinc-800'
  const menuItemHoverClass = isLight ? 'hover:bg-gray-50' : 'hover:bg-zinc-800'
  const menuItemTextClass = isLight ? 'text-gray-700' : 'text-zinc-300'
  const buttonHoverClass = isLight ? 'hover:bg-gray-100' : 'hover:bg-zinc-800'

  return (
    <div className={`w-full min-w-0 rounded-xl overflow-hidden border transition-colors ${bgClass}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`border-b transition-colors ${headerBgClass}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Nombre
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                RUT
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                País
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Empleados
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Usuarios
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Proyectos
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Fecha Creación
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Estado
              </th>
              <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors ${dividerClass}`}>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <p className={textMutedClass}>No hay clientes registrados</p>
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr
                  key={client.id}
                  className={`transition-colors ${hoverBgClass}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${textPrimaryClass}`}>
                      {client.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>{client.rut}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>{client.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {client.employee_count}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {client.user_count}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {client.project_count || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {formatDate(client.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={
                        client.status === 'active' ? 'success' : 'default'
                      }
                      size="sm"
                    >
                      {client.status === 'active' ? 'Activo' : client.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/admin/view-client/${client.id}`}
                        className={`p-2 rounded-lg transition-colors ${textSecondaryClass} ${buttonHoverClass} hover:text-violet-400`}
                        title="Ver Dashboard"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenMenu(
                              openMenu === client.id ? null : client.id
                            )
                          }
                          className={`p-2 rounded-lg transition-colors ${textSecondaryClass} ${buttonHoverClass} hover:text-violet-400`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openMenu === client.id && (
                          <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 border transition-colors ${menuBgClass}`}>
                            <button className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${menuItemTextClass} ${menuItemHoverClass}`}>
                              <Edit className="w-4 h-4" />
                              Editar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
