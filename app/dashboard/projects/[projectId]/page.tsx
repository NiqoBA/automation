import { getProjectDashboard } from '@/app/actions/project-actions'
import { FileText, History, MessageSquare, Bell } from 'lucide-react'
import Link from 'next/link'

export default async function ProjectOverviewPage({
    params,
}: {
    params: { projectId: string }
}) {
    const result = await getProjectDashboard(params.projectId)

    if (result.error || !result.data) {
        return <div className="text-red-500">{result.error}</div>
    }

    const { stats } = result.data

    const cards = [
        { label: 'Propiedades', value: stats.properties, icon: FileText, href: `/dashboard/projects/${params.projectId}/properties`, color: 'violet' },
        { label: 'Logs de Ejecución', value: stats.logs, icon: History, href: `/dashboard/projects/${params.projectId}/logs`, color: 'blue' },
        { label: 'Tickets', value: stats.tickets, icon: MessageSquare, href: `/dashboard/projects/${params.projectId}/tickets`, color: 'emerald' },
        { label: 'Actualizaciones', value: stats.updates, icon: Bell, href: `/dashboard/projects/${params.projectId}/updates`, color: 'amber' },
    ]

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card) => {
                    const Icon = card.icon
                    return (
                        <Link
                            key={card.label}
                            href={card.href}
                            className="group p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg bg-${card.color}-500/20`}>
                                    <Icon className={`w-6 h-6 text-${card.color}-500`} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-zinc-100 mb-1">{card.value}</p>
                            <p className="text-sm text-zinc-400">{card.label}</p>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
