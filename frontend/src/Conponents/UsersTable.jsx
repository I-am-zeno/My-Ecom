import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight, MoreVertical, Shield, Trash2, UserX, UserCheck } from 'lucide-react'
import { api } from '../services/api'

const roles = ['Admin', 'Editor', 'User']

const UsersTable = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [menu, setMenu] = useState(null)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)

  useEffect(() => {
    fetchUsers()
    const interval = setInterval(fetchUsers, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { users } = await api.get('/auth/users')
      setUsers(users)
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return users
    const q = search.toLowerCase()
    return users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }, [search, users])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const updateUser = async (id, patch) => {
    try {
      const { user } = await api.put(`/auth/users/${id}`, patch)
      setUsers(prev => prev.map(u => u._id === id ? user : u))
    } catch {
      // silently fail
    }
  }

  const deleteUser = async id => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/auth/users/${id}`)
      setUsers(prev => prev.filter(u => u._id !== id))
    } catch {
      // silently fail
    }
  }

  const toggleStatus = async (id, current) => {
    await updateUser(id, { status: current === 'Active' ? 'Suspended' : 'Active' })
  }

  const openMenu = useCallback((id, e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMenuPos({ top: rect.bottom + 4, left: rect.right - 176 })
    setMenu(id)
  }, [])

  const closeMenu = useCallback(() => setMenu(null), [])

  const selectedUser = menu ? paginated.find(u => u._id === menu) : null

  return (
    <div className="bg-surface rounded-xl border border-card-border shadow-[var(--card-shadow)]">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 md:p-5 border-b border-card-border">
        <div className="flex items-center gap-2">
          <h1 className="text-base md:text-lg font-semibold text-text-main">Users</h1>
          <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg bg-element text-text-main text-sm placeholder:text-text-muted border border-card-border outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
          <select
            value={perPage}
            onChange={e => { setPerPage(Number(e.target.value)); setPage(1) }}
            className="text-xs bg-element text-text-muted border border-card-border rounded-lg px-2 py-2 outline-none"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border text-left text-xs font-medium text-text-muted uppercase tracking-wide">
              <th className="py-3.5 px-5">Name</th>
              <th className="py-3.5 px-5">Email</th>
              <th className="py-3.5 px-5">Role</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5">Joined</th>
              <th className="py-3.5 px-5 w-12" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-text-muted">
                  Loading users...
                </td>
              </tr>
            ) : paginated.map(u => (
              <tr key={u._id} className="border-b border-card-border last:border-0 hover:bg-element/50 transition-colors">
                <td className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                      {u.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-text-main">{u.name}</span>
                  </div>
                </td>
                <td className="py-3 px-5 text-text-muted">{u.email}</td>
                <td className="py-3 px-5">
                  <select
                    value={u.role}
                    onChange={e => updateUser(u._id, { role: e.target.value })}
                    className="text-xs bg-element text-text-main border border-card-border rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td className="py-3 px-5">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                    u.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-red-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {u.status}
                  </span>
                </td>
                <td className="py-3 px-5 text-text-muted">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-5">
                  <button
                    onClick={e => openMenu(u._id, e)}
                    className="p-1 rounded-md text-text-muted hover:text-text-main hover:bg-element transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!loading && paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-text-muted">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 md:px-5 py-3.5 border-t border-card-border">
        <span className="text-xs text-text-muted">
          Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-md text-text-muted hover:text-text-main hover:bg-element transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                p === page
                  ? 'bg-primary text-text-on-primary'
                  : 'text-text-muted hover:text-text-main hover:bg-element'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-md text-text-muted hover:text-text-main hover:bg-element transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Fixed dropdown menu */}
      {menu && selectedUser && (
        <>
          <div className="fixed inset-0 z-30" onClick={closeMenu} />
          <div
            className="fixed z-40 w-44 bg-surface border border-card-border rounded-xl shadow-lg py-1.5"
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            <button
              onClick={() => { toggleStatus(selectedUser._id, selectedUser.status); closeMenu() }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-text-main hover:bg-element transition-colors"
            >
              {selectedUser.status === 'Active' ? <UserX size={15} /> : <UserCheck size={15} />}
              {selectedUser.status === 'Active' ? 'Suspend' : 'Activate'}
            </button>
            <button
              onClick={closeMenu}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-text-main hover:bg-element transition-colors"
            >
              <Shield size={15} />
              Change Role
            </button>
            <hr className="my-1 border-card-border" />
            <button
              onClick={() => { deleteUser(selectedUser._id); closeMenu() }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default UsersTable
