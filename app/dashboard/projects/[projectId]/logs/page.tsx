import { getProjectLogs } from '@/app/actions/project-actions'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

export default async function LogsPage({
    params,
}: {
    params: { projectId: string }
}) {
    const result = await getProjectLogs(params.projectId)

    if (result.error) {
        return <div className="text-red-500">{result.error}</div>
    }

    const logs = result.data || []

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-emerald-500" />
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />
            case 'running':
                return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
            default:
                return <AlertCircle className="w-5 h-5 text-zinc-500" />
        }
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('es-UY', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div>
            <h2 className="text-xl font-bold text-zinc-100 mb-4">Logs de Ejecución</h2>

            {logs.length === 0 ? (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                    <Clock className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400">No hay logs de ejecución todavía</p>
                </div>
            ) : (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-zinc-800/50">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-zinc-300">Estado</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-zinc-300">Inicio</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-zinc-300">Fin</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-zinc-300">Propiedades</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-zinc-300">Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log: any) => (
                                <tr key={log.id} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(log.status)}
                                            <span className="text-sm text-zinc-300 capitalize">{log.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-zinc-400">
                                        {formatDate(log.start_time)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-zinc-400">
                                        {log.end_time ? formatDate(log.end_time) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-zinc-100 font-semibold">
                                        {log.total_found || 0}
                                    </td>
                                    <td className="px-4 py-3">
                                        {log.error_message ? (
                                            <span className="text-sm text-red-400 truncate max-w-[200px] block" title={log.error_message}>
                                                {log.error_message}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-zinc-500">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
