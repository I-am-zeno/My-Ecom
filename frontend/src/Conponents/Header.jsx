import { Search, Bell, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Header = ({ onMenuClick }) => {
  const { user } = useAuth()
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : '?'

  return (
    <header className="sticky top-0 z-10 flex items-center h-16 px-4 md:px-6 bg-surface border-b border-card-border shadow-[var(--card-shadow)]">
      <button onClick={onMenuClick} className="md:hidden p-2 mr-2 rounded-lg hover:bg-element transition-colors">
        <Menu size={20} className="text-text-main" />
      </button>

      <div className="relative max-w-md w-full hidden sm:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-element text-text-main text-sm placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
      </div>

      <div className="flex-1 flex items-center justify-end gap-3 md:gap-4">
        <button className="relative p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-element transition-colors">
          <Bell size={20} />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="text-sm font-medium text-text-main hidden sm:block">{user?.name}</span>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-text-on-primary text-sm font-semibold shrink-0">
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
