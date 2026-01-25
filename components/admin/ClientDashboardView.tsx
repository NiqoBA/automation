import { Users, Briefcase, Calendar, Building2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import type { Organization, Profile, Project } from '@/lib/types/database'

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Organization Info */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-2">
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
            <div className="p-2 rounded-lg bg-zinc-800">
              <Building2 className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 mb-1">RUT</p>
              <p className="text-zinc-100 font-medium">{organization.rut}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-zinc-800">
              <Users className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 mb-1">Usuarios</p>
              <p className="text-zinc-100 font-medium">{users.length}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-zinc-800">
              <Calendar className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 mb-1">Fecha de Creación</p>
              <p className="text-zinc-100 font-medium">
                {formatDate(organization.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h3 className="text-lg font-bold text-zinc-100">Proyectos</h3>
          <p className="text-sm text-zinc-400 mt-1">
            {projects.length} proyecto{projects.length !== 1 ? 's' : ''} en total
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-zinc-400">No hay proyectos</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-6 hover:bg-zinc-900/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-100 font-medium">{project.name}</p>
                    {project.description && (
                      <p className="text-sm text-zinc-400 mt-1">
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
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h3 className="text-lg font-bold text-zinc-100">Usuarios</h3>
          <p className="text-sm text-zinc-400 mt-1">
            {users.length} usuario{users.length !== 1 ? 's' : ''} en total
          </p>
        </div>

        {users.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-zinc-400">No hay usuarios</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-6 hover:bg-zinc-900/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-100 font-medium">{user.full_name}</p>
                    <p className="text-sm text-zinc-400 mt-1">{user.email}</p>
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
