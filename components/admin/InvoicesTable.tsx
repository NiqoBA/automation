'use client'

import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import type { Invoice } from '@/lib/types/database'
import { useTheme } from '@/contexts/ThemeContext'

interface InvoiceWithOrg extends Invoice {
  organizations?: {
    id: string
    name: string
  }
}

interface InvoicesTableProps {
  invoices: InvoiceWithOrg[]
}

export default function InvoicesTable({ invoices }: InvoicesTableProps) {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success" size="sm">Pagada</Badge>
      case 'overdue':
        return <Badge variant="error" size="sm">Vencida</Badge>
      case 'cancelled':
        return <Badge variant="default" size="sm">Cancelada</Badge>
      default:
        return <Badge variant="info" size="sm">Pendiente</Badge>
    }
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

  return (
    <div className={`w-full min-w-0 rounded-xl overflow-hidden border transition-colors ${bgClass}`}>
      <div className="overflow-x-auto scrollbar-soft">
        <table className="w-full">
          <thead className={`border-b transition-colors ${headerBgClass}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                #Factura
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Cliente
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Monto
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Estado
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Fecha Emisión
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Fecha Vencimiento
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Fecha Pago
              </th>
              <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${textSecondaryClass}`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors ${dividerClass}`}>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <p className={textMutedClass}>No hay facturas</p>
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className={`transition-colors ${hoverBgClass}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${textPrimaryClass}`}>
                      {invoice.invoice_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {invoice.organizations?.name || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${textPrimaryClass}`}>
                      {formatCurrency(Number(invoice.amount), invoice.currency)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {formatDate(invoice.issue_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {formatDate(invoice.due_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      {invoice.paid_date ? formatDate(invoice.paid_date) : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className={`px-3 py-1 text-xs rounded-lg transition-colors ${buttonBgClass} ${buttonTextClass}`}>
                        Ver PDF
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
