'use client'

import type { ContactSubmission } from '@/lib/types/database'
import { useTheme } from '@/contexts/ThemeContext'

interface ContactSubmissionsTableProps {
  submissions: ContactSubmission[]
}

const SERVICE_LABELS: Record<string, string> = {
  automations: 'Automatizaciones',
}

export default function ContactSubmissionsTable({
  submissions,
}: ContactSubmissionsTableProps) {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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

  return (
    <div className={`w-full min-w-0 rounded-xl overflow-hidden border transition-colors ${bgClass}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`border-b transition-colors ${headerBgClass}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Nombre
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Email
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Empresa
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Teléfono
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Servicio
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Mensaje
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors ${dividerClass}`}>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <p className={textMutedClass}>No hay envíos de contacto</p>
                </td>
              </tr>
            ) : (
              submissions.map((s) => (
                <tr
                  key={s.id}
                  className={`transition-colors ${hoverBgClass}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${textPrimaryClass}`}>
                      {s.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`mailto:${s.email}`}
                      className={`text-sm transition-colors ${isLight ? 'text-violet-600 hover:text-violet-700' : 'text-violet-400 hover:text-violet-300'}`}
                    >
                      {s.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>{s.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {s.phone || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {SERVICE_LABELS[s.service] ?? s.service}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className={`text-sm line-clamp-2 ${textSecondaryClass}`}>
                      {s.message || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {formatDate(s.created_at)}
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
