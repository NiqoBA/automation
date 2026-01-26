import { requireProfile } from '@/lib/auth/guards'
import { getProjects } from '@/app/actions/client'
import ProjectsTable from '@/components/client/ProjectsTable'
import CreateProjectButton from '@/components/client/CreateProjectButton'

export default async function ProjectsPage() {
  await requireProfile()

  const projects = await getProjects()

  return (
    <div className="min-w-0 max-w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-zinc-100">Proyectos</h1>
          <p className="text-zinc-400 mt-1">Gestiona los proyectos de tu organización</p>
        </div>
        <div className="flex-shrink-0">
          <CreateProjectButton />
        </div>
      </div>

      <ProjectsTable projects={projects} />
    </div>
  )
}
