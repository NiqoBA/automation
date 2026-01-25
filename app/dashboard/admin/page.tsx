import { requireMasterAdmin } from '@/lib/auth/guards'
import { getMasterAdminStats, getAllClients } from '@/app/actions/master-admin'
import StatCard from '@/components/dashboard/StatCard'
import { Users, Briefcase, Mail, DollarSign } from 'lucide-react'
import ClientsTable from '@/components/admin/ClientsTable'
import InviteClientButton from '@/components/admin/InviteClientButton'

export default async function MasterAdminDashboard() {
  await requireMasterAdmin()

  const [stats, clients] = await Promise.all([
    getMasterAdminStats(),
    getAllClients(),
  ])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Dashboard</h1>
          <p className="text-zinc-400 mt-1">Panel de control Master Admin</p>
        </div>
        <InviteClientButton />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clientes"
          value={stats.totalClients}
          subtitle="Organizaciones activas"
          icon={Users}
        />
        <StatCard
          title="Total Proyectos"
          value={stats.totalProjects}
          subtitle="Across all clients"
          icon={Briefcase}
        />
        <StatCard
          title="Invitaciones Pendientes"
          value={stats.pendingInvitations}
          subtitle="Waiting response"
          icon={Mail}
        />
        <StatCard
          title="Ingresos del Mes"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          subtitle="Facturas pagadas"
          icon={DollarSign}
        />
      </div>

      {/* Clients Table */}
      <div>
        <h2 className="text-xl font-bold text-zinc-100 mb-4">Todos los Clientes</h2>
        <ClientsTable clients={clients} />
      </div>
    </div>
  )
}
