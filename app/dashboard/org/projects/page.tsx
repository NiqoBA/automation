import { requireProfile } from '@/lib/auth/guards'
import { getProjects } from '@/app/actions/client'
import ProjectsTable from '@/components/client/ProjectsTable'
import CreateProjectButton from '@/components/client/CreateProjectButton'

export default async function ProjectsPage() {
  await requireProfile()

  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Proyectos</h1>
          <p className="text-zinc-400 mt-1">Gestiona los proyectos de tu organización</p>
        </div>
        <CreateProjectButton />
      </div>

      <ProjectsTable projects={projects} />
    </div>
  )
}
