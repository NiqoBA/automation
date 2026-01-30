import { getProjectUpdates } from '@/app/actions/project-actions'
import { Bell, Info, Sparkles, Wrench, AlertTriangle } from 'lucide-react'

export default async function UpdatesPage({
    params,
}: {
    params: { projectId: string }
}) {
    const result = await getProjectUpdates(params.projectId)

    if (result.error) {
        return <div className="text-red-500">{result.error}</div>
    }

    const updates = result.data || []

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'feature':
                return <Sparkles className="w-5 h-5 text-violet-500" />
            case 'fix':
                return <Wrench className="w-5 h-5 text-emerald-500" />
            case 'breaking':
                return <AlertTriangle className="w-5 h-5 text-red-500" />
            default:
                return <Info className="w-5 h-5 text-blue-500" />
        }
    }

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'feature':
                return { text: 'Nueva Función', class: 'bg-violet-500/20 text-violet-400' }
            case 'fix':
                return { text: 'Corrección', class: 'bg-emerald-500/20 text-emerald-400' }
            case 'breaking':
                return { text: 'Cambio Importante', class: 'bg-red-500/20 text-red-400' }
            default:
                return { text: 'Información', class: 'bg-blue-500/20 text-blue-400' }
        }
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-UY', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
    }

    return (
        <div>
            <h2 className="text-xl font-bold text-zinc-100 mb-4">Actualizaciones</h2>

            {updates.length === 0 ? (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                    <Bell className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400">No hay actualizaciones todavía</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {updates.map((update: any) => {
                        const badge = getTypeBadge(update.update_type)
                        return (
                            <div
                                key={update.id}
                                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:bg-zinc-800/50 transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        {getTypeIcon(update.update_type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-zinc-100 font-semibold">{update.title}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.class}`}>
                                                {badge.text}
                                            </span>
                                        </div>
                                        {update.content && (
                                            <p className="text-zinc-400 text-sm mb-3 whitespace-pre-wrap">{update.content}</p>
                                        )}
                                        <div className="text-xs text-zinc-500">
                                            {formatDate(update.created_at)}
                                            {update.created_by_profile && (
                                                <span> · {update.created_by_profile.full_name}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
