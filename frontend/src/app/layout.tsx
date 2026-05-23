import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'

export const metadata: Metadata = {
  title: 'VedaAI – AI Assessment Creator',
  description: 'Create AI-powered question papers for teachers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gray-50">
        <div className="flex h-full">
          <Sidebar />
          <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
            {/* TopBar: desktop only */}
            <div className="hidden md:block">
              <TopBar />
            </div>
            {/* main: pt-14 on mobile (for fixed header), pb-20 on mobile (for bottom nav) */}
            <main className="flex-1 p-6 pt-20 md:pt-6 pb-24 md:pb-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
