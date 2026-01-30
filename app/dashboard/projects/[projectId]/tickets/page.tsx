import { getProjectTickets } from '@/app/actions/project-actions'
import TicketsPageClient from './TicketsPageClient'

export default async function TicketsPage({
    params,
}: {
    params: { projectId: string }
}) {
    const result = await getProjectTickets(params.projectId)

    if (result.error) {
        return <div className="text-red-500">{result.error}</div>
    }

    return <TicketsPageClient projectId={params.projectId} initialTickets={result.data || []} />
}
