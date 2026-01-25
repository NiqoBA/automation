'use client'

import Badge from '@/components/ui/Badge'
import { Edit, Trash2, Eye } from 'lucide-react'
import type { Project } from '@/lib/types/database'

interface ProjectWithCreator extends Project {
  profiles?: {
    id: string
    full_name: string
    email: string
  }
}

interface ProjectsTableProps {
  projects: ProjectWithCreator[]
}

export default function ProjectsTable({ projects }: ProjectsTableProps) {
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

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-100">Proyectos</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Gestiona los proyectos de tu organización
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-900/50 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Creado por
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Última Actualización
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <p className="text-zinc-400">No hay proyectos</p>
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-zinc-900/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-zinc-100">
                      {project.name}
                    </div>
                    {project.description && (
                      <div className="text-xs text-zinc-400 mt-1 truncate max-w-xs">
                        {project.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-zinc-400">
                      {project.type || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(project.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-zinc-400">
                      {project.profiles?.full_name || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-zinc-400">
                      {formatDate(project.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-zinc-400">
                      {formatDate(project.updated_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-violet-400 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-violet-400 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
