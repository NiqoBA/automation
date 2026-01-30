import { getProjectProperties } from '@/app/actions/project-actions'
import PropertiesPageClient from './PropertiesPageClient'

export default async function PropertiesPage({
    params,
    searchParams,
}: {
    params: { projectId: string }
    searchParams: { page?: string; neighborhood?: string; portal?: string }
}) {
    const page = parseInt(searchParams.page || '1')
    const initialData = await getProjectProperties(params.projectId, {
        page,
        neighborhood: searchParams.neighborhood,
        portal: searchParams.portal,
    })

    return (
        <div>
            <h2 className="text-xl font-bold text-zinc-100 mb-4">Propiedades</h2>
            <PropertiesPageClient projectId={params.projectId} initialData={initialData} />
        </div>
    )
}
