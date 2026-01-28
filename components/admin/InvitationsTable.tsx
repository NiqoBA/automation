'use client'

import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import { Copy, Mail, X } from 'lucide-react'
import type { Invitation } from '@/lib/types/database'
import { useTheme } from '@/contexts/ThemeContext'

interface InvitationsTableProps {
  invitations: Invitation[]
}

export default function InvitationsTable({ invitations }: InvitationsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Expirada'
    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Mañana'
    return `En ${diffDays} días`
  }

  const copyLink = (token: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://somosinflexo.com'
    const link = `${siteUrl}/auth/register?token=${token}`
    navigator.clipboard.writeText(link)
    setCopiedId(token)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusBadge = (invitation: Invitation) => {
    const isExpired = new Date(invitation.expires_at) < new Date()
    
    if (invitation.status === 'accepted') {
      return <Badge variant="success" size="sm">Aceptada</Badge>
    }
    if (isExpired || invitation.status === 'expired') {
      return <Badge variant="default" size="sm">Expirada</Badge>
    }
    return <Badge variant="info" size="sm">Pendiente</Badge>
  }

  const bgClass = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
  const borderClass = isLight ? 'border-gray-200' : 'border-zinc-800'
  const headerBgClass = isLight ? 'bg-gray-50 border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
  const textPrimaryClass = isLight ? 'text-black' : 'text-zinc-100'
  const textSecondaryClass = isLight ? 'text-gray-600' : 'text-zinc-400'
  const subtitleClass = isLight ? 'text-black' : 'text-zinc-400'
  const textMutedClass = isLight ? 'text-gray-500' : 'text-zinc-400'
  const hoverBgClass = isLight ? 'hover:bg-gray-50' : 'hover:bg-zinc-900/30'
  const dividerClass = isLight ? 'divide-gray-200' : 'divide-zinc-800'
  const buttonHoverClass = isLight ? 'hover:bg-gray-100' : 'hover:bg-zinc-800'

  return (
    <div className={`w-full min-w-0 rounded-xl overflow-hidden border transition-colors ${bgClass}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`border-b transition-colors ${headerBgClass}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Email
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Empresa
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Plan
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Estado
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Enviada
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Expira
              </th>
              <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors ${dividerClass}`}>
            {invitations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <p className={textMutedClass}>No hay invitaciones</p>
                </td>
              </tr>
            ) : (
              invitations.map((invitation) => (
                <tr
                  key={invitation.id}
                  className={`transition-colors ${hoverBgClass}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${textPrimaryClass}`}>
                      {invitation.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {invitation.metadata?.company_name || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {invitation.metadata?.plan || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(invitation)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {formatDate(invitation.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {getRelativeTime(invitation.expires_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {invitation.status === 'pending' && (
                        <>
                          <button
                            onClick={() => copyLink(invitation.token)}
                            className={`p-2 rounded-lg transition-colors ${textSecondaryClass} ${buttonHoverClass} hover:text-violet-400`}
                            title="Copiar Link"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            className={`p-2 rounded-lg transition-colors ${textSecondaryClass} ${buttonHoverClass} hover:text-violet-400`}
                            title="Reenviar Email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        className={`p-2 rounded-lg transition-colors ${textSecondaryClass} ${buttonHoverClass} hover:text-red-400`}
                        title="Cancelar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
