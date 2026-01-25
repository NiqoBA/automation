import { requireProfile } from '@/lib/auth/guards'
import { getClientStats, getProjects } from '@/app/actions/client'
import StatCard from '@/components/dashboard/StatCard'
import { Users, Briefcase, TrendingUp, CheckSquare } from 'lucide-react'
import ProjectsTable from '@/components/client/ProjectsTable'
import CreateProjectButton from '@/components/client/CreateProjectButton'

export default async function ClientDashboard() {
  const { profile } = await requireProfile()

  const [stats, projects] = await Promise.all([
    getClientStats(),
    getProjects(),
  ])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Dashboard</h1>
          <p className="text-zinc-400 mt-1">Panel de control de tu organización</p>
        </div>
        <CreateProjectButton />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Usuarios"
          value={stats.totalUsers}
          subtitle="Active members"
          icon={Users}
        />
        <StatCard
          title="Total Proyectos"
          value={stats.totalProjects}
          subtitle={`${stats.totalProjects - stats.completedProjects} activos, ${stats.completedProjects} completados`}
          icon={Briefcase}
        />
        <StatCard
          title="Proyectos Este Mes"
          value={stats.projectsThisMonth}
          subtitle="Creados últimos 30 días"
          icon={TrendingUp}
        />
        <StatCard
          title="Tareas Pendientes"
          value="0"
          subtitle="Placeholder"
          icon={CheckSquare}
        />
      </div>

      {/* Projects Table */}
      <div>
        <h2 className="text-xl font-bold text-zinc-100 mb-4">Proyectos</h2>
        <ProjectsTable projects={projects} />
      </div>
    </div>
  )
}
