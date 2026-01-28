import { requireMasterAdmin } from '@/lib/auth/guards'
import { getAllProjects } from '@/app/actions/master-admin'
import AdminProjectsTable from '@/components/admin/AdminProjectsTable'
import CreateProjectAdminButton from '@/components/admin/CreateProjectAdminButton'

export default async function AdminProjectsPage() {
  await requireMasterAdmin()

  const projects = await getAllProjects()

  return (
    <div className="min-w-0 max-w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-100">Proyectos</h1>
          <p className="text-black dark:text-zinc-400 mt-1">Gestiona todos los proyectos de todas las organizaciones</p>
        </div>
        <div className="flex-shrink-0">
          <CreateProjectAdminButton />
        </div>
      </div>

      <AdminProjectsTable projects={projects} />
    </div>
  )
}
