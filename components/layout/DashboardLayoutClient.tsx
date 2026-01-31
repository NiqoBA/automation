'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { signOut } from '@/app/actions/auth'
import { Menu, X, LogOut, User, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import ProjectSidebar from '@/components/projects/ProjectSidebar'

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [projectSidebarCollapsed, setProjectSidebarCollapsed] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const focusProjectId = searchParams.get('focusProject')
  const { theme, toggleTheme } = useTheme()

  // Memoizar los iconos para evitar recrearlos en cada render
  const iconCache = useMemo(() => {
    const cache: Record<string, React.ComponentType<{ className?: string }>> = {}
    navItems.forEach((item) => {
      if (!cache[item.icon]) {
        cache[item.icon] = (Icons as any)[item.icon] as React.ComponentType<{ className?: string }>
      }
    })
    return cache
  }, [navItems])

  // Cargar estado del sidebar del localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    if (saved === 'true') {
      setSidebarCollapsed(true)
    }
    const projectSaved = localStorage.getItem('projectSidebarCollapsed')
    if (projectSaved === 'true') {
      setProjectSidebarCollapsed(true)
    }
  }, [])

  const toggleSidebar = useCallback(() => {
    if (focusProjectId) return // Block toggling when focused on a project
    setSidebarCollapsed((prev) => {
      const newState = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebarCollapsed', String(newState))
      }
      return newState
    })
  }, [focusProjectId])

  // Auto-collapse when a project is focused
  useEffect(() => {
    if (focusProjectId) {
      setSidebarCollapsed(true)
    } else {
      const saved = localStorage.getItem('sidebarCollapsed')
      setSidebarCollapsed(saved === 'true')
    }
  }, [focusProjectId])

  const effectiveSidebarWidth = focusProjectId ? 64 : (sidebarCollapsed ? 64 : 224)
  const secondarySidebarWidth = focusProjectId ? (projectSidebarCollapsed ? 64 : 224) : 0
  const mainPadding = effectiveSidebarWidth + secondarySidebarWidth

  return (
    <div className={`min-h-screen flex overflow-x-hidden transition-colors duration-200 ${theme === 'light'
      ? 'bg-gray-50 text-gray-900'
      : 'bg-black text-white'
      }`}>
      {/* Sidebar Desktop */}
      <aside
        className="hidden md:fixed md:inset-y-0 md:flex md:flex-col transition-all duration-300 z-30"
        style={{ width: `${effectiveSidebarWidth}px` }}
      >
        <div className={`flex flex-col flex-grow transition-colors duration-200 ${theme === 'light'
          ? 'bg-white border-r border-gray-200'
          : 'bg-zinc-900 border-r border-zinc-800'
          }`}>
          {/* Logo */}
          <div className={`flex items-center flex-shrink-0 px-4 py-4 border-b transition-colors duration-200 ${theme === 'light' ? 'border-gray-200' : 'border-zinc-800'
            }`}>
            {!sidebarCollapsed ? (
              <Link href={navItems[0]?.href || '#'} className="flex items-center gap-2">
                <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Inflexo AI
                </h1>
              </Link>
            ) : (
              <Link href={navItems[0]?.href || '#'} className="flex items-center justify-center w-full">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">I</span>
                </div>
              </Link>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-grow flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                const IconComponent = iconCache[item.icon]

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} gap-2 px-3 py-2 rounded-lg transition-all duration-150 ${isActive
                      ? theme === 'light'
                        ? 'bg-violet-50 text-violet-600 border border-violet-200'
                        : 'bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-violet-400 border border-violet-500/20'
                      : theme === 'light'
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                      }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" />}
                      {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </div>
                    {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${theme === 'light'
                        ? 'bg-violet-100 text-violet-600'
                        : 'bg-violet-500/20 text-violet-400'
                        }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Theme Toggle */}
            <div className={`px-2 py-2 border-t transition-colors duration-200 ${theme === 'light' ? 'border-gray-200' : 'border-zinc-800'
              }`}>
              <button
                onClick={toggleTheme}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-start'} gap-2 px-3 py-2 rounded-lg transition-colors ${theme === 'light'
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-zinc-400 hover:bg-zinc-800'
                  }`}
                title={sidebarCollapsed ? (theme === 'dark' ? 'Modo claro' : 'Modo oscuro') : undefined}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                {!sidebarCollapsed && (
                  <span className="text-sm">{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
                )}
              </button>
            </div>

            {/* User Info & Logout */}
            <div className={`px-2 py-2 border-t transition-colors duration-200 ${theme === 'light' ? 'border-gray-200' : 'border-zinc-800'
              }`}>
              {!sidebarCollapsed ? (
                <>
                  <div className={`px-3 py-2 rounded-lg mb-2 transition-colors duration-200 ${theme === 'light' ? 'bg-gray-50' : 'bg-zinc-800/50'
                    }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium truncate ${theme === 'light' ? 'text-gray-900' : 'text-zinc-100'
                          }`}>{user.name}</p>
                        <p className={`text-xs truncate ${theme === 'light' ? 'text-gray-500' : 'text-zinc-400'
                          }`}>{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${theme === 'light'
                        ? 'text-gray-600 hover:bg-gray-100'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                        }`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center mx-auto">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center p-2 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                      title="Cerrar Sesión"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Collapse Toggle */}
            <div className={`px-2 py-2 border-t transition-colors duration-200 ${theme === 'light' ? 'border-gray-200' : 'border-zinc-800'
              }`}>
              <button
                onClick={toggleSidebar}
                className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors ${theme === 'light'
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-zinc-400 hover:bg-zinc-800'
                  }`}
                title={sidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Secondary Project Sidebar */}
      {focusProjectId && (
        <ProjectSidebar
          projectId={focusProjectId}
          userRole={user.role}
          leftOffset={effectiveSidebarWidth}
          collapsed={projectSidebarCollapsed}
          onCollapse={setProjectSidebarCollapsed}
        />
      )}

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className={`fixed inset-y-0 left-0 w-64 transition-colors duration-200 ${theme === 'light' ? 'bg-white border-r border-gray-200' : 'bg-zinc-900 border-r border-zinc-800'
            }`}>
            <div className={`flex items-center justify-between px-4 py-4 border-b transition-colors duration-200 ${theme === 'light' ? 'border-gray-200' : 'border-zinc-800'
              }`}>
              <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Inflexo AI
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-zinc-800 text-zinc-400'
                  }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="px-2 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                const IconComponent = iconCache[item.icon]

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-colors ${isActive
                      ? theme === 'light'
                        ? 'bg-violet-50 text-violet-600 border border-violet-200'
                        : 'bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-violet-400 border border-violet-500/20'
                      : theme === 'light'
                        ? 'text-gray-600 hover:bg-gray-100'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${theme === 'light'
                        ? 'bg-violet-100 text-violet-600'
                        : 'bg-violet-500/20 text-violet-400'
                        }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
            <div className={`px-2 py-2 border-t transition-colors duration-200 ${theme === 'light' ? 'border-gray-200' : 'border-zinc-800'
              }`}>
              <button
                onClick={toggleTheme}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${theme === 'light'
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-zinc-400 hover:bg-zinc-800'
                  }`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                <span className="text-sm">{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
              </button>
            </div>
            <div className={`px-2 py-2 border-t transition-colors duration-200 ${theme === 'light' ? 'border-gray-200' : 'border-zinc-800'
              }`}>
              <div className={`px-3 py-2 rounded-lg mb-2 transition-colors duration-200 ${theme === 'light' ? 'bg-gray-50' : 'bg-zinc-800/50'
                }`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${theme === 'light' ? 'text-gray-900' : 'text-zinc-100'
                      }`}>{user.name}</p>
                    <p className={`text-xs truncate ${theme === 'light' ? 'text-gray-500' : 'text-zinc-400'
                      }`}>{user.email}</p>
                  </div>
                </div>
              </div>
              <form action={signOut}>
                <button
                  type="submit"
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${theme === 'light'
                    ? 'text-gray-600 hover:bg-gray-100'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                    }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        className="flex-1 min-w-0 transition-all duration-300"
        style={{ paddingLeft: `${mainPadding}px` }}
      >
        {/* Mobile header */}
        <div className={`md:hidden flex items-center justify-between gap-4 px-4 py-3 border-b transition-colors duration-200 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-zinc-900 border-zinc-800'
          }`}>
          <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent min-w-0 truncate">
            Inflexo AI
          </h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`p-2 flex-shrink-0 rounded-lg transition-colors ${theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-zinc-800 text-zinc-400'
              }`}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Page content */}
        <main className={`p-4 md:p-6 overflow-x-auto min-w-0 transition-colors duration-200 ${theme === 'light' ? 'bg-gray-50' : 'bg-black'
          }`}>
          {children}
        </main>
      </div>
    </div>
  )
}
