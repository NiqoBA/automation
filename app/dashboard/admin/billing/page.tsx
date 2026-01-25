import { requireMasterAdmin } from '@/lib/auth/guards'
import { getInvoices, getMasterAdminStats } from '@/app/actions/master-admin'
import StatCard from '@/components/dashboard/StatCard'
import { DollarSign, CreditCard, AlertCircle, TrendingUp } from 'lucide-react'
import InvoicesTable from '@/components/admin/InvoicesTable'

export default async function BillingPage() {
  await requireMasterAdmin()

  const [invoices, stats] = await Promise.all([
    getInvoices(),
    getMasterAdminStats(),
  ])

  // Calcular stats de facturación
  const totalInvoiced = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0)

  const pendingAmount = invoices
    .filter((inv) => inv.status === 'pending')
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0)

  const overdueCount = invoices.filter((inv) => inv.status === 'overdue').length

  const paidCount = invoices.filter((inv) => inv.status === 'paid').length
  const totalCount = invoices.length
  const collectionRate = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Facturación</h1>
        <p className="text-zinc-400 mt-1">Gestiona las facturas y pagos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Facturado"
          value={`$${totalInvoiced.toLocaleString()}`}
          subtitle="Este mes"
          icon={DollarSign}
        />
        <StatCard
          title="Pendiente de Cobro"
          value={`$${pendingAmount.toLocaleString()}`}
          subtitle="Facturas pendientes"
          icon={CreditCard}
        />
        <StatCard
          title="Facturas Vencidas"
          value={overdueCount}
          subtitle="Requieren atención"
          icon={AlertCircle}
        />
        <StatCard
          title="Tasa de Cobro"
          value={`${collectionRate}%`}
          subtitle="Facturas pagadas"
          icon={TrendingUp}
        />
      </div>

      {/* Invoices Table */}
      <div>
        <h2 className="text-xl font-bold text-zinc-100 mb-4">Todas las Facturas</h2>
        <InvoicesTable invoices={invoices} />
      </div>
    </div>
  )
}
