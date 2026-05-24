'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeft, Bell, ChevronDown } from 'lucide-react'

const pageNames: Record<string, string> = {
  '/assignments': 'Assignments',
  '/assignments/create': 'Create Assignment',
  '/output': 'Question Paper',
  '/groups': 'My Groups',
  '/toolkit': "AI Teacher's Toolkit",
  '/library': 'My Library',
  '/settings': 'Settings',
}

export default function TopBar() {
  const pathname = usePathname()
  const router = useRouter()

  const pageName =
    Object.entries(pageNames).find(([key]) => pathname.startsWith(key))?.[1] ?? 'Dashboard'

  return (
    <header
      className="flex items-center justify-between h-14 mx-3 mt-3 mb-0 px-3 rounded-2xl sticky top-3 z-20"
      style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm transition-colors hover:bg-gray-50"
        >
          <ChevronLeft className="w-5 h-5" style={{ color: '#303030' }} />
        </button>
        <span className="font-semibold text-base" style={{ color: '#A9A9A9' }}>{pageName}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center relative"
          style={{ background: '#F6F6F6' }}
        >
          <Bell className="w-4 h-4" style={{ color: '#303030' }} />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: '#FF5623' }}
          />
        </button>
        <div className="flex items-center gap-2 cursor-pointer pl-1">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-white text-xs font-medium">J</span>
          </div>
          <span className="font-semibold text-base hidden sm:block" style={{ color: '#303030' }}>
            John Doe
          </span>
          <ChevronDown className="w-4 h-4 hidden sm:block" style={{ color: '#A9A9A9' }} />
        </div>
      </div>
    </header>
  )
}
