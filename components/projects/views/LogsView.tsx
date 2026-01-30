'use client'

import { useState, useEffect } from 'react'
import { getProjectLogs } from '@/app/actions/project-actions'
import { useTheme } from '@/contexts/ThemeContext'
import { CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'

interface LogsViewProps {
    projectId: string
}

export default function LogsView({ projectId }: LogsViewProps) {
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [loading, setLoading] = useState(true)
    const [logs, setLogs] = useState<any[]>([])

    useEffect(() => {
        const loadLogs = async () => {
            setLoading(true)
            const result = await getProjectLogs(projectId)
            setLogs(result.data || [])
            setLoading(false)
        }
        loadLogs()
    }, [projectId])

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

    const cardBg = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
    const headerBg = isLight ? 'bg-gray-50' : 'bg-zinc-800/50'
    const textPrimary = isLight ? 'text-gray-900' : 'text-zinc-100'
    const textSecondary = isLight ? 'text-gray-500' : 'text-zinc-400'

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h2 className={`text-xl font-bold ${textPrimary}`}>Logs de Ejecución</h2>

            {logs.length === 0 ? (
                <div className={`border rounded-xl p-12 text-center ${cardBg}`}>
                    <Clock className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className={textSecondary}>No hay logs de ejecución todavía</p>
                </div>
            ) : (
                <div className={`border rounded-xl overflow-hidden ${cardBg}`}>
                    <table className="w-full">
                        <thead className={headerBg}>
                            <tr>
                                <th className={`text-left px-4 py-3 text-sm font-medium ${textSecondary}`}>Estado</th>
                                <th className={`text-left px-4 py-3 text-sm font-medium ${textSecondary}`}>Inicio</th>
                                <th className={`text-left px-4 py-3 text-sm font-medium ${textSecondary}`}>Fin</th>
                                <th className={`text-left px-4 py-3 text-sm font-medium ${textSecondary}`}>Propiedades</th>
                                <th className={`text-left px-4 py-3 text-sm font-medium ${textSecondary}`}>Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log: any) => (
                                <tr key={log.id} className={`border-t ${isLight ? 'border-gray-100 hover:bg-gray-50' : 'border-zinc-800 hover:bg-zinc-800/50'} transition-colors`}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(log.status)}
                                            <span className={`text-sm capitalize ${textSecondary}`}>{log.status}</span>
                                        </div>
                                    </td>
                                    <td className={`px-4 py-3 text-sm ${textSecondary}`}>
                                        {formatDate(log.start_time)}
                                    </td>
                                    <td className={`px-4 py-3 text-sm ${textSecondary}`}>
                                        {log.end_time ? formatDate(log.end_time) : '-'}
                                    </td>
                                    <td className={`px-4 py-3 text-sm font-semibold ${textPrimary}`}>
                                        {log.total_found || 0}
                                    </td>
                                    <td className="px-4 py-3">
                                        {log.error_message ? (
                                            <span className="text-sm text-red-400 truncate max-w-[200px] block" title={log.error_message}>
                                                {log.error_message}
                                            </span>
                                        ) : (
                                            <span className={`text-sm ${textSecondary}`}>-</span>
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
