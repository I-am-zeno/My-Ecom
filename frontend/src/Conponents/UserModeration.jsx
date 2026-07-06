import { useState, useEffect } from 'react'
import { ChevronRight, UserCheck, UserX } from 'lucide-react'
import { api } from '../services/api'

const UserModeration = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { users } = await api.get('/auth/users')
      setUsers(users.slice(0, 4))
    } catch {
      setUsers([])
    }
  }

  const toggleStatus = async (id, current) => {
    try {
      await api.put(`/auth/users/${id}`, { status: current === 'Active' ? 'Suspended' : 'Active' })
      fetchUsers()
    } catch {}
  }

  return (
    <div className="bg-surface rounded-xl border border-card-border shadow-[var(--card-shadow)] p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm md:text-base font-semibold text-text-main">Quick Moderation</h2>
        <a href="/users" className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover transition-colors">
          View All <ChevronRight size={14} />
        </a>
      </div>
      <div className="space-y-2">
        {users.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-4">No users to display.</p>
        ) : users.map((u) => (
          <div key={u._id} className="flex items-center justify-between gap-2 p-3 rounded-lg hover:bg-element transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                {u.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-main truncate">{u.name}</p>
                <p className="text-xs text-text-muted truncate">{u.email}</p>
              </div>
            </div>
            <button
              onClick={() => toggleStatus(u._id, u.status)}
              className={`shrink-0 flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                u.status === 'Active'
                  ? 'border-red-200 text-red-600 hover:bg-red-50'
                  : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              {u.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}
              {u.status === 'Active' ? 'Suspend' : 'Activate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserModeration
