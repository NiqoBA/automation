import { requireProfile } from '@/lib/auth/guards'
import { getTeamMembers } from '@/app/actions/client'
import TeamTable from '@/components/client/TeamTable'
import InviteTeamButton from '@/components/client/InviteTeamButton'

export default async function TeamPage() {
  const { profile } = await requireProfile()

  const members = await getTeamMembers()

  return (
    <div className="min-w-0 max-w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-100">Equipo</h1>
          <p className="text-black dark:text-zinc-400 mt-1">Gestiona los miembros de tu organización</p>
        </div>
        {['org_admin', 'master_admin'].includes(profile.role) && (
          <div className="flex-shrink-0">
            <InviteTeamButton />
          </div>
        )}
      </div>

      <TeamTable members={members} currentUserId={profile.id} />
    </div>
  )
}
