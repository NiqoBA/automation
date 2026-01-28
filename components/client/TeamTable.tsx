'use client'

import Badge from '@/components/ui/Badge'
import { User, Mail, Phone } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

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
  const { theme } = useTheme()
  const isLight = theme === 'light'
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const bgClass = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
  const borderClass = isLight ? 'border-gray-200' : 'border-zinc-800'
  const headerBgClass = isLight ? 'bg-gray-50 border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
  const textPrimaryClass = isLight ? 'text-black' : 'text-zinc-100'
  const textSecondaryClass = isLight ? 'text-gray-600' : 'text-zinc-400'
  const textMutedClass = isLight ? 'text-gray-500' : 'text-zinc-400'
  const subtitleClass = isLight ? 'text-black' : 'text-zinc-400'
  const hoverBgClass = isLight ? 'hover:bg-gray-50' : 'hover:bg-zinc-900/30'
  const dividerClass = isLight ? 'divide-gray-200' : 'divide-zinc-800'
  const buttonBgClass = isLight ? 'bg-gray-100 hover:bg-gray-200' : 'bg-zinc-800 hover:bg-zinc-700'
  const buttonTextClass = isLight ? 'text-gray-700' : 'text-zinc-300'
  const iconBgClass = isLight ? 'bg-gray-100' : 'bg-zinc-800'

  return (
    <div className={`w-full min-w-0 rounded-xl overflow-hidden border transition-colors ${bgClass}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`border-b transition-colors ${headerBgClass}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Usuario
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Rol
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Teléfono
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Fecha de Ingreso
              </th>
              <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors ${dividerClass}`}>
            {members.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className={textMutedClass}>No hay miembros</p>
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr
                  key={member.id}
                  className={`transition-colors ${hoverBgClass}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${textPrimaryClass}`}>
                          {member.full_name}
                        </div>
                        <div className={`text-xs ${textSecondaryClass}`}>{member.email}</div>
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
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {member.phone || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {formatDate(member.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {member.id !== currentUserId && (
                      <div className="flex items-center justify-end gap-2">
                        <button className={`px-3 py-1 text-xs rounded-lg transition-colors ${buttonBgClass} ${buttonTextClass}`}>
                          Cambiar Rol
                        </button>
                        <button className={`px-3 py-1 text-xs rounded-lg transition-colors ${isLight ? 'bg-red-50 hover:bg-red-100 text-red-700' : 'bg-red-500/10 hover:bg-red-500/20 text-red-400'}`}>
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
