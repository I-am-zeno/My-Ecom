import { useState, useEffect } from 'react'
import { TrendingUp, Users, ShoppingCart, DollarSign, CheckCircle, Clock, XCircle, Target } from 'lucide-react'
import { api } from '../services/api'

const StatCards = () => {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get('/dashboard/stats')
        setStats(data.stats)
      } catch {
        setStats(null)
      }
    }
    fetchStats()
  }, [])

  const fmt = (val) => val != null ? Number(val).toLocaleString() : '—'
  const cur = (val) => val != null ? `$${Number(val).toLocaleString()}` : '—'

  const row1 = [
    { label: 'Total Revenue', value: cur(stats?.totalRevenue), icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Total Users', value: fmt(stats?.totalUsers), icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Active Users', value: fmt(stats?.activeUsers), icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-50' },
    { label: 'Conversion Rate', value: stats?.conversionRate != null ? `${stats.conversionRate}%` : '—', icon: Target, color: 'text-amber-500', bg: 'bg-amber-50' },
  ]

  const row2 = [
    { label: 'Total Orders', value: fmt(stats?.totalOrders), icon: ShoppingCart, color: 'text-sky-500', bg: 'bg-sky-50' },
    { label: 'Completed', value: fmt(stats?.completedOrders), icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Pending', value: fmt(stats?.pendingOrders), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Cancelled', value: fmt(stats?.cancelledOrders), icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ]

  const Card = ({ s }) => {
    const Icon = s.icon
    return (
      <div className="bg-surface rounded-xl border border-card-border shadow-[var(--card-shadow)] p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-text-muted uppercase tracking-wide">{s.label}</span>
          <div className={`p-2 rounded-lg ${s.bg}`}>
            <Icon size={18} className={s.color} />
          </div>
        </div>
        <span className="text-2xl font-bold text-text-main">{s.value}</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {[...row1, ...row2].map(s => <Card key={s.label} s={s} />)}
    </div>
  )
}

export default StatCards
