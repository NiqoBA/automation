import { requireMasterAdmin } from '@/lib/auth/guards'
import { getClientDashboard } from '@/app/actions/master-admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ClientDashboardView from '@/components/admin/ClientDashboardView'

export default async function ViewClientPage({
  params,
}: {
  params: { orgId: string }
}) {
  await requireMasterAdmin()

  const result = await getClientDashboard(params.orgId)

  if (!result.success || !result.data) {
    redirect('/dashboard/admin')
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/admin"
            className="p-2 rounded-lg hover:bg-violet-500/20 text-violet-400 hover:text-violet-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-violet-400 font-medium">
              Viendo como: <span className="text-violet-300">{result.data.organization.name}</span>
            </p>
            <p className="text-sm text-violet-400/70 mt-1">
              Modo vista - Estás viendo el dashboard de este cliente
            </p>
          </div>
        </div>
      </div>

      <ClientDashboardView
        organization={result.data.organization}
        users={result.data.users}
        projects={result.data.projects}
      />
    </div>
  )
}
