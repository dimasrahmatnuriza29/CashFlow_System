import { Menu } from 'lucide-react'
import { SailingShip } from '@/components/ocean-anim'

export function Header({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-sky-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between relative overflow-hidden">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-sky-50 transition-colors"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5 text-navy" />
        </button>
        <h2 className="text-lg md:text-xl font-semibold text-navy">{title}</h2>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:block w-40 h-24 opacity-50">
          <SailingShip className="w-full h-full" />
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-navy to-ocean flex items-center justify-center text-sm font-semibold text-white shadow-md">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-navy leading-tight">Admin</p>
            <p className="text-xs text-sky-500">PT Nusantara Maritime Charter</p>
          </div>
        </div>
      </div>
    </header>
  )
}
