'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, FileText, Wand2, Library,
  Settings, Plus, Bell, Menu, BookOpen, Sparkles,
} from 'lucide-react'
import { useAssignmentStore } from '@/store/assignmentStore'

const desktopNavItems = [
  { label: 'Home', icon: LayoutDashboard, href: '/assignments' },
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
      {/* ── Desktop sidebar — floating card ── */}
      <aside
        className="hidden md:flex w-[304px] flex-col fixed left-3 top-3 bottom-3 bg-white rounded-2xl z-30 overflow-y-auto"
        style={{ boxShadow: '0px 16px 48px rgba(0,0,0,0.12), 0px 32px 48px rgba(0,0,0,0.2)' }}
      >
        <div className="flex flex-col gap-8 p-6 flex-1">
          {/* Logo */}
          <Image src="/logo.png" alt="VedaAI" width={130} height={38} priority />

          {/* Create Assignment button */}
          <button
            onClick={() => router.push('/assignments/create')}
            className="w-full h-[42px] rounded-full text-white text-base font-medium flex items-center justify-center gap-2 transition-opacity hover:opacity-90 active:scale-95 duration-100"
            style={{
              background: '#272727',
              boxShadow: 'inset 0px -1px 3.5px rgba(177,177,177,0.6), inset 0px 0px 34.5px rgba(255,255,255,0.25)',
            }}
          >
            <Plus className="w-4 h-4" />
            Create Assignment
          </button>

          {/* Nav */}
          <nav className="flex flex-col gap-1 flex-1">
            {desktopNavItems.map((item) => {
              const Icon = item.icon
              const active =
                item.label === 'Assignments'
                  ? pathname.startsWith('/assignments') || pathname.startsWith('/output')
                  : pathname.startsWith(item.href) && item.href !== '/assignments'
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-[9px] rounded-lg text-base transition-colors"
                  style={{
                    background: active ? '#F0F0F0' : 'transparent',
                    fontWeight: active ? 500 : 400,
                    color: active ? '#303030' : 'rgba(94,94,94,0.8)',
                  }}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.label === 'Assignments' && assignments.length > 0 && (
                    <span
                      className="text-white text-sm font-semibold px-[10px] py-0.5 rounded-[48px]"
                      style={{ background: '#FF5623' }}
                    >
                      {assignments.length}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom */}
          <div className="flex flex-col gap-3">
            <Link
              href="/settings"
              className="flex items-center gap-2 px-3 py-[9px] rounded-lg text-base transition-colors"
              style={{ color: 'rgba(94,94,94,0.8)' }}
            >
              <Settings className="w-[18px] h-[18px]" />
              Settings
            </Link>
            <div className="rounded-2xl p-3 flex items-center gap-4" style={{ background: '#F0F0F0' }}>
              <div
                className="rounded-full w-10 h-10 shrink-0 flex items-center justify-center"
                style={{ background: 'linear-gradient(180deg, #E56820 0%, #D45E3E 100%)' }}
              >
                <span className="text-white font-semibold text-sm">D</span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-base truncate" style={{ color: '#303030' }}>Delhi Public School</p>
                <p className="text-sm truncate" style={{ color: '#5E5E5E' }}>Bokaro Steel City</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile top header ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
        <Link href="/assignments">
          <Image src="/logo.png" alt="VedaAI" width={100} height={30} priority />
        </Link>
        <div className="flex items-center gap-3">
          <button className="relative text-gray-500">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: '#FF5623' }} />
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-white text-xs font-medium">J</span>
          </div>
          <button className="text-gray-600">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── Mobile bottom nav — floating pill ── */}
      <nav
        className="md:hidden fixed bottom-3 left-3 right-3 h-[72px] z-50 flex items-center px-6"
        style={{ background: '#181818', borderRadius: '24px' }}
      >
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const active =
            item.label === 'Assignments'
              ? pathname.startsWith('/assignments') || pathname.startsWith('/output')
              : pathname.startsWith(item.href) && item.href !== '/assignments'
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center h-full gap-0.5"
            >
              {active ? (
                <>
                  <div className="bg-white/10 rounded-xl px-3 py-1">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-semibold text-[10px]">{item.label}</span>
                </>
              ) : (
                <>
                  <Icon className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.25)' }} />
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.label}</span>
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
        <Plus className="w-5 h-5" style={{ color: '#FF5623' }} />
      </button>
    </>
  )
}
