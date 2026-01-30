import { requireProfile } from '@/lib/auth/guards'
import { getProjects } from '@/app/actions/client'
import { getProjectDashboard } from '@/app/actions/project-actions'
import ProjectsTable from '@/components/client/ProjectsTable'
import CreateProjectButton from '@/components/client/CreateProjectButton'
import ProjectFocusedView from '@/components/projects/ProjectFocusedView'

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { focusProject?: string }
}) {
  const { profile } = await requireProfile()
  const focusProjectId = searchParams.focusProject

  // Si hay un proyecto enfocado, obtener su data
  let projectData = null
  if (focusProjectId) {
    const result = await getProjectDashboard(focusProjectId)
    projectData = result.data
  }

  const projects = await getProjects()

  // Solo master admin o email específico puede crear proyectos
  const canCreateProjects = profile.role === 'master_admin' || profile.email === 'niqodt@gmail.com'

  return (
    <div className="min-w-0 max-w-full space-y-6">
      {!focusProjectId && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-black dark:text-zinc-100">Proyectos</h1>
            <p className="text-black dark:text-zinc-400 mt-1">Gestiona los proyectos de tu organización</p>
          </div>
          {canCreateProjects && (
            <div className="flex-shrink-0">
              <CreateProjectButton />
            </div>
          )}
        </div>
      )}

      {focusProjectId && projectData ? (
        <ProjectFocusedView
          projectId={focusProjectId}
          projectData={projectData}
          userRole={profile.role}
        />
      ) : (
        <ProjectsTable projects={projects} userRole={profile.role} />
      )}
    </div>
  )
}


