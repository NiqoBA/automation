'use client'

import { useState, useEffect } from 'react'
import { getProjectMembers, shareProject, removeProjectMember } from '@/app/actions/project-actions'
import { useTheme } from '@/contexts/ThemeContext'
import { UserPlus, Trash2, Users, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface MembersViewProps {
    projectId: string
}

export default function MembersView({ projectId }: MembersViewProps) {
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [loading, setLoading] = useState(true)
    const [members, setMembers] = useState<any[]>([])
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('viewer')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    useEffect(() => {
        loadMembers()
    }, [projectId])

    const loadMembers = async () => {
        setLoading(true)
        const result = await getProjectMembers(projectId)
        setMembers(result.data || [])
        setLoading(false)
    }

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)
        setSuccess(null)

        const result = await shareProject(projectId, email, role)
        if (result.error) {
            setError(result.error)
        } else {
            setSuccess(result.message || 'Proyecto compartido')
            setEmail('')
            loadMembers()
        }
        setSubmitting(false)
    }

    const handleRemove = async (userId: string) => {
        if (!confirm('¿Remover acceso de este usuario?')) return
        await removeProjectMember(projectId, userId)
        setMembers(members.filter(m => m.user_id !== userId))
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin': return { text: 'Admin', class: 'bg-violet-500/20 text-violet-400' }
            case 'editor': return { text: 'Editor', class: 'bg-blue-500/20 text-blue-400' }
            default: return { text: 'Visualizador', class: 'bg-zinc-500/20 text-zinc-400' }
        }
    }

    const cardBg = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
    const textPrimary = isLight ? 'text-gray-900' : 'text-zinc-100'
    const textSecondary = isLight ? 'text-gray-500' : 'text-zinc-400'
    const inputClass = isLight ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-zinc-800 border-zinc-700 text-zinc-100'

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h2 className={`text-xl font-bold ${textPrimary}`}>Compartir Proyecto</h2>

            {/* Share Form */}
            <div className={`border rounded-xl p-6 ${cardBg}`}>
                <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>Invitar Usuario</h3>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle size={16} />{error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
                        <CheckCircle size={16} />{success}
                    </div>
                )}

                <form onSubmit={handleShare} className="flex flex-wrap gap-3">
                    <div className="flex-1 min-w-[200px]">
                        <label className={`block text-sm font-medium mb-2 ${textSecondary}`}>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="usuario@ejemplo.com"
                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-violet-500 ${inputClass}`}
                        />
                    </div>
                    <div className="w-40">
                        <label className={`block text-sm font-medium mb-2 ${textSecondary}`}>Rol</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-violet-500 ${inputClass}`}
                        >
                            <option value="viewer">Visualizador</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium disabled:opacity-50"
                        >
                            <UserPlus size={18} />
                            {submitting ? 'Invitando...' : 'Invitar'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Members List */}
            <div className={`border rounded-xl ${cardBg}`}>
                <div className={`p-4 border-b ${isLight ? 'border-gray-200' : 'border-zinc-800'}`}>
                    <h3 className={`text-lg font-semibold ${textPrimary}`}>Miembros con Acceso</h3>
                </div>

                {members.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <p className={textSecondary}>No hay miembros adicionales</p>
                    </div>
                ) : (
                    <div className={`divide-y ${isLight ? 'divide-gray-200' : 'divide-zinc-800'}`}>
                        {members.map((member: any) => {
                            const badge = getRoleBadge(member.role)
                            return (
                                <div key={member.id} className={`flex items-center justify-between p-4 ${isLight ? 'hover:bg-gray-50' : 'hover:bg-zinc-800/50'} transition-colors`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                                            <span className="text-violet-400 font-medium">
                                                {member.user?.full_name?.[0] || member.user?.email?.[0] || '?'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className={`font-medium ${textPrimary}`}>{member.user?.full_name || 'Usuario'}</p>
                                            <p className={`text-sm ${textSecondary}`}>{member.user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${badge.class}`}>{badge.text}</span>
                                        <button
                                            onClick={() => handleRemove(member.user_id)}
                                            className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
