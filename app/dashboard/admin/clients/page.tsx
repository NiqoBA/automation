import { requireMasterAdmin } from '@/lib/auth/guards'
import { getAllClients } from '@/app/actions/master-admin'
import ClientsTable from '@/components/admin/ClientsTable'
import InviteClientButton from '@/components/admin/InviteClientButton'

export default async function ClientsPage() {
  await requireMasterAdmin()

  const clients = await getAllClients()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Clientes</h1>
          <p className="text-zinc-400 mt-1">Gestiona todas las organizaciones</p>
        </div>
        <InviteClientButton />
      </div>

      <ClientsTable clients={clients} />
    </div>
  )
}
