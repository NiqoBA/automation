import { requireMasterAdmin } from '@/lib/auth/guards'
import { getAllProjects } from '@/app/actions/master-admin'
import { getProjectDashboard } from '@/app/actions/project-actions'
import AdminProjectsTable from '@/components/admin/AdminProjectsTable'
import CreateProjectAdminButton from '@/components/admin/CreateProjectAdminButton'
import ProjectFocusedView from '@/components/projects/ProjectFocusedView'

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: { focusProject?: string }
}) {
  await requireMasterAdmin()
  const focusProjectId = searchParams.focusProject

  // Si hay un proyecto enfocado, obtener su data
  let projectData = null
  if (focusProjectId) {
    const result = await getProjectDashboard(focusProjectId)
    projectData = result.data
  }

  const projects = await getAllProjects()

  return (
    <div className="min-w-0 max-w-full space-y-6">
      {!focusProjectId && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-black dark:text-zinc-100">Proyectos</h1>
            <p className="text-black dark:text-zinc-400 mt-1">Gestiona todos los proyectos de todas las organizaciones</p>
          </div>
          <div className="flex-shrink-0">
            <CreateProjectAdminButton />
          </div>
        </div>
      )}

      {focusProjectId && projectData ? (
        <ProjectFocusedView
          projectId={focusProjectId}
          projectData={projectData}
          userRole="master_admin"
        />
      ) : (
        <AdminProjectsTable projects={projects} />
      )}
    </div>
  )
}

