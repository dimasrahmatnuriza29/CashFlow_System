'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { OceanWaves } from '@/components/ocean-anim'

export default function AppLayout({
  children,
  title = 'Dashboard',
}: {
  children: React.ReactNode
  title?: string
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gradient-to-b from-sky-50 to-blue-50 relative overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative z-10">
          {children}
        </main>
        <OceanWaves />
      </div>
    </div>
  )
}
