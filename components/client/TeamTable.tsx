'use client'

import Badge from '@/components/ui/Badge'
import { User, Mail, Phone } from 'lucide-react'

interface TeamMember {
  id: string
  full_name: string
  email: string
  phone: string | null
  role: string
  created_at: string
}

interface TeamTableProps {
  members: TeamMember[]
  currentUserId: string
}

export default function TeamTable({ members, currentUserId }: TeamTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-100">Miembros del Equipo</h2>
        <p className="text-sm text-zinc-400 mt-1">
          {members.length} miembro{members.length !== 1 ? 's' : ''} en total
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-900/50 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Fecha de Ingreso
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {members.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className="text-zinc-400">No hay miembros</p>
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-zinc-900/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-100">
                          {member.full_name}
                        </div>
                        <div className="text-xs text-zinc-400">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={member.role === 'org_admin' ? 'info' : 'default'}
                      size="sm"
                    >
                      {member.role === 'org_admin' ? 'Admin' : 'Miembro'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-zinc-400">
                      {member.phone || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-zinc-400">
                      {formatDate(member.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {member.id !== currentUserId && (
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3 py-1 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors">
                          Cambiar Rol
                        </button>
                        <button className="px-3 py-1 text-xs rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                          Eliminar
                        </button>
                      </div>
                    )}
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
