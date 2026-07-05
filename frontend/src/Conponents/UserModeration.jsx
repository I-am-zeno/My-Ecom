import React from 'react'
import { ChevronRight } from 'lucide-react'

const pendingUsers = [
  { name: 'John Doe', email: 'john@example.com', action: 'Approve' },
  { name: 'Jane Smith', email: 'jane@example.com', action: 'Review' },
  { name: 'Bob Wilson', email: 'bob@example.com', action: 'Approve' },
  { name: 'Alice Lee', email: 'alice@example.com', action: 'Suspend' },
]

const UserModeration = () => {
  return (
    <div className="bg-surface rounded-xl border border-card-border shadow-[var(--card-shadow)] p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm md:text-base font-semibold text-text-main">Quick Moderation</h2>
        <button className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover transition-colors">
          View All <ChevronRight size={14} />
        </button>
      </div>
      <div className="space-y-2">
        {pendingUsers.map((u) => (
          <div key={u.email} className="flex items-center justify-between gap-2 p-3 rounded-lg hover:bg-element transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                {u.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-main truncate">{u.name}</p>
                <p className="text-xs text-text-muted truncate">{u.email}</p>
              </div>
            </div>
            <button className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              u.action === 'Approve'
                ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                : u.action === 'Review'
                ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
                : 'border-red-200 text-red-600 hover:bg-red-50'
            }`}>
              {u.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserModeration
