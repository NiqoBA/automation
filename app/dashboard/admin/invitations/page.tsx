import { requireMasterAdmin } from '@/lib/auth/guards'
import { getInvitations } from '@/app/actions/master-admin'
import InvitationsTable from '@/components/admin/InvitationsTable'
import InviteClientButton from '@/components/admin/InviteClientButton'

export default async function InvitationsPage() {
  await requireMasterAdmin()

  const invitations = await getInvitations()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Invitaciones</h1>
          <p className="text-zinc-400 mt-1">Gestiona las invitaciones enviadas</p>
        </div>
        <InviteClientButton />
      </div>

      <InvitationsTable invitations={invitations} />
    </div>
  )
}
