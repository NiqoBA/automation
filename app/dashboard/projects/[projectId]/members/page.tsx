import { getProjectMembers } from '@/app/actions/project-actions'
import { requireMasterAdmin } from '@/lib/auth/guards'
import MembersPageClient from './MembersPageClient'
import { redirect } from 'next/navigation'

export default async function MembersPage({
    params,
}: {
    params: { projectId: string }
}) {
    // Solo master admin puede acceder a esta página
    try {
        await requireMasterAdmin()
    } catch {
        redirect(`/dashboard/projects/${params.projectId}`)
    }

    const result = await getProjectMembers(params.projectId)

    if (result.error) {
        return <div className="text-red-500">{result.error}</div>
    }

    return <MembersPageClient projectId={params.projectId} members={result.data || []} />
}
