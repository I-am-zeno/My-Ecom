import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react'
import { api } from '../services/api'

const statusConfig = {
  Completed: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  Pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
  Cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
}

const TransactionsTable = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { orders } = await api.get('/orders')
      setOrders(orders)
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface rounded-xl border border-card-border shadow-[var(--card-shadow)] p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm md:text-base font-semibold text-text-main">Recent Transactions</h2>
        <button className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover transition-colors">
          View All <ChevronRight size={14} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border text-left text-xs font-medium text-text-muted uppercase tracking-wide">
              <th className="pb-3 pr-4">Invoice</th>
              <th className="pb-3 pr-4">Customer</th>
              <th className="pb-3 pr-4">Amount</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-text-muted">
                  Loading...
                </td>
              </tr>
            ) : orders.map((o, i) => {
              const cfg = statusConfig[o.status] || statusConfig.Pending
              const StatusIcon = cfg.icon
              return (
                <tr key={o._id} className="border-b border-card-border last:border-0">
                  <td className="py-3 pr-4 font-medium text-text-main">#INV-{(i + 1).toString().padStart(3, '0')}</td>
                  <td className="py-3 pr-4 text-text-muted">{o.user?.name || 'Unknown'}</td>
                  <td className="py-3 pr-4 font-medium text-text-main">+${o.total.toFixed(2)}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.color} ${cfg.bg} px-2 py-1 rounded-full`}>
                      <StatusIcon size={14} />
                      {o.status}
                    </span>
                  </td>
                  <td />
                </tr>
              )
            })}
            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-text-muted">
                  No transactions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TransactionsTable
