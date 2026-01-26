'use client'

import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import { Copy, Mail, X } from 'lucide-react'
import type { Invitation } from '@/lib/types/database'

interface InvitationsTableProps {
  invitations: Invitation[]
}

export default function InvitationsTable({ invitations }: InvitationsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
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

  return (
    <div className="w-full min-w-0 bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-100">Invitaciones</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Gestiona las invitaciones enviadas a clientes
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-900/50 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Enviada
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Expira
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {invitations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <p className="text-zinc-400">No hay invitaciones</p>
                </td>
              </tr>
            ) : (
              invitations.map((invitation) => (
                <tr
                  key={invitation.id}
                  className="hover:bg-zinc-900/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-zinc-100">
                      {invitation.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-zinc-400">
                      {invitation.metadata?.company_name || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-zinc-400">
                      {invitation.metadata?.plan || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(invitation)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-zinc-400">
                      {formatDate(invitation.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-zinc-400">
                      {getRelativeTime(invitation.expires_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {invitation.status === 'pending' && (
                        <>
                          <button
                            onClick={() => copyLink(invitation.token)}
                            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-violet-400 transition-colors"
                            title="Copiar Link"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-violet-400 transition-colors"
                            title="Reenviar Email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
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
