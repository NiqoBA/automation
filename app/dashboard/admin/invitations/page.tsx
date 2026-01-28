import { requireMasterAdmin } from '@/lib/auth/guards'
import { getInvitations } from '@/app/actions/master-admin'
import InvitationsTable from '@/components/admin/InvitationsTable'
import InviteClientButton from '@/components/admin/InviteClientButton'

export default async function InvitationsPage() {
  await requireMasterAdmin()

  const invitations = await getInvitations()

  return (
    <div className="min-w-0 max-w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-100">Invitaciones</h1>
          <p className="text-black dark:text-zinc-400 mt-1">Gestiona las invitaciones enviadas</p>
        </div>
        <div className="flex-shrink-0">
          <InviteClientButton />
        </div>
      </div>

      <InvitationsTable invitations={invitations} />
    </div>
  )
}
