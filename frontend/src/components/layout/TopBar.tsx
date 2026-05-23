'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeft, Bell, ChevronDown } from 'lucide-react'

const pageNames: Record<string, string> = {
  '/assignments': 'Assignments',
  '/assignments/create': 'Create Assignment',
  '/output': 'Question Paper',
}

export default function TopBar() {
  const pathname = usePathname()
  const router = useRouter()

  const pageName =
    Object.entries(pageNames).find(([key]) => pathname.startsWith(key))?.[1] ??
    'Dashboard'

  return (
    <header className="flex items-center justify-between px-6 h-16 border-b border-gray-200 bg-white sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-gray-700 font-medium text-sm">{pageName}</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="rounded-full w-8 h-8 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-xs font-medium">J</span>
          </div>
          <span className="text-sm text-gray-700 hidden sm:block">John Doe</span>
          <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
        </div>
      </div>
    </header>
  )
}
