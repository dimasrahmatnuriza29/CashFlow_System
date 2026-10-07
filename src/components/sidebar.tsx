'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ArrowLeftRight, Users, Wallet, Ship as ShipIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CompanyLogo } from '@/components/company-logo'
import { SteeringWheel } from '@/components/ocean-anim'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cashflow', label: 'Cashflow', icon: ArrowLeftRight },
  { href: '/payroll', label: 'Payroll', icon: Wallet },
  { href: '/vessels', label: 'Vessels', icon: ShipIcon },
  { href: '/employees', label: 'Employees', icon: Users },
]

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'w-64 sidebar-gradient text-white flex flex-col h-screen fixed top-0 left-0 z-50 transition-transform duration-300 overflow-hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:sticky'
        )}
      >
        {/* Animated waves at bottom of sidebar */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 opacity-10 overflow-hidden">
          <svg className="absolute bottom-0 w-[200%] animate-wave-slow" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#7dd3fc" d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z" />
          </svg>
        </div>

        {/* Logo & Company Name */}
        <div className="px-6 py-5 border-b border-sky-800/50 relative z-10">
          <div className="flex items-center gap-3">
            <CompanyLogo className="w-10 h-10" />
            <div>
              <h1 className="text-base font-bold leading-tight">PT Nusantara Maritime</h1>
              <p className="text-xs text-sky-300">Charter Finance</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1 relative z-10">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-sky-400/20 text-sky-100 shadow-sm border border-sky-400/30'
                    : 'text-sky-200/70 hover:text-white hover:bg-sky-800/40'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Scattered steering wheels - 5 total, all spinning */}
        <div className="flex-1 relative z-10 min-h-[180px] md:min-h-[280px]">
          <SteeringWheel className="absolute top-1 left-2 w-12 h-12 md:w-14 md:h-14 opacity-25" spin />
          <SteeringWheel className="absolute top-8 right-2 w-20 h-20 md:w-28 md:h-28 opacity-40" spin />
          <SteeringWheel className="absolute top-1/2 -translate-y-1/2 left-4 w-16 h-16 md:w-20 md:h-20 opacity-30" spin />
          <SteeringWheel className="absolute bottom-10 right-1 w-12 h-12 md:w-16 md:h-16 opacity-25" spin />
          <SteeringWheel className="absolute bottom-1 left-6 w-18 h-18 md:w-24 md:h-24 opacity-35" spin />
        </div>

        {/* User info */}
        <div className="px-3 py-4 border-t border-sky-800/50 relative z-10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-sky-700 flex items-center justify-center text-sm font-semibold text-sky-100">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-sky-100">Admin</p>
              <p className="text-xs text-sky-400 truncate">admin@caashflow.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
