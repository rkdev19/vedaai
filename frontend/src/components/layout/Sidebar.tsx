'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Wand2,
  Library,
  Settings,
  Plus,
} from 'lucide-react'
import { useAssignmentStore } from '@/store/assignmentStore'

const navItems = [
  { label: 'Home', icon: LayoutDashboard, href: '/' },
  { label: 'My Groups', icon: Users, href: '/groups' },
  { label: 'Assignments', icon: FileText, href: '/assignments' },
  { label: "AI Teacher's Toolkit", icon: Wand2, href: '/toolkit' },
  { label: 'My Library', icon: Library, href: '/library' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const assignments = useAssignmentStore((s) => s.assignments)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-30">
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
            className="flex items-center justify-center gap-2 w-full rounded-full bg-gray-900 text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Assignment
          </Link>
        </div>

        {/* Nav */}
        <nav className="mt-8 flex flex-col gap-1 px-3 flex-1">
          {navItems.map((item) => {
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
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
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
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 flex items-center gap-3">
            <div className="rounded-full w-10 h-10 bg-orange-100 shrink-0 flex items-center justify-center">
              <span className="text-orange-600 font-semibold text-sm">D</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">Delhi Public School</p>
              <p className="text-xs text-gray-500 truncate">Bokaro Steel City</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 text-white z-30 flex">
        {[navItems[0], navItems[2], navItems[4], navItems[3]].map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs ${
                active ? 'text-orange-400' : 'text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label.split("'")[0].split(' ')[0]}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
