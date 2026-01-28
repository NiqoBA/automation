'use client'

import { Users, Briefcase, Calendar, Building2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import type { Organization, Profile, Project } from '@/lib/types/database'
import { useTheme } from '@/contexts/ThemeContext'

interface ClientDashboardViewProps {
  organization: Organization
  users: Profile[]
  projects: Project[]
}

export default function ClientDashboardView({
  organization,
  users,
  projects,
}: ClientDashboardViewProps) {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const bgClass = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
  const borderClass = isLight ? 'border-gray-200' : 'border-zinc-800'
  const textPrimaryClass = isLight ? 'text-black' : 'text-zinc-100'
  const textSecondaryClass = isLight ? 'text-gray-600' : 'text-zinc-400'
  const subtitleClass = isLight ? 'text-black' : 'text-zinc-400'
  const textMutedClass = isLight ? 'text-gray-500' : 'text-zinc-400'
  const hoverBgClass = isLight ? 'hover:bg-gray-50' : 'hover:bg-zinc-900/30'
  const dividerClass = isLight ? 'divide-gray-200' : 'divide-zinc-800'
  const iconBgClass = isLight ? 'bg-gray-100' : 'bg-zinc-800'

  return (
    <div className="min-w-0 max-w-full space-y-6">
      {/* Organization Info */}
      <div className={`w-full min-w-0 rounded-xl p-6 border transition-colors ${bgClass}`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${textPrimaryClass}`}>
              {organization.name}
            </h2>
            <Badge
              variant={organization.status === 'active' ? 'success' : 'default'}
              size="sm"
            >
              {organization.status === 'active' ? 'Activa' : organization.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${iconBgClass}`}>
              <Building2 className={`w-5 h-5 ${isLight ? 'text-violet-600' : 'text-violet-400'}`} />
            </div>
            <div>
              <p className={`text-sm mb-1 ${textSecondaryClass}`}>RUT</p>
              <p className={`font-medium ${textPrimaryClass}`}>{organization.rut}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${iconBgClass}`}>
              <Users className={`w-5 h-5 ${isLight ? 'text-violet-600' : 'text-violet-400'}`} />
            </div>
            <div>
              <p className={`text-sm mb-1 ${textSecondaryClass}`}>Usuarios</p>
              <p className={`font-medium ${textPrimaryClass}`}>{users.length}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${iconBgClass}`}>
              <Calendar className={`w-5 h-5 ${isLight ? 'text-violet-600' : 'text-violet-400'}`} />
            </div>
            <div>
              <p className={`text-sm mb-1 ${textSecondaryClass}`}>Fecha de Creación</p>
              <p className={`font-medium ${textPrimaryClass}`}>
                {formatDate(organization.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className={`w-full min-w-0 rounded-xl overflow-hidden border transition-colors ${bgClass}`}>
        <div className={`p-6 border-b transition-colors ${borderClass}`}>
          <h3 className={`text-lg font-bold ${textPrimaryClass}`}>Proyectos</h3>
          <p className={`text-sm mt-1 ${textSecondaryClass}`}>
            {projects.length} proyecto{projects.length !== 1 ? 's' : ''} en total
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <p className={textMutedClass}>No hay proyectos</p>
          </div>
        ) : (
          <div className={`divide-y transition-colors ${dividerClass}`}>
            {projects.map((project) => (
              <div
                key={project.id}
                className={`p-6 transition-colors ${hoverBgClass}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${textPrimaryClass}`}>{project.name}</p>
                    {project.description && (
                      <p className={`text-sm mt-1 ${textSecondaryClass}`}>
                        {project.description}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      project.status === 'active'
                        ? 'success'
                        : project.status === 'completed'
                        ? 'info'
                        : 'default'
                    }
                    size="sm"
                  >
                    {project.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Users */}
      <div className={`w-full min-w-0 rounded-xl overflow-hidden border transition-colors ${bgClass}`}>
        <div className={`p-6 border-b transition-colors ${borderClass}`}>
          <h3 className={`text-lg font-bold ${textPrimaryClass}`}>Usuarios</h3>
          <p className={`text-sm mt-1 ${subtitleClass}`}>
            {users.length} usuario{users.length !== 1 ? 's' : ''} en total
          </p>
        </div>

        {users.length === 0 ? (
          <div className="p-12 text-center">
            <p className={textMutedClass}>No hay usuarios</p>
          </div>
        ) : (
          <div className={`divide-y transition-colors ${dividerClass}`}>
            {users.map((user) => (
              <div
                key={user.id}
                className={`p-6 transition-colors ${hoverBgClass}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${textPrimaryClass}`}>{user.full_name}</p>
                    <p className={`text-sm mt-1 ${textSecondaryClass}`}>{user.email}</p>
                  </div>
                  <Badge
                    variant={user.role === 'org_admin' ? 'info' : 'default'}
                    size="sm"
                  >
                    {user.role === 'org_admin' ? 'Admin' : 'Miembro'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
