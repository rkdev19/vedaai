import type { Metadata } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'VedaAI – AI Assessment Creator',
  description: 'Create AI-powered question papers for teachers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable} h-full`}>
      <body className="h-full">
        <div className="flex h-full">
          <Sidebar />
          {/* md:ml-[328px] = 304px sidebar + 12px left offset + 12px gap */}
          <div className="flex-1 flex flex-col md:ml-[328px] min-h-screen">
            <div className="hidden md:block">
              <TopBar />
            </div>
            {/* pt-[72px] mobile = fixed header(56) + gap; pb-[96px] = floating nav(72) + gap(12) + breathing */}
            <main className="flex-1 p-4 md:p-6 pt-[72px] md:pt-6 pb-[96px] md:pb-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
