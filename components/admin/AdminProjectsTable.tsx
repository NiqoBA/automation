'use client'

import Badge from '@/components/ui/Badge'
import { Project } from '@/lib/types/database'
import { Organization } from '@/lib/types/database'
import { useTheme } from '@/contexts/ThemeContext'

interface ProjectWithOrg extends Project {
  organizations?: Organization | null
  profiles?: {
    id: string
    full_name: string
    email: string
  } | null
}

interface AdminProjectsTableProps {
  projects: ProjectWithOrg[]
}

export default function AdminProjectsTable({ projects }: AdminProjectsTableProps) {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" size="sm">Activo</Badge>
      case 'paused':
        return <Badge variant="warning" size="sm">Pausado</Badge>
      case 'completed':
        return <Badge variant="info" size="sm">Completado</Badge>
      case 'cancelled':
        return <Badge variant="default" size="sm">Cancelado</Badge>
      default:
        return <Badge variant="default" size="sm">{status}</Badge>
    }
  }

  const bgClass = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
  const borderClass = isLight ? 'border-gray-200' : 'border-zinc-800'
  const headerBgClass = isLight ? 'bg-gray-50 border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
  const textPrimaryClass = isLight ? 'text-black' : 'text-zinc-100'
  const textSecondaryClass = isLight ? 'text-gray-600' : 'text-zinc-400'
  const textMutedClass = isLight ? 'text-gray-500' : 'text-zinc-400'
  const hoverBgClass = isLight ? 'hover:bg-gray-50' : 'hover:bg-zinc-900/30'
  const dividerClass = isLight ? 'divide-gray-200' : 'divide-zinc-800'

  return (
    <div className={`w-full min-w-0 rounded-xl overflow-hidden border transition-colors ${bgClass}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`border-b transition-colors ${headerBgClass}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Proyecto
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Organización
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Tipo
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Estado
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Creado por
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Fecha Creación
              </th>
            </tr>
          </thead>

          <tbody className={`divide-y transition-colors ${dividerClass}`}>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <p className={textMutedClass}>No hay proyectos</p>
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr
                  key={project.id}
                  className={`transition-colors ${hoverBgClass}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${textPrimaryClass}`}>
                      {project.name}
                    </div>
                    {project.description && (
                      <div className={`text-xs mt-1 truncate max-w-xs ${textSecondaryClass}`}>
                        {project.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${textPrimaryClass}`}>
                      {project.organizations?.name || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {project.type || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(project.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {project.profiles?.full_name || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {formatDate(project.created_at)}
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
