import { Users, UserPlus, Mail, TrendingUp } from 'lucide-react'
import StatCard from '@/components/ui/StatCard'

interface DashboardStatsProps {
  stats: {
    totalClients: number
    totalUsers: number
    pendingInvitations: number
    activeThisMonth: number
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Clientes"
        value={stats.totalClients}
        icon={Users}
        description="Organizaciones activas"
      />
      <StatCard
        title="Total Usuarios"
        value={stats.totalUsers}
        icon={UserPlus}
        description="Usuarios registrados"
      />
      <StatCard
        title="Invitaciones Pendientes"
        value={stats.pendingInvitations}
        icon={Mail}
        description="Esperando respuesta"
      />
      <StatCard
        title="Clientes Activos este Mes"
        value={stats.activeThisMonth}
        icon={TrendingUp}
        description="Últimos 30 días"
      />
    </div>
  )
}
