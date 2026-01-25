'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/actions/auth'
import { Menu, X, LogOut, User } from 'lucide-react'
import * as Icons from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}

interface DashboardLayoutClientProps {
  children: React.ReactNode
  navItems: NavItem[]
  user: {
    name: string
    email: string
    role: string
  }
}

export default function DashboardLayoutClient({
  children,
  navItems,
  user,
}: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-zinc-900 border-r border-zinc-800">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-zinc-800">
            <Link href={navItems[0]?.href || '#'} className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Inflexo AI
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-grow flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                const IconComponent = (Icons as any)[item.icon] as React.ComponentType<{ className?: string }>
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-violet-400 border border-violet-500/20'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {IconComponent && <IconComponent className="w-5 h-5" />}
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-violet-500/20 text-violet-400">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* User Info & Logout */}
            <div className="px-4 py-4 border-t border-zinc-800 space-y-2">
              <div className="px-4 py-2 rounded-lg bg-zinc-800/50">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-100 truncate">{user.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-zinc-900 border-r border-zinc-800">
            <div className="flex items-center justify-between px-6 py-6 border-b border-zinc-800">
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Inflexo AI
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                const IconComponent = (Icons as any)[item.icon] as React.ComponentType<{ className?: string }>
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-violet-400 border border-violet-500/20'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {IconComponent && <IconComponent className="w-5 h-5" />}
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-violet-500/20 text-violet-400">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
            <div className="px-4 py-4 border-t border-zinc-800 space-y-2">
              <div className="px-4 py-2 rounded-lg bg-zinc-800/50">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-100 truncate">{user.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:pl-64">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-zinc-800 bg-zinc-900">
          <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Inflexo AI
          </h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Page content */}
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
