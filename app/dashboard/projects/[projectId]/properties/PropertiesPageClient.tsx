'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getProjectProperties } from '@/app/actions/project-actions'
import PropertiesTable from '@/components/projects/PropertiesTable'
import { Loader2 } from 'lucide-react'

interface PropertiesPageClientProps {
    projectId: string
    initialData: Awaited<ReturnType<typeof getProjectProperties>>
}

export default function PropertiesPageClient({ projectId, initialData }: PropertiesPageClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [data, setData] = useState(initialData)
    const [loading, setLoading] = useState(false)

    const currentPage = parseInt(searchParams.get('page') || '1')
    const neighborhood = searchParams.get('neighborhood') || undefined
    const portal = searchParams.get('portal') || undefined

    const handlePageChange = async (newPage: number) => {
        setLoading(true)
        const params = new URLSearchParams()
        params.set('page', newPage.toString())
        if (neighborhood) params.set('neighborhood', neighborhood)
        if (portal) params.set('portal', portal)
        router.push(`/dashboard/projects/${projectId}/properties?${params.toString()}`)
    }

    const handleFilter = async (filters: { neighborhood?: string; portal?: string }) => {
        setLoading(true)
        const params = new URLSearchParams()
        params.set('page', '1')
        if (filters.neighborhood) params.set('neighborhood', filters.neighborhood)
        if (filters.portal) params.set('portal', filters.portal)
        router.push(`/dashboard/projects/${projectId}/properties?${params.toString()}`)
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const result = await getProjectProperties(projectId, {
                page: currentPage,
                neighborhood,
                portal,
            })
            setData(result)
            setLoading(false)
        }
        fetchData()
    }, [projectId, currentPage, neighborhood, portal])

    if (!data.data) {
        return <div className="text-red-500">{data.error}</div>
    }

    return (
        <div className="relative">
            {loading && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10 rounded-xl">
                    <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                </div>
            )}
            <PropertiesTable
                properties={data.data.properties}
                total={data.data.total}
                page={data.data.page}
                perPage={data.data.perPage}
                totalPages={data.data.totalPages}
                onPageChange={handlePageChange}
                onFilter={handleFilter}
            />
        </div>
    )
}
