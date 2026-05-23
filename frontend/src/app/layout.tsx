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
            <TopBar />
            <main className="flex-1 p-6 pb-20 md:pb-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
