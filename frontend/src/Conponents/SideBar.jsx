import { useNavigate, NavLink } from 'react-router-dom'
import { ShoppingCart, LayoutDashboard, Users, Package, Settings, LogOut, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const adminNav = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Users', path: '/users', icon: Users },
  { label: 'Products', path: '/products', icon: Package },
  { label: 'Settings', path: '/settings', icon: Settings },
]

const editorNav = [
  { label: 'Products', path: '/products', icon: Package },
]

const SideBar = ({ mobileOpen, onClose }) => {
  const { user, logout } = useAuth()
  const isAdmin = user?.role === 'Admin'
  const navItems = isAdmin ? adminNav : editorNav
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const content = (
    <>
      <div className="flex items-center gap-3 px-6 py-6 border-b border-card-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-text-on-primary">
          <ShoppingCart size={18} />
        </div>
        <span className="text-lg font-bold text-text-main">My E-com</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={label}
            to={path}
            end={path === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-muted hover:text-text-main hover:bg-element'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-6 pt-4 border-t border-card-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger-bg transition-colors duration-150 text-sm font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />
      )}

      {/* Mobile drawer */}
      <aside className={`fixed top-0 left-0 z-50 flex flex-col h-screen w-64 bg-surface shadow-xl transition-transform duration-300 md:hidden shrink-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-end px-4 pt-4">
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-element transition-colors">
            <X size={20} className="text-text-muted" />
          </button>
        </div>
        {content}
      </aside>

      {/* Desktop sidebar hidden on mobile */}
      <aside className="hidden md:flex sticky top-0 left-0 flex-col h-screen w-64 bg-surface border-r border-card-border shadow-[var(--card-shadow)] shrink-0">
        {content}
      </aside>
    </>
  )
}

export default SideBar
