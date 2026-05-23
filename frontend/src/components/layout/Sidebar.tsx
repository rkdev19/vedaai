'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Wand2,
  Library,
  Settings,
  Plus,
  Bell,
  Menu,
  BookOpen,
  Sparkles,
} from 'lucide-react'
import { useAssignmentStore } from '@/store/assignmentStore'

const desktopNavItems = [
  { label: 'Home', icon: LayoutDashboard, href: '/' },
  { label: 'My Groups', icon: Users, href: '/groups' },
  { label: 'Assignments', icon: FileText, href: '/assignments' },
  { label: "AI Teacher's Toolkit", icon: Wand2, href: '/toolkit' },
  { label: 'My Library', icon: Library, href: '/library' },
]

const mobileNavItems = [
  { label: 'Home', icon: LayoutDashboard, href: '/assignments' },
  { label: 'Assignments', icon: FileText, href: '/assignments' },
  { label: 'Library', icon: BookOpen, href: '/library' },
  { label: 'AI Toolkit', icon: Sparkles, href: '/toolkit' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const assignments = useAssignmentStore((s) => s.assignments)

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-64 flex-col fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm z-30">
        {/* Logo */}
        <div className="flex items-center gap-2 p-6">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">VedaAI</span>
        </div>

        {/* Create button */}
        <div className="px-4">
          <Link
            href="/assignments/create"
            className="flex items-center justify-center gap-2 w-full rounded-full bg-gray-900 text-white py-2.5 text-sm font-medium hover:bg-gray-800 hover:ring-2 hover:ring-orange-400 hover:ring-offset-1 active:scale-95 transition-all duration-100"
          >
            <Plus className="w-4 h-4" />
            Create Assignment
          </Link>
        </div>

        {/* Nav */}
        <nav className="mt-8 flex flex-col gap-1 px-3 flex-1">
          {desktopNavItems.map((item) => {
            const Icon = item.icon
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-gray-100 text-gray-900 font-medium border-l-2 border-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 border-l-2 border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.label === 'Assignments' && assignments.length > 0 && (
                  <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
                    {assignments.length}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 flex flex-col gap-3">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <div className="rounded-xl bg-gray-50 border border-gray-200 shadow-sm p-3 flex items-center gap-3">
            <div className="rounded-full w-10 h-10 bg-gradient-to-br from-orange-200 to-orange-100 shrink-0 flex items-center justify-center">
              <span className="text-orange-600 font-semibold text-sm">D</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">Delhi Public School</p>
              <p className="text-xs text-gray-500 truncate">Bokaro Steel City</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile top header ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
        <Link href="/assignments" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">V</span>
          </div>
          <span className="font-bold text-gray-900 text-base">VedaAI</span>
        </Link>

        <div className="flex items-center gap-3">
          <button className="relative text-gray-500">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-white text-xs font-medium">J</span>
          </div>
          <button className="text-gray-600">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-gray-900 z-50 flex items-center">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const active =
            item.href === '/assignments'
              ? pathname.startsWith('/assignments') || pathname.startsWith('/output')
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center h-full"
            >
              {active ? (
                <>
                  <div className="bg-white/10 rounded-xl px-3 py-1 mb-0.5">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white text-[10px] font-medium">{item.label}</span>
                </>
              ) : (
                <>
                  <Icon className="w-5 h-5 text-gray-500 mb-0.5" />
                  <span className="text-gray-500 text-[10px]">{item.label}</span>
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── Mobile floating + button ── */}
      <button
        onClick={() => router.push('/assignments/create')}
        className="md:hidden fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center active:scale-95 transition-transform duration-100"
      >
        <Plus className="w-5 h-5 text-orange-500" />
      </button>
    </>
  )
}
